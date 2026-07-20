import { getMenus } from "@/lib/cms";

export async function Footer() {
  await getMenus("footer");

  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-white/60 sm:flex-row">
        <span>© {new Date().getFullYear()} ins.monre — Бүх эрх хуулиар хамгаалагдсан</span>
        <span>Powered by Monre systems</span>
      </div>
    </footer>
  );
}
