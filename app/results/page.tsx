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
import { getOrCreateSessionId, loadAnswers, saveProfile } from "@/lib/storage";
import { trackQuizEvent } from "@/lib/tracking";

const guideUrl = "https://healthcaredeliveryreviews.co.uk/the-ultimate-guide-to-intermittent-self-catheterisation/";

type ProfileKey = "A" | "B" | "C";

const profileHeadline: Record<ProfileKey, { title: string; body: string }> = {
  A: {
    title: "Your catheter routine could be working better for you",
    body: "Based on your answers, there are specific changes that could improve your experience. Here's what we found."
  },
  B: {
    title: "There are options you may not have explored yet",
    body: "Your routine is working, but your answers suggest there's room for improvement. Here's what's worth knowing."
  },
  C: {
    title: "Your catheter routine sounds like it's working well",
    body: "That's great to hear. Here are a few things worth knowing about in case your needs change in future."
  }
};

const trustPromises = ["100% free", "No obligation", "Your data kept private", "Withdraw consent any time"];

function TrustPromiseRow() {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-hcdr-body">
      {trustPromises.map((item, idx) => (
        <span key={item} className="inline-flex items-center gap-1">
          <span className="text-hcdr-orange-hover" aria-hidden>
            ✓
          </span>
          <span>{item}</span>
          {idx < trustPromises.length - 1 ? (
            <span className="ml-3 text-[#CCCCCC]" aria-hidden>
              ·
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

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

  const profile = useMemo<ProfileKey | null>(() => {
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

  const headline = profileHeadline[profile];
  const topPriority = quizLabelByQuestionAndValue[7]?.[answers[7]] ?? "Not provided";
  const topFrustration = quizLabelByQuestionAndValue[4]?.[answers[4]] ?? "Not provided";
  const supplyMethod = quizLabelByQuestionAndValue[8]?.[answers[8]] ?? "Not provided";
  const insightCards = getResultCards(answers[4], answers[7]);
  const supplyNudge = getSupplyNudge(answers[8]);
  const sessionId = sessionIdRef.current ?? "unknown";

  const isProfileC = profile === "C";
  const callbackHref = "/contact?source=results_top";
  const bottomCallbackHref = "/contact?source=results_bottom";
  const callbackLabel = isProfileC ? "Yes — I'd Like to Hear From a Specialist" : "Yes — Request My Free Callback";

  function trackClick(target: "callback" | "guide") {
    void trackQuizEvent({
      sessionId,
      eventType: target === "callback" ? "connect_clicked" : "guide_clicked",
      profile
    });
  }

  return (
    <main className="overflow-x-hidden bg-hcdr-warm">
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
              <h1 className="text-[20px] font-semibold text-hcdr-dark md:text-[22px]">{headline.title}</h1>
              <p className="mb-4 mt-2 text-[14px] leading-relaxed text-hcdr-body">{headline.body}</p>
            </article>

            <div className="grid gap-3 md:grid-cols-3">
              <article className="min-w-0 rounded-md border border-[#E5E5E5] bg-[#FFFAF5] px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#999999]">Top Priority</p>
                <p className="mt-1 break-words text-[13px] font-medium text-hcdr-dark">{topPriority}</p>
              </article>
              <article className="min-w-0 rounded-md border border-[#E5E5E5] bg-[#FFFAF5] px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#999999]">Frustration</p>
                <p className="mt-1 break-words text-[13px] font-medium text-hcdr-dark">{topFrustration}</p>
              </article>
              <article className="min-w-0 rounded-md border border-[#E5E5E5] bg-[#FFFAF5] px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#999999]">Supply Method</p>
                <p className="mt-1 break-words text-[13px] font-medium text-hcdr-dark">{supplyMethod}</p>
              </article>
            </div>

            {/* Top CTA box — replaces previous single-line CTA */}
            {isProfileC ? (
              <section className="mt-4 rounded-xl bg-hcdr-orange-light px-5 py-7 md:px-8">
                <div className="mx-auto w-full max-w-[600px] text-center">
                  <h2 className="text-[18px] font-semibold text-hcdr-dark md:text-[20px]">
                    If you ever want to explore your options
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-hcdr-body">
                    Even though your routine is working well, a specialist catheter provider is available if you&apos;d
                    ever like to:
                  </p>
                  <ul className="mx-auto mt-3 max-w-[520px] space-y-2 text-left text-[14px] leading-relaxed text-hcdr-body">
                    <li className="flex gap-2">
                      <span className="mt-[2px] text-hcdr-orange-hover">•</span>
                      <span>Check whether newer products could offer any improvement on what you currently use</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] text-hcdr-orange-hover">•</span>
                      <span>Switch to home delivery if you&apos;re currently collecting from a pharmacy</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] text-hcdr-orange-hover">•</span>
                      <span>Ask any questions about your routine, hygiene, or what&apos;s available</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-[14px] leading-relaxed text-hcdr-body">
                    It&apos;s free, there&apos;s no obligation, and there&apos;s no pressure.
                  </p>

                  {/* Profile C: ISC guide is the primary action */}
                  <Link
                    href={guideUrl}
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackClick("guide")}
                    className="mt-5 inline-block w-full rounded-lg bg-hcdr-orange px-6 py-[14px] text-center text-[15px] font-medium leading-snug text-white shadow-[0_4px_12px_rgba(232,119,34,0.3)] transition hover:bg-hcdr-orange-hover md:w-auto"
                  >
                    Or download the free ISC guide for tips on comfort, travel, and daily routine →
                  </Link>

                  <Link
                    href={callbackHref}
                    onClick={() => trackClick("callback")}
                    className="mt-3 inline-block w-full rounded-lg border border-hcdr-orange bg-white px-6 py-[12px] text-center text-[14px] font-medium text-hcdr-orange-hover transition hover:bg-[#FFF3E8] md:w-auto"
                  >
                    {callbackLabel}
                  </Link>

                  <TrustPromiseRow />
                </div>
              </section>
            ) : (
              <section className="mt-4 rounded-xl bg-hcdr-orange-light px-5 py-7 md:px-8">
                <div className="mx-auto w-full max-w-[600px] text-center">
                  <h2 className="text-[18px] font-semibold text-hcdr-dark md:text-[20px]">Why connect with a specialist?</h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-hcdr-body">A specialist catheter provider can:</p>
                  <ul className="mx-auto mt-3 max-w-[520px] space-y-2 text-left text-[14px] leading-relaxed text-hcdr-body">
                    <li className="flex gap-2">
                      <span className="mt-[2px] text-hcdr-orange-hover">•</span>
                      <span>
                        Review your current catheter and discuss whether a different type, coating, or size could
                        improve your comfort
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] text-hcdr-orange-hover">•</span>
                      <span>
                        Help you explore the full range of products available to you — many catheter users don&apos;t
                        realise how many options exist
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] text-hcdr-orange-hover">•</span>
                      <span>
                        Set up hassle-free home delivery so your supplies arrive at your door without you chasing
                        prescriptions
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] text-hcdr-orange-hover">•</span>
                      <span>Answer your questions about hygiene, technique, and anything else on your mind</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-[14px] leading-relaxed text-hcdr-body">
                    It&apos;s a free, no-obligation conversation. You won&apos;t be pressured to switch or change
                    anything.
                  </p>

                  <Link
                    href={callbackHref}
                    onClick={() => trackClick("callback")}
                    className="mt-5 inline-block w-full rounded-lg bg-hcdr-orange px-8 py-[14px] text-center text-[16px] font-medium text-white shadow-[0_4px_12px_rgba(232,119,34,0.3)] transition hover:bg-hcdr-orange-hover md:w-auto"
                  >
                    {callbackLabel}
                  </Link>

                  <TrustPromiseRow />

                  <p className="mt-4 text-[13px] leading-relaxed text-hcdr-body">
                    Not ready to speak to someone? That&apos;s fine.{" "}
                    <Link
                      href={guideUrl}
                      target="_blank"
                      rel="noopener"
                      onClick={() => trackClick("guide")}
                      className="font-medium text-hcdr-orange-hover underline"
                    >
                      Download the free ISC guide instead →
                    </Link>
                  </p>
                </div>
              </section>
            )}

            <div className="mt-5 space-y-[10px]">
              {insightCards.map((card) => (
                <article key={card.title} className="border-l-[3px] border-hcdr-orange px-4 py-3">
                  <h2 className="text-[15px] font-medium text-hcdr-dark">{card.title}</h2>
                  <div
                    className="mt-2 space-y-3 break-words text-[13px] leading-[1.7] text-hcdr-body"
                    dangerouslySetInnerHTML={{
                      __html: card.body.replace(/\n\n/g, "</p><p>").replace(/^/, "<p>").concat("</p>")
                    }}
                  />
                </article>
              ))}
            </div>

            {supplyNudge ? (
              <div className="mt-4 flex items-start gap-2 rounded-md bg-hcdr-orange-light px-3 py-[10px] text-[13px] leading-[1.5] text-hcdr-body">
                <span className="mt-[1px] text-base leading-none">💡</span>
                <p>{supplyNudge.replace(/^💡\s*/, "")}</p>
              </div>
            ) : null}

            {/* Bottom CTA — lighter, repeat nudge for users who scroll through */}
            <section className="mt-8 rounded-xl border border-hcdr-light-grey bg-white px-5 py-6 text-center md:px-8">
              <p className="text-[15px] font-medium text-hcdr-dark">
                {isProfileC
                  ? "If anything here has been useful, a specialist is available whenever you're ready."
                  : "Ready to find out what's available to you?"}
              </p>
              <Link
                href={bottomCallbackHref}
                onClick={() => trackClick("callback")}
                className="mt-4 inline-block w-full rounded-lg bg-hcdr-orange px-8 py-[12px] text-center text-[15px] font-medium text-white shadow-[0_4px_12px_rgba(232,119,34,0.3)] transition hover:bg-hcdr-orange-hover md:w-auto"
              >
                {callbackLabel}
              </Link>
              <TrustPromiseRow />
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
