import { HydrateClient } from "~/trpc/server";
import { Hero } from "./_components/hero";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle,_rgba(0,0,0,1)_0%,_rgba(36,58,89,1)_73%,_rgba(59,25,25,1)_100%)] text-white">
        <Hero />
      </main>
    </HydrateClient>
  );
}
