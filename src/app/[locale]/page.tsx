import { getPageBySlug } from "@/lib/cms";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";

export const revalidate = 300;

export default async function Home() {
  const page = await getPageBySlug("home");

  const cf = page?.customFieldsData ?? {};
  const heading =
    typeof cf.heroHeading === "string" && cf.heroHeading
      ? cf.heroHeading
      : page?.name ?? "INSURE PLATFORM";
  const tagline =
    typeof cf.heroSubtitle === "string" && cf.heroSubtitle
      ? cf.heroSubtitle
      : page?.description ?? "Таны дижитал ирээдүйг хамгаална";

  return (
    <>
      <HeroSection heading={heading} tagline={tagline} />
      <StatsStrip />
      <AboutSection />
      <ContactSection />
    </>
  );
}
