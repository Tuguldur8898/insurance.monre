import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Брокерын систем — ins.monre",
  description: "ins.monre даатгалын брокерын систем",
};

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
