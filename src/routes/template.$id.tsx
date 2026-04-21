import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Heart, Eye, Download, Share2, ChevronLeft as L, ChevronRight as R } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { TemplateCard } from "@/components/TemplateCard";
import { getTemplate, getRelated } from "@/data/templates";
import { useSaved } from "@/hooks/use-saved";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/template/$id")({
  loader: ({ params }) => {
    const template = getTemplate(params.id);
    if (!template) throw notFound();
    return { template };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.template.title} — Cortiqx Templates` },
          { name: "description", content: loaderData.template.description },
          { property: "og:title", content: `${loaderData.template.title} — Cortiqx Templates` },
          { property: "og:description", content: loaderData.template.description },
          { property: "og:image", content: loaderData.template.cover },
          { name: "twitter:image", content: loaderData.template.cover },
        ]
      : [],
  }),
  component: DetailPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-semibold">Template not found</h1>
        <Link to="/" className="mt-3 inline-block text-primary">
          Go home
        </Link>
      </div>
    </div>
  ),
});

function DetailPage() {
  const { template } = Route.useLoaderData();
  const { isSaved, toggle } = useSaved();
  const liked = isSaved(template.id);
  const related = getRelated(template.id);
  const [idx, setIdx] = useState(0);

  return (
    <PageShell hideHeader>
      {/* Carousel */}
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <img
            src={template.gallery[idx]}
            alt={`${template.title} screenshot ${idx + 1}`}
            className="h-full w-full object-cover"
          />
          {/* Top controls */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <Link
              to="/"
              aria-label="Back"
              className="grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Share"
                className="grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
              >
                <Share2 className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                aria-label={liked ? "Unsave" : "Save"}
                onClick={() => toggle(template.id)}
                className="grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
              >
                <Heart className={cn("h-5 w-5", liked && "fill-primary text-primary")} />
              </button>
            </div>
          </div>

          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setIdx((i) => (i - 1 + template.gallery.length) % template.gallery.length)}
            className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 backdrop-blur"
          >
            <L className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setIdx((i) => (i + 1) % template.gallery.length)}
            className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 backdrop-blur"
          >
            <R className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background">
            {idx + 1} / {template.gallery.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3">
          {template.gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition",
                idx === i ? "border-primary" : "border-transparent opacity-70",
              )}
            >
              <img src={src} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <section className="px-4 pb-4">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          {template.category}
        </span>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          {template.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">by {template.author}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {template.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              #{t}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">{template.description}</p>

        <div className="mt-5 flex items-baseline gap-2">
          <span
            className={cn(
              "font-display text-3xl font-semibold",
              template.price === 0 ? "text-success" : "text-foreground",
            )}
          >
            {template.price === 0 ? "Free" : `₹${template.price}`}
          </span>
          {template.price > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{Math.round(template.price * 1.5)}
            </span>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-2">
          <h2 className="mb-3 px-4 font-display text-xl font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3">
            {related.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:bottom-0">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
          >
            <Download className="h-4 w-4" />
            {template.price === 0 ? "Download" : `Buy ₹${template.price}`}
          </button>
        </div>
      </div>
      <div className="h-20" />
    </PageShell>
  );
}
