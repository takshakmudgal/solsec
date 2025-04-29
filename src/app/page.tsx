import { HydrateClient } from "~/trpc/server";
import Image from "next/image";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle,_rgba(0,0,0,1)_0%,_rgba(36,58,89,1)_73%,_rgba(59,25,25,1)_100%)] text-white">
        <div className="text-center">
          <h1 className="text-4xl text-white">
            <span className="title-gradient">solsec</span> dashboard
          </h1>
          <p className="text-lg leading-none text-gray-300">
            Simply the best comprehensive open-source tracker for <br />
            <span className="flex items-center justify-center">
              <Image src="solanaLogo.svg" alt="solana" width={80} height={80} />
              &nbsp; ecosystem security exploits
            </span>
          </p>
        </div>
      </main>
    </HydrateClient>
  );
}
