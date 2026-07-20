import type { Metadata } from "next";
import { Dashboard } from "@/components/auth/Dashboard";

export const metadata: Metadata = {
  title: "Миний хуудас — ins.monre",
  description: "Хувийн болон байгууллагын мэдээлэл",
};

export default function DashboardPage() {
  return <Dashboard />;
}
