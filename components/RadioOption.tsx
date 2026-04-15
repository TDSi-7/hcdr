import { QuizOption } from "@/lib/quiz-data";

type RadioOptionProps = {
  name: string;
  option: QuizOption;
  checked: boolean;
  onChange: (value: string) => void;
};

export function RadioOption({ name, option, checked, onChange }: RadioOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
        checked
          ? "border-l-4 border-hcdr-orange bg-hcdr-orange-light"
          : "border-hcdr-mid-grey hover:bg-hcdr-orange-light"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        onChange={() => onChange(option.value)}
        className="sr-only"
      />
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-hcdr-orange ${
          checked ? "bg-hcdr-orange" : "bg-white"
        }`}
        aria-hidden="true"
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
      <span className="text-base text-hcdr-dark">{option.label}</span>
    </label>
  );
}
