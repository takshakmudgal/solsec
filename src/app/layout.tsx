import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { Footer } from "./_components/Footer";

export const metadata: Metadata = {
  title: "Solana Security Dashboard",
  description:
    "Tracking exploits and security incidents on the Solana blockchain.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} dark flex min-h-screen flex-col`}
    >
      <body className="flex flex-1 flex-col">
        <TRPCReactProvider>
          <div className="flex-1">{children}</div>
        </TRPCReactProvider>
        <Footer />
        <Toaster richColors closeButton theme="dark" />
      </body>
    </html>
  );
}
