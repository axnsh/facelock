type Props = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function Navbar({ theme, onToggleTheme }: Props) {
  return (
    <nav className="p-5 flex items-center justify-between">
      <h1 className="text-[var(--brand)] font-bold text-xl">FaceLock</h1>

      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="rounded-full border border-[var(--brand)] p-2 text-[var(--brand)] transition-all duration-200 ease-out hover:bg-[var(--accent)]/10 hover:scale-110"
      >
        {theme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              d="M12 2.5v2 M12 19.5v2 M4.5 12h2 M17.5 12h2 M6.343 6.343l1.414 1.414 M16.243 16.243l1.414 1.414 M6.343 17.657l1.414-1.414 M16.243 7.757l1.414-1.414"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
            <path
              fill="currentColor"
              d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z"
            />
          </svg>
        )}
      </button>
    </nav>
  );
}
