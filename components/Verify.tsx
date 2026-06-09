import Camera from "./Camera";

type Props = {
  webcamRef: React.RefObject<any>;
  onVerify: () => void;
};

export default function Verify({
  webcamRef,
  onVerify,
}: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">

      <Camera webcamRef={webcamRef} />

      <button
        onClick={onVerify}
        className="mt-5 px-8 py-2 border border-[var(--accent)] text-[var(--brand)] rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:bg-[var(--accent)]/10 hover:text-[var(--brand)]"
      >
        Verify Face
      </button>

    </div>
  );
}
