"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { restaurantRegistrationSchema, type RestaurantRegistrationInput } from "@/lib/validations/auth";

const fields: Array<{ name: keyof RestaurantRegistrationInput; label: string; type?: string; placeholder: string; required?: boolean }> = [
  { name: "ownerName", label: "Owner name", placeholder: "Aarav Mehta", required: true },
  { name: "restaurantName", label: "Restaurant name", placeholder: "The Copper Table", required: true },
  { name: "restaurantType", label: "Restaurant type", placeholder: "Family restaurant", required: true },
  { name: "cuisine", label: "Cuisine", placeholder: "North Indian, Chinese", required: true },
  { name: "email", label: "Email", type: "email", placeholder: "owner@restaurant.com", required: true },
  { name: "phone", label: "Phone", placeholder: "+91 98765 43210", required: true },
  { name: "password", label: "Password", type: "password", placeholder: "Minimum 8 characters", required: true },
  { name: "city", label: "City", placeholder: "Mumbai", required: true },
  { name: "state", label: "State", placeholder: "Maharashtra", required: true },
  { name: "address", label: "Address", placeholder: "Street, landmark, locality", required: true },
  { name: "upiId", label: "UPI ID", placeholder: "restaurant@oksbi", required: true },
  { name: "upiDisplayName", label: "UPI display name", placeholder: "The Copper Table", required: true },
  { name: "fssaiNumber", label: "FSSAI number", placeholder: "12345678901234", required: true },
  { name: "googleMapsUrl", label: "Google Maps URL", placeholder: "https://maps.google.com/..." },
];

async function readErrorMessage(response: Response) {
  const fallback = response.statusText || "Registration failed.";
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();
    return text.trim() || fallback;
  }

  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export function OwnerRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fssaiCertificate, setFssaiCertificate] = useState<File | null>(null);
  const [storefrontPhoto, setStorefrontPhoto] = useState<File | null>(null);
  const [businessProof, setBusinessProof] = useState<File | null>(null);
  const form = useForm<RestaurantRegistrationInput>({
    resolver: zodResolver(restaurantRegistrationSchema),
  });

  async function onSubmit(values: RestaurantRegistrationInput) {
    if (!fssaiCertificate || !storefrontPhoto) {
      toast.error("Add the FSSAI certificate and a storefront photo before registering.");
      return;
    }

    setIsSubmitting(true);

    try {
      const registration = new FormData();
      Object.entries(values).forEach(([key, value]) => registration.append(key, value ?? ""));
      registration.append("fssaiCertificate", fssaiCertificate);
      registration.append("storefrontPhoto", storefrontPhoto);

      if (businessProof) {
        registration.append("businessProof", businessProof);
      }

      const response = await fetch("/api/auth/register-restaurant", {
        method: "POST",
        body: registration,
      });

      if (!response.ok) {
        toast.error(await readErrorMessage(response));
        return;
      }

      const result = (await response.json()) as { requiresEmailConfirmation?: boolean };
      toast.success(
        result.requiresEmailConfirmation
          ? "Registration received. Confirm your email before signing in."
          : "Restaurant created. Sign in to continue while verification is reviewed.",
      );
      router.push("/auth/owner?mode=login");
      router.refresh();
    } catch {
      toast.error("Registration could not be completed. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3.5 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={`grid gap-1.5 ${field.name === "address" ? "sm:col-span-2" : ""}`}>
          <label className="text-xs font-semibold text-zinc-300">
            {field.label} {field.required ? <span className="text-orange-400">*</span> : null}
          </label>
          <Input
            type={field.type}
            placeholder={field.placeholder}
            className="h-11 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            {...form.register(field.name)}
          />
          {form.formState.errors[field.name]?.message ? (
            <span className="text-xs text-rose-400">{form.formState.errors[field.name]?.message}</span>
          ) : null}
        </div>
      ))}

      <VerificationFileField
        label="FSSAI certificate"
        required
        accept="application/pdf,image/jpeg,image/png,image/webp"
        onChange={setFssaiCertificate}
      />
      <VerificationFileField
        label="Storefront photo"
        required
        accept="image/jpeg,image/png,image/webp"
        onChange={setStorefrontPhoto}
      />
      <div className="sm:col-span-2">
        <VerificationFileField
          label="Business proof (optional)"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          onChange={setBusinessProof}
        />
      </div>

      <div className="mt-3 sm:col-span-2">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition duration-150 cursor-pointer"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Restaurant & Start Free Trial
        </Button>
      </div>
    </form>
  );
}

function VerificationFileField({
  label,
  required = false,
  accept,
  onChange,
}: {
  label: string;
  required?: boolean;
  accept: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="grid gap-1.5 rounded-xl border border-white/15 bg-white/[0.03] p-3.5 text-sm text-zinc-300 transition hover:border-white/25">
      <span className="text-xs font-semibold text-zinc-200">
        {label}
        {required ? <span className="ml-1 text-orange-400">*</span> : null}
      </span>
      <Input
        type="file"
        accept={accept}
        required={required}
        className="h-auto border-0 bg-transparent p-0 text-xs text-zinc-400 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-amber-500 file:to-orange-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:opacity-90"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <span className="text-[11px] text-zinc-500">PDF, JPEG, PNG, or WebP. Max 1.2 MB.</span>
    </div>
  );
}
