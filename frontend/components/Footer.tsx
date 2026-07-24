

export function Footer() {
  return (
    <footer className="w-full py-8 text-center border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl mt-auto relative z-20">
      <p className="text-base font-medium text-zinc-300">
        <a 
          href="https://digitalheroesco.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors underline underline-offset-4 decoration-zinc-600 hover:decoration-white"
        >
          Built for Digital Heroes Training Task
        </a>
      </p>
    </footer>
  );
}
