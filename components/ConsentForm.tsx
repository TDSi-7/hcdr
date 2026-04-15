"use client";

import { FormEvent, useState } from "react";

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentProvider: string;
  guideConsent: boolean;
  referralConsent: boolean;
};

type ConsentFormProps = {
  onSubmit: (payload: ContactPayload) => Promise<void>;
  submitting: boolean;
  submitError: string;
};

const providers = [
  "Ainsworth",
  "Amcare",
  "Bladder & Bowel Community",
  "Brunlea",
  "Bullen",
  "Clinisupplies",
  "Coloplast Charter",
  "Emerald Prescription Service",
  "Fittleworth",
  "Goldcare",
  "Medilink",
  "Moorland Surgical",
  "Nightingale",
  "Nucare",
  "Patient Choice",
  "Rapidcare",
  "Renew Medical",
  "Respond Healthcare",
  "Script Easy",
  "SecuriCare",
  "Select Home Delivery",
  "South Yorkshire OS",
  "Teleflex",
  "Vyne",
  "I don't know",
  "I don't currently have one"
];

const ukPhoneRegex = /^(\+44|0)\d{9,10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ConsentForm({ onSubmit, submitting, submitError }: ConsentFormProps) {
  const [form, setForm] = useState<ContactPayload>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentProvider: "",
    guideConsent: false,
    referralConsent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!emailRegex.test(form.email.trim())) nextErrors.email = "Please enter a valid email address";
    const cleanedPhone = form.phone.replace(/\s+/g, "");
    if (!ukPhoneRegex.test(cleanedPhone)) nextErrors.phone = "Please enter a valid UK phone number";
    if (!form.currentProvider.trim()) nextErrors.currentProvider = "Please select your current provider";
    if (!form.referralConsent) {
      nextErrors.referralConsent = "Please tick the consent box to allow specialist providers to contact you";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...form,
      phone: form.phone.replace(/\s+/g, "")
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {[
        ["firstName", "First name", "text", "First name"],
        ["lastName", "Last name", "text", "Last name"],
        ["email", "Email address", "email", "Email address"],
        ["phone", "Phone number", "tel", "Phone number"]
      ].map(([field, label, type, placeholder]) => (
        <div key={field}>
          <label className="mb-1 block text-sm font-medium text-hcdr-dark" htmlFor={field}>
            {label}
          </label>
          <input
            id={field}
            type={type}
            placeholder={placeholder}
            value={form[field as keyof ContactPayload] as string}
            onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
            className="w-full rounded-lg border border-hcdr-mid-grey px-3 py-2 text-hcdr-dark"
          />
          {errors[field] ? <p className="mt-1 text-sm text-red-700">{errors[field]}</p> : null}
        </div>
      ))}
      <div>
        <label className="mb-1 block text-sm font-medium text-hcdr-dark" htmlFor="currentProvider">
          Current provider
        </label>
        <select
          id="currentProvider"
          value={form.currentProvider}
          onChange={(e) => setForm((prev) => ({ ...prev, currentProvider: e.target.value }))}
          className="w-full rounded-lg border border-hcdr-mid-grey px-3 py-2 text-hcdr-dark"
          required
        >
          <option value="">Select your current provider...</option>
          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
        {errors.currentProvider ? <p className="mt-1 text-sm text-red-700">{errors.currentProvider}</p> : null}
      </div>

      <div className="rounded-lg border border-hcdr-light-grey bg-hcdr-warm p-4">
        <label className="flex items-start gap-3 text-sm text-hcdr-body">
          <input
            type="checkbox"
            checked={form.guideConsent}
            onChange={(e) => setForm((prev) => ({ ...prev, guideConsent: e.target.checked }))}
            className="mt-1 h-4 w-4"
          />
          <span>
            I&apos;d like to receive the free ISC guide and occasional helpful tips from Healthcare Delivery Reviews by
            email. I can unsubscribe at any time.
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-hcdr-light-grey bg-hcdr-warm p-4">
        <label className="flex items-start gap-3 text-sm text-hcdr-body">
          <input
            type="checkbox"
            checked={form.referralConsent}
            onChange={(e) => setForm((prev) => ({ ...prev, referralConsent: e.target.checked }))}
            className="mt-1 h-4 w-4"
            required
          />
          <span>
            I would like to be contacted by specialist catheter providers who can help me explore my options and find
            the right support for my needs. I understand that Healthcare Delivery Reviews will share my name, email
            address, phone number, and quiz responses with NHS-registered Dispensing Appliance Contractors for this
            purpose. I may be contacted by more than one provider. I can withdraw my consent at any time by emailing
            help@healthcaredeliveryreviews.co.uk.
          </span>
        </label>
        {errors.referralConsent ? <p className="mt-2 text-sm text-red-700">{errors.referralConsent}</p> : null}
      </div>

      {submitError ? <p className="text-sm text-red-700">{submitError}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-hcdr-orange px-5 py-3 font-semibold text-white transition hover:bg-hcdr-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Connect Me With A Specialist"}
      </button>
    </form>
  );
}
