import { HydrateClient } from "~/trpc/server";
import { Hero } from "./_components/hero";
import { ExploitsTable } from "./_components/ExploitsTable";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-[radial-gradient(circle,_rgba(0,0,0,1)_0%,_rgba(36,58,89,1)_73%,_rgba(59,25,25,1)_100%)] text-white">
        <header className="container flex w-full items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Solana Security Dashboard</h1>
          <nav className="space-x-4">
            <Link href="/best-practices">
              <Button
                variant="link"
                className="text-neutral-300 hover:text-white"
              >
                Best Practices
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="outline">Submit Exploit</Button>
            </Link>
          </nav>
        </header>

        <div className="container mt-4 flex flex-col items-center justify-center gap-4 px-4 py-4">
          <Hero />
          <ExploitsTable />
        </div>
      </main>
    </HydrateClient>
  );
}
