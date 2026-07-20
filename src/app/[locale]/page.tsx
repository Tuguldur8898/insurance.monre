import { getPageBySlug } from "@/lib/cms";
import { HeroSection } from "@/components/sections/HeroSection";

export const revalidate = 300;

export default async function Home() {
  const page = await getPageBySlug("home");

  const cf = page?.customFieldsData ?? {};
  const heading = "INS.MONRE";
  const tagline =
    typeof cf.heroSubtitle === "string" && cf.heroSubtitle
      ? cf.heroSubtitle
      : page?.description ?? "Таны дижитал ирээдүйг хамгаална";

  return <HeroSection heading={heading} tagline={tagline} />;
}
