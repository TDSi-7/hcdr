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
        <SmartImage
          src="/images/quiz-results.png"
          alt="Assessment results"
          width={760}
          height={360}
          className="mx-auto h-auto w-full max-w-2xl rounded-lg bg-white p-3 object-contain"
        />

        <article className="mt-6 rounded-lg border border-hcdr-light-grey bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-hcdr-dark">{copy.title}</h1>
          <p className="mt-3 leading-relaxed text-hcdr-body">{copy.body}</p>
        </article>

        <div className="mt-4 rounded-lg border border-[#F3E2D7] bg-[#FFFAF5] px-4 py-3 text-[14px] text-hcdr-body md:flex md:items-center md:gap-4">
          <p>
            <strong className="text-hcdr-dark">Your top priority:</strong> {topPriority}
          </p>
          <p>
            <strong className="text-hcdr-dark">Your biggest frustration:</strong> {topFrustration}
          </p>
          <p>
            <strong className="text-hcdr-dark">Current supply method:</strong> {supplyMethod}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {insightCards.map((card) => {
            const isExpanded = Boolean(expandedCards[card.title]);
            return (
              <article
                key={card.title}
                className="rounded-lg border-l-4 border-hcdr-orange bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-[fadeIn_260ms_ease-out]"
              >
                <button
                  type="button"
                  onClick={() => toggleCard(card.title)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-hcdr-dark">{card.title}</h2>
                    {!isExpanded ? (
                      <p className="mt-1 truncate text-sm text-[#777777]">{getCardPreview(card.body)}</p>
                    ) : null}
                  </div>
                  <span className={`text-sm text-hcdr-orange transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>
                {isExpanded ? (
                  <div
                    className="mt-3 space-y-3 text-[15px] leading-[1.7] text-hcdr-body"
                    dangerouslySetInnerHTML={{ __html: card.body.replace(/\n\n/g, "</p><p>").replace(/^/, "<p>").concat("</p>") }}
                  />
                ) : null}
              </article>
            );
          })}
        </div>

        {supplyNudge ? (
          <div className="mt-5 rounded-lg border border-hcdr-orange bg-hcdr-orange-light p-4 text-sm text-hcdr-dark">{supplyNudge}</div>
        ) : null}
      </section>

      <section className="mt-10 bg-hcdr-orange-light px-4 py-8 md:py-10">
        <div className="mx-auto flex w-full max-w-[600px] flex-col items-center text-center">
          <SmartImage
            src="/images/quiz-connect.png"
            alt="Connect with specialist support"
            width={120}
            height={120}
            className="h-auto w-[120px] object-contain"
          />
          <p className="mt-4 text-[15px] text-hcdr-body">
            A specialist provider can discuss your options with you. It&apos;s free, confidential, and there&apos;s no
            obligation.
          </p>
          <Link
            href={copy.primaryHref}
            target={copy.primaryHref.startsWith("http") ? "_blank" : undefined}
            className="mt-5 w-full rounded-lg bg-hcdr-orange px-8 py-4 text-center text-lg font-semibold text-white shadow-[0_4px_12px_rgba(232,119,34,0.3)] transition hover:bg-hcdr-orange-hover md:w-auto md:min-w-[420px] animate-[ctaPulse_900ms_ease-out_1]"
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

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#999999]">
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
      </section>
      <Footer />
      <style jsx global>{`
        @keyframes ctaPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(232, 119, 34, 0.45);
          }
          100% {
            box-shadow: 0 0 0 14px rgba(232, 119, 34, 0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
