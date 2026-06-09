type Props = {
  onTryAgain: () => void;
  onGoBack: () => void;
};

export default function Success({ onTryAgain, onGoBack }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">

      <div className="w-[500px] h-[320px] bg-green-500 rounded" />

      <h2 className="mt-5 text-green-400 text-3xl font-bold">
        Access Granted
      </h2>

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
