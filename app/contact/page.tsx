"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConsentForm, ContactPayload } from "@/components/ConsentForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { getOrCreateSessionId, loadAnswers, loadProfile } from "@/lib/storage";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  async function submit(payload: ContactPayload) {
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          answers: loadAnswers(),
          profile: loadProfile(),
          sessionId: getOrCreateSessionId()
        })
      });

      if (!response.ok) {
        const raw = await response.text();
        let message = "Submission failed";
        try {
          const parsed = JSON.parse(raw) as { error?: string };
          if (parsed.error) {
            message = parsed.error;
          } else if (raw) {
            message = raw;
          }
        } catch {
          if (raw) {
            message = raw;
          }
        }
        throw new Error(message);
      }
      router.push("/thank-you");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-hcdr-warm">
      <Header />
      <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <div className="grid gap-6 rounded-lg border border-hcdr-light-grey bg-white p-4 shadow-sm md:grid-cols-[280px_1fr] md:p-6">
          <SmartImage
            src="/images/quiz-connect.png"
            alt="Contact a specialist provider"
            width={560}
            height={560}
            className="h-auto w-full rounded-lg bg-white p-3 object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-hcdr-dark">Connect With a Specialist Provider</h1>
            <p className="mt-3 text-hcdr-body">
              Fill in your details below and a specialist catheter provider will be in touch to discuss your needs.
              This service is free — your catheter supplies remain funded by the NHS.
            </p>
            <div className="mt-5">
              <ConsentForm onSubmit={submit} submitting={submitting} submitError={submitError} />
            </div>
            <p className="mt-4 text-sm text-hcdr-body">
              <Link
                href="https://healthcaredeliveryreviews.co.uk/privacy-policy/"
                target="_blank"
                className="text-hcdr-orange-hover underline"
              >
                View our Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
