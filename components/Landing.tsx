type Props = {
  onStart: () => void;
};

export default function Landing({
  onStart,
}: Props) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">

      <h1 className="text-6xl font-bold text-[var(--brand)]">
        FaceLock
      </h1>

      <button
        onClick={onStart}
        className="mt-10 px-10 py-3 border border-[var(--accent)] text-[var(--brand)] rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:bg-[var(--accent)]/10 hover:text-[var(--brand)]"
      >
        Start
      </button>

    </div>
  );
}