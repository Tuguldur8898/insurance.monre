import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPages, getPageBySlug } from "@/lib/cms";
import { FadeIn } from "@/components/motion/FadeIn";
import { GlassCard } from "@/components/effects/GlassCard";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getPages();
  return pages
    .filter((p) => p.slug && p.slug !== "home")
    .map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return {
    title: page?.name ? `${page.name} — Monre Insurance` : "Monre Insurance",
    description: page?.description ?? undefined,
  };
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  return (
    <section className="hero-bg relative min-h-screen pt-36 pb-24">
      <div className="mx-auto w-full max-w-[900px] px-6">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Monre Insurance</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-tight text-navy">
            {page.name}
          </h1>
          {page.description ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy/70">{page.description}</p>
          ) : null}
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <GlassCard deep className="p-8 md:p-12">
            {page.content ? (
              <article
                className="prose max-w-none text-navy/80 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1.5"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <p className="text-navy/60">Агуулга удахгүй нэмэгдэнэ.</p>
            )}
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}
