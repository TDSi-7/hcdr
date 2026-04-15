"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { quizLabelByQuestionAndValue } from "@/lib/quiz-data";
import { getResultCards, getSupplyNudge } from "@/lib/result-content";
import { getProfile } from "@/lib/result-logic";
import { clearQuizState, getOrCreateSessionId, loadAnswers, saveProfile } from "@/lib/storage";
import { trackQuizEvent } from "@/lib/tracking";

const guideUrl = "https://healthcaredeliveryreviews.co.uk/the-ultimate-guide-to-intermittent-self-catheterisation/";

const profileCopy = {
  A: {
    title: "Your catheter routine could be working better for you",
    body: "Based on your answers, there are options available that could make a meaningful difference to your comfort and peace of mind.",
    primaryLabel: "Yes — Connect Me With a Specialist",
    primaryHref: "/contact",
    secondaryLabel: "Download the free ISC guide instead",
    secondaryHref: guideUrl
  },
  B: {
    title: "There may be more options available to you",
    body: "Your routine seems manageable, but there are options you may not have explored yet.",
    primaryLabel: "Yes — Connect Me With a Specialist",
    primaryHref: "/contact",
    secondaryLabel: "Download the free ISC guide instead",
    secondaryHref: guideUrl
  },
  C: {
    title: "Great news — your routine is working well",
    body: "It sounds like you're well-supported and happy with your current setup. That's really positive. If your needs ever change, or you'd like to explore other options in the future, specialist catheter providers are available to help. In the meantime, our free ISC guide has practical tips on travel, work, and hygiene.",
    primaryLabel: "Download the Free ISC Guide",
    primaryHref: guideUrl,
    secondaryLabel: "I'd still like to hear from a specialist provider",
    secondaryHref: "/contact"
  }
} as const;

export default function ResultsPage() {
  const [answers, setAnswers] = useState<Record<number, string> | null>(null);
  const router = useRouter();
  const hasTrackedView = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const storedAnswers = loadAnswers();
    if (!storedAnswers[1]) {
      router.replace("/quiz");
      return;
    }
    setAnswers(storedAnswers);
  }, [router]);

  const profile = useMemo(() => {
    if (!answers) return null;
    const calculated = getProfile(answers);
    saveProfile(calculated);
    return calculated;
  }, [answers]);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = getOrCreateSessionId();
    }
  }, []);

  useEffect(() => {
    if (!answers || !profile) return;
    if (hasTrackedView.current) return;
    if (!sessionIdRef.current) return;

    hasTrackedView.current = true;
    void trackQuizEvent({
      sessionId: sessionIdRef.current,
      eventType: "results_viewed",
      profile,
      answers
    });
  }, [answers, profile]);

  if (!answers || !profile) return null;

  const copy = profileCopy[profile];
  const topPriority = quizLabelByQuestionAndValue[6]?.[answers[6]] ?? "Not provided";
  const topFrustration = quizLabelByQuestionAndValue[3]?.[answers[3]] ?? "Not provided";
  const supplyMethod = quizLabelByQuestionAndValue[7]?.[answers[7]] ?? "Not provided";
  const insightCards = getResultCards(answers[3], answers[6]);
  const supplyNudge = getSupplyNudge(answers[7]);
  const sessionId = sessionIdRef.current ?? "unknown";

  return (
    <main className="bg-hcdr-warm">
      <Header />
      <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <SmartImage
            src="/images/quiz-results.png"
            alt="Assessment results"
            width={560}
            height={560}
            className="h-auto w-full rounded-lg bg-white p-3 object-contain md:sticky md:top-6"
          />
          <div className="space-y-4">
            <article className="rounded-lg border border-hcdr-light-grey bg-white p-5 shadow-sm">
              <h1 className="text-2xl font-semibold text-hcdr-dark">{copy.title}</h1>
              <p className="mt-3 leading-relaxed text-hcdr-body">{copy.body}</p>
            </article>
            {insightCards.map((card) => (
              <article
                key={card.title}
                className="rounded-lg border-l-4 border-hcdr-orange bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <h2 className="text-lg font-semibold text-hcdr-dark">{card.title}</h2>
                <p className="mt-2 text-[15px] leading-[1.7] text-hcdr-body">{card.body}</p>
              </article>
            ))}
            {supplyNudge ? (
              <div className="rounded-lg border border-hcdr-orange bg-hcdr-orange-light p-4 text-sm text-hcdr-dark">{supplyNudge}</div>
            ) : null}
            <div className="rounded-lg border border-hcdr-light-grey bg-hcdr-light-grey p-5 shadow-sm">
              <p className="font-semibold text-hcdr-dark">Your top priority: {topPriority}</p>
              <p className="mt-2 text-hcdr-body">Your biggest frustration: {topFrustration}</p>
              <p className="mt-2 text-hcdr-body">Current supply method: {supplyMethod}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={copy.primaryHref}
                target={copy.primaryHref.startsWith("http") ? "_blank" : undefined}
                className="rounded-lg bg-hcdr-orange px-5 py-3 text-center font-semibold text-white transition hover:bg-hcdr-orange-hover"
                onClick={() =>
                  void trackQuizEvent({
                    sessionId,
                    eventType: copy.primaryHref === "/contact" ? "connect_clicked" : "guide_clicked",
                    profile
                  })
                }
              >
                {copy.primaryLabel}
              </Link>
              <Link
                href={copy.secondaryHref}
                target={copy.secondaryHref.startsWith("http") ? "_blank" : undefined}
                className="text-sm text-hcdr-orange-hover underline"
                onClick={() =>
                  void trackQuizEvent({
                    sessionId,
                    eventType: copy.secondaryHref === "/contact" ? "connect_clicked" : "guide_clicked",
                    profile
                  })
                }
              >
                {copy.secondaryLabel}
              </Link>
              <button
                type="button"
                onClick={() => {
                  void trackQuizEvent({
                    sessionId,
                    eventType: "start_over_clicked",
                    profile
                  });
                  clearQuizState();
                  router.push("/");
                }}
                className="text-left text-sm text-hcdr-orange-hover underline"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
