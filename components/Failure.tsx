type Props = {
  onTryAgain: () => void;
  onGoBack: () => void;
  message: string;
  variant: "error" | "warning";
};

export default function Failure({ onTryAgain, onGoBack, message, variant }: Props) {
  const isWarning = variant === "warning";
  const bodyBg = isWarning ? "bg-yellow-500" : "bg-red-500";
  const titleColor = isWarning ? "text-yellow-400" : "text-red-400";
  const titleText = isWarning ? "No face detected" : "Access Denied";

  return (
    <div className="flex-1 flex flex-col items-center justify-center">

      <div className={`w-[500px] h-[320px] ${bodyBg} rounded`} />

      <h2 className={`mt-5 ${titleColor} text-3xl font-bold`}>
        {titleText}
      </h2>
      <p className="mt-3 max-w-[32rem] text-center text-sm text-[var(--foreground-muted)]">
        {message}
      </p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={onTryAgain}
          className="px-6 py-2 border border-[var(--accent)] text-[var(--brand)] rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:bg-[var(--accent)]/10 hover:text-[var(--brand)]"
        >
          Try Again
        </button>
        <button
          onClick={onGoBack}
          className="px-6 py-2 border border-[var(--accent)] text-[var(--brand)] rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:bg-[var(--accent)]/10 hover:text-[var(--brand)]"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
