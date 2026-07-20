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
    title: page?.name ? `${page.name} — ins.monre` : "ins.monre",
    description: page?.description ?? undefined,
  };
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  const contentHtml = (page.content ?? "")
    .replace(/976-7011-6240/g, "+976 7777-9000")
    .replace(/insure\.gerege\.mn/g, "ins.monre");

  return (
    <section className="hero-bg relative min-h-screen pt-36 pb-24">
      <div className="starfield" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[900px] px-6">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-widest text-sky">ins.monre</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-tight text-white">
            {page.name}
          </h1>
          {page.description ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300/80">{page.description}</p>
          ) : null}
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <GlassCard deep className="p-8 md:p-12">
            {contentHtml ? (
              <article
                className="prose max-w-none text-slate-200/85 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1.5 [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <p className="text-slate-400">Агуулга удахгүй нэмэгдэнэ.</p>
            )}
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}
