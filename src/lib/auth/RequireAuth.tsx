"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "./AuthContext";
import Loader from "@/components/common/Loader";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${locale}/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, locale, pathname]);

  if (loading) return <Loader />;
  if (!user) return null;

  return <>{children}</>;
}
