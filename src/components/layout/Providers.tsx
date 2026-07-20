"use client";

import { useLenis } from "@/lib/hooks/useLenis";

export function Providers({ children }: { children: React.ReactNode }) {
  useLenis();
  return <>{children}</>;
}
