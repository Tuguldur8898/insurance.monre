import type { Metadata } from "next";
import { BrokerDashboard } from "@/components/broker/BrokerDashboard";

export const metadata: Metadata = {
  title: "Брокерын систем — ins.monre",
  description: "ins.monre даатгалын брокерын систем",
};

export default function BrokerPage() {
  return <BrokerDashboard />;
}
