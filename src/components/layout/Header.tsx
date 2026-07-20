import { getMenus } from "@/lib/cms";
import { HeaderClient } from "./HeaderClient";

const FALLBACK = [
  { _id: "m1", label: "Нүүр", url: "/", order: 1 },
  { _id: "m2", label: "Бидний тухай", url: "/about", order: 2 },
  { _id: "m3", label: "Холбоо барих", url: "/contact", order: 3 },
];

export async function Header() {
  const menus = await getMenus("header");
  return <HeaderClient items={menus.length > 0 ? menus : FALLBACK} />;
}
