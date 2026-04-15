"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizQuestion } from "@/components/QuizQuestion";
import { quizQuestions } from "@/lib/quiz-data";
import { getProfile } from "@/lib/result-logic";
import { saveAnswers, saveProfile } from "@/lib/storage";

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState<"next" | "back">("next");
  const router = useRouter();

  const question = useMemo(() => quizQuestions[step - 1], [step]);
  const selectedAnswer = answers[question.id];

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleNext() {
    if (!selectedAnswer) return;
    if (step < quizQuestions.length) {
      setDirection("next");
      setStep((prev) => prev + 1);
      return;
    }
    const profile = getProfile(answers);
    saveAnswers(answers);
    saveProfile(profile);
    router.push("/results");
  }

  function handleBack() {
    if (step <= 1) return;
    setDirection("back");
    setStep((prev) => prev - 1);
  }

  return (
    <main className="bg-hcdr-warm">
      <Header />
      <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <ProgressBar step={step} total={quizQuestions.length} />
        <div className="mt-4 inline-flex rounded-full bg-hcdr-orange-light px-3 py-1 text-xs font-semibold text-hcdr-orange-hover">
          Stage {question.stage} of 4 — {question.stageTitle}
        </div>

        <div
          key={question.id}
          className={`mt-4 transition-all duration-300 ease-out ${
            direction === "next" ? "animate-[slideInRight_300ms_ease-out]" : "animate-[slideInLeft_300ms_ease-out]"
          }`}
        >
          <QuizQuestion question={question} answer={selectedAnswer} onSelect={handleSelect} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="text-sm text-hcdr-orange-hover underline">
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="rounded-lg bg-hcdr-orange px-5 py-2 font-semibold text-white transition hover:bg-hcdr-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {step === quizQuestions.length ? "See My Results" : "Next"}
          </button>
        </div>
      </section>
      <Footer />
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}
