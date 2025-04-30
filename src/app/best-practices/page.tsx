"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function BestPracticesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 text-neutral-200">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Security Best Practices</h1>
        <Link href="/">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 border-b border-neutral-700 pb-2 text-2xl font-semibold text-neutral-100">
          For Solana Users
        </h2>
        <ul className="list-disc space-y-3 pl-6 text-neutral-300">
          <li>
            <strong>Use Hardware Wallets:</strong> For significant amounts,
            store your assets on a hardware wallet (like Ledger or Trezor)
            instead of a browser extension or mobile wallet (hot wallet).
          </li>
          <li>
            <strong>Beware of Phishing Scams:</strong> Double-check URLs before
            connecting your wallet or signing transactions. Be wary of
            unexpected airdrops, mints, or DMs asking for sensitive information
            or wallet connections.
          </li>
          <li>
            <strong>Verify Contracts & Approvals:</strong> Before interacting
            with a new protocol, try to verify the contract address on explorers
            like Solscan or SolanaFM. Understand what permissions you are
            granting when signing transactions.
          </li>
          <li>
            <strong>Revoke Unnecessary Permissions:</strong> Regularly review
            and revoke token approvals and permissions granted to dApps you no
            longer use, using tools like Famous Fox Federation&apos;s revoke
            tool or Step Finance&apos;s dashboard.
          </li>
          <li>
            <strong>Secure Your Seed Phrase:</strong> Never share your seed
            phrase (recovery phrase). Store it offline in multiple secure
            locations. Never type it into a website or digital device unless
            absolutely necessary for recovery.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 border-b border-neutral-700 pb-2 text-2xl font-semibold text-neutral-100">
          For Solana Developers & Protocols
        </h2>
        <ul className="list-disc space-y-3 pl-6 text-neutral-300">
          <li>
            <strong>Use Anchor Framework:</strong> Leverage the Anchor framework
            for building secure Solana programs. It helps prevent many common
            vulnerabilities like account confusions and incorrect signers.
          </li>
          <li>
            <strong>Thorough Audits:</strong> Engage reputable security firms
            for multiple audits before launching mainnet code, especially for
            protocols handling significant value.
          </li>
          <li>
            <strong>Implement Comprehensive Testing:</strong> Write extensive
            unit, integration, and fuzz tests to cover edge cases and potential
            vulnerabilities.
          </li>
          <li>
            <strong>Secure Oracles:</strong> If using price or data oracles,
            ensure they are robust against manipulation. Consider using multiple
            oracle sources or TWAP (Time-Weighted Average Price) oracles where
            appropriate.
          </li>
          <li>
            <strong>Validate All Accounts & Inputs:</strong> Rigorously validate
            all account inputs, data constraints, and signer privileges within
            your program logic. Assume inputs can be malicious.
          </li>
          <li>
            <strong>Principle of Least Privilege:</strong> Ensure programs and
            authorities only have the minimum necessary permissions to function.
          </li>
          <li>
            <strong>Bug Bounty Programs:</strong> Establish a clear bug bounty
            program to incentivize responsible disclosure of vulnerabilities by
            white-hat hackers.
          </li>
          <li>
            <strong>Monitor & Incident Response Plan:</strong> Have monitoring
            in place to detect suspicious activity and a clear plan for
            responding to security incidents, including communication and
            potential protocol pauses.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 border-b border-neutral-700 pb-2 text-2xl font-semibold text-neutral-100">
          Further Resources
        </h2>
        <ul className="list-disc space-y-3 pl-6 text-neutral-300">
          <li>
            <a
              href="https://solana.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Official Solana Docs
            </a>
          </li>
          <li>
            <a
              href="https://github.com/solana-developers/solana-cookbook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Secure3 Solana Security Cookbook
            </a>
          </li>
          <li>
            <a
              href="https://github.com/crytic/building-secure-contracts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Crytic Building Secure Contracts (General)
            </a>
          </li>
          <li>
            <a
              href="https://www.anchor-lang.com/docs/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Anchor Framework Security Docs
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
