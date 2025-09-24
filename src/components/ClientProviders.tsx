"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/app/client";

// Lazy-load the Toaster to avoid pulling client UI into the root layout chunk
const Toaster = dynamic(() => import("@/components/ui/toaster").then(m => m.Toaster), {
  ssr: false,
});

type Props = { children: ReactNode };

export default function ClientProviders({ children }: Props) {
  return (
    <ThirdwebProvider client={client}>
      {children}
      <Toaster />
    </ThirdwebProvider>
  );
}

