import { QuizQuestion as QuizQuestionType } from "@/lib/quiz-data";
import { SmartImage } from "./SmartImage";
import { RadioOption } from "./RadioOption";

type QuizQuestionProps = {
  question: QuizQuestionType;
  answer?: string;
  onSelect: (value: string) => void;
};

export function QuizQuestion({ question, answer, onSelect }: QuizQuestionProps) {
  const isContain = question.imageFit === "contain";
  return (
    <div className="grid gap-6 rounded-lg border border-hcdr-light-grey bg-white p-4 shadow-sm md:grid-cols-[280px_1fr] md:p-6">
      <div
        className={
          isContain
            ? "mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center self-start overflow-hidden rounded-lg md:max-w-none"
            : "overflow-hidden rounded-lg"
        }
      >
        <SmartImage
          src={question.image}
          alt={question.stageTitle}
          width={560}
          height={560}
          className={
            isContain
              ? "h-full w-full object-contain"
              : "h-[220px] w-full object-cover md:h-full"
          }
        />
      </div>
      <div>
        <h2 className="text-center text-[20px] font-semibold text-hcdr-dark md:text-[24px]">{question.question}</h2>
        {question.subtitle ? <p className="mt-2 text-center text-base text-hcdr-body">{question.subtitle}</p> : null}
        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">{question.question}</legend>
          {question.options.map((option) => (
            <RadioOption
              key={option.id}
              name={`question-${question.id}`}
              option={option}
              checked={answer === option.value}
              onChange={onSelect}
            />
          ))}
        </fieldset>
      </div>
    </div>
  );
}
