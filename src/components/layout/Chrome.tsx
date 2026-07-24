"use client";

import { usePathname } from "next/navigation";

export function Chrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.includes("/dashboard") || pathname?.includes("/broker");

  if (bare) {
    return <main className="flex-1 h-full overflow-hidden">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
