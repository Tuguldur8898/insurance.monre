import { Link } from "@/i18n/navigation";
import { ShieldCheck, Phone, Globe } from "lucide-react";
import { getMenus } from "@/lib/cms";

const FALLBACK = [
  { _id: "f1", label: "Нүүр", url: "/", order: 1 },
  { _id: "f2", label: "Бидний тухай", url: "/about", order: 2 },
  { _id: "f3", label: "Холбоо барих", url: "/contact", order: 3 },
];

export async function Footer() {
  const menus = await getMenus("footer");
  const items = menus.length > 0 ? menus : FALLBACK;

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky to-brand text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              MONRE <span className="text-sky">INSURANCE</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Таны дижитал ирээдүйг хамгаалах найдвартай даатгалын платформ.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">Цэс</h3>
          <ul className="mt-4 space-y-2.5">
            {items.map((item) => (
              <li key={item._id}>
                <Link
                  href={item.url ?? "/"}
                  className="text-sm text-white/75 transition-colors hover:text-sky"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">Холбоо барих</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-sky" /> 976-7011-6240
            </li>
            <li className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-sky" /> insure.gerege.mn
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Monre Insurance. Бүх эрх хуулиар хамгаалагдсан.</span>
          <span>Powered by Gerege Systems</span>
        </div>
      </div>
    </footer>
  );
}
