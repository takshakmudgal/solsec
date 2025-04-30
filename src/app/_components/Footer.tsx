import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-700 bg-neutral-900/50 py-6 text-center text-sm text-neutral-400">
      <div className="container mx-auto">
        <p>
          &copy; {currentYear} Solana Security Dashboard. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link href="/" className="hover:text-neutral-200">
            Dashboard
          </Link>
          <Link href="/submit" className="hover:text-neutral-200">
            Submit Exploit
          </Link>
          <Link href="/best-practices" className="hover:text-neutral-200">
            Best Practices
          </Link>
          <a
            href="https://github.com/takshakmudgal/solsec"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
