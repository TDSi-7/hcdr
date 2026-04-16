"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmartImage } from "@/components/SmartImage";
import { quizLabelByQuestionAndValue } from "@/lib/quiz-data";
import { getCardPreview, getResultCards, getSupplyNudge } from "@/lib/result-content";
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
    body: "It sounds like you're well-supported and happy with your current setup. That's really positive.",
    primaryLabel: "Download the Free ISC Guide",
    primaryHref: guideUrl,
    secondaryLabel: "I'd still like to hear from a specialist provider",
    secondaryHref: "/contact"
  }
} as const;

export default function ResultsPage() {
  const [answers, setAnswers] = useState<Record<number, string> | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
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

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="bg-hcdr-warm">
      <Header />
      <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <div className="grid items-start gap-6 md:grid-cols-[220px_1fr] md:gap-8">
          <div className="mx-auto mb-4 flex h-[140px] w-[140px] items-center justify-center rounded-full bg-[#FFF3E8] md:mb-0 md:h-[180px] md:w-[180px]">
            <SmartImage
              src="/images/quiz-results.png"
              alt="Assessment results"
              width={180}
              height={180}
              className="h-[120px] w-[120px] object-contain md:h-[150px] md:w-[150px]"
            />
          </div>

          <div>
            <article>
              <h1 className="text-[20px] font-semibold text-hcdr-dark">{copy.title}</h1>
              <p className="mb-4 mt-2 text-[14px] leading-relaxed text-hcdr-body">{copy.body}</p>
            </article>

            <div className="flex flex-wrap gap-3">
              <article className="min-w-[140px] flex-1 rounded-md border border-[#E5E5E5] bg-[#FFFAF5] px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#999999]">Top Priority</p>
                <p className="mt-1 text-[13px] font-medium text-hcdr-dark">{topPriority}</p>
              </article>
              <article className="min-w-[140px] flex-1 rounded-md border border-[#E5E5E5] bg-[#FFFAF5] px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#999999]">Frustration</p>
                <p className="mt-1 text-[13px] font-medium text-hcdr-dark">{topFrustration}</p>
              </article>
              <article className="min-w-[140px] flex-1 rounded-md border border-[#E5E5E5] bg-[#FFFAF5] px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#999999]">Supply Method</p>
                <p className="mt-1 text-[13px] font-medium text-hcdr-dark">{supplyMethod}</p>
              </article>
            </div>

            <div className="mt-4 space-y-[10px]">
          {insightCards.map((card) => {
            const isExpanded = Boolean(expandedCards[card.title]);
            return (
              <article
                key={card.title}
                className="border-l-[3px] border-hcdr-orange px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => toggleCard(card.title)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div>
                    <h2 className="text-[15px] font-medium text-hcdr-dark">{card.title}</h2>
                    {!isExpanded ? (
                      <p className="mt-1 truncate text-[13px] text-[#999999]">{getCardPreview(card.body)}</p>
                    ) : null}
                  </div>
                  <span className={`text-[14px] text-hcdr-orange transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>
                {isExpanded ? (
                  <div
                    className="mt-3 space-y-3 text-[13px] leading-[1.7] text-hcdr-body"
                    dangerouslySetInnerHTML={{ __html: card.body.replace(/\n\n/g, "</p><p>").replace(/^/, "<p>").concat("</p>") }}
                  />
                ) : null}
              </article>
            );
          })}
            </div>

            {supplyNudge ? (
              <div className="mt-4 flex items-start gap-2 rounded-md bg-hcdr-orange-light px-3 py-[10px] text-[13px] leading-[1.5] text-hcdr-body">
                <span className="mt-[1px] text-base leading-none">💡</span>
                <p>{supplyNudge.replace(/^💡\s*/, "")}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-2 w-full max-w-5xl px-4 pb-8 md:px-6">
        <div className="rounded-xl bg-hcdr-orange-light px-5 py-7 text-center md:px-8">
          <div className="mx-auto flex w-full max-w-[600px] flex-col items-center text-center">
            <SmartImage
              src="/images/quiz-connect.png"
              alt="Connect with specialist support"
              width={80}
              height={80}
              className="mb-3 h-auto w-[80px] object-contain"
            />
            <p className="mb-4 text-[14px] text-hcdr-body">
              A specialist provider can discuss your options with you. It&apos;s free, confidential, and there&apos;s no
              obligation.
            </p>
            <Link
              href={copy.primaryHref}
              target={copy.primaryHref.startsWith("http") ? "_blank" : undefined}
              className="w-full rounded-lg bg-hcdr-orange px-8 py-[14px] text-center text-[16px] font-medium text-white shadow-[0_4px_12px_rgba(232,119,34,0.3)] transition hover:bg-hcdr-orange-hover md:w-auto"
              onClick={() =>
                void trackQuizEvent({
                  sessionId,
                  eventType: copy.primaryHref === "/contact" ? "connect_clicked" : "guide_clicked",
                  profile
                })
              }
            >
              {copy.primaryLabel === "Yes — Connect Me With a Specialist"
                ? "Yes — Connect me with a specialist"
                : copy.primaryLabel}
            </Link>

            <div className="mt-[14px] flex flex-wrap items-center justify-center gap-2 text-[12px] text-[#999999] opacity-70">
              <Link
                href={copy.secondaryHref}
                target={copy.secondaryHref.startsWith("http") ? "_blank" : undefined}
                className="hover:underline"
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
              <span aria-hidden>·</span>
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
                className="hover:underline"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <style jsx global>{`
        /* reserved for results page animations */
      `}</style>
    </main>
  );
}
