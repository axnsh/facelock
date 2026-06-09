export default function Footer() {
  return (
    <footer className="border-t border-[var(--accent)] p-4 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-[var(--foreground)]">
      <span>{"©"} 2026 Axl Nash N. Alcoba</span>
      <span>Email: axlnash.alcoba07@gmail.com</span>

      <div className="flex items-center gap-4">
        <a
          href="https://www.facebook.com/ax.nshh/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-cyan-300"
          aria-label="Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </a>
        <a
          href="https://github.com/axnsh"
          target="_blank"
          rel="noreferrer"
          className="hover:text-cyan-300"
          aria-label="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.116-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404 11.5 11.5 0 0 1 3.003.404c2.29-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.625-5.476 5.92.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/axl-nash-alcoba"
          target="_blank"
          rel="noreferrer"
          className="hover:text-cyan-300"
          aria-label="LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M20.447 20.452H17.3v-5.569c0-1.328-.028-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.941v5.665H9.207V9h3.053v1.561h.043c.426-.806 1.466-1.653 3.018-1.653 3.228 0 3.826 2.124 3.826 4.887v6.657zM5.337 7.433a1.768 1.768 0 1 1 0-3.536 1.768 1.768 0 0 1 0 3.536zm1.529 13.019H3.809V9h3.057v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
