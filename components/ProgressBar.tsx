type ProgressBarProps = {
  step: number;
  total: number;
};

export function ProgressBar({ step, total }: ProgressBarProps) {
  const percentage = Math.round((step / total) * 100);

  return (
    <div className="w-full">
      <div
        className="h-3 w-full rounded-full bg-hcdr-light-grey"
        aria-label={`Quiz progress: step ${step} of ${total}`}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={step}
        role="progressbar"
      >
        <div
          className="h-3 rounded-full bg-hcdr-orange transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-hcdr-body">
        Step {step} of {total}
      </p>
    </div>
  );
}
