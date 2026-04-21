import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { TemplateCard } from "@/components/TemplateCard";
import { categories, templates, type Category } from "@/data/templates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cortiqx Templates — Beautiful website templates for weddings & events" },
      {
        name: "description",
        content:
          "Browse, preview, and download stunning website templates for weddings, invitations, portfolios, and businesses.",
      },
      { property: "og:title", content: "Cortiqx Templates — Beautiful website templates" },
      {
        property: "og:description",
        content: "Curated wedding & event website templates by indie developers.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [active, setActive] = useState<Category | "All">("All");

  const filtered =
    active === "All" ? templates : templates.filter((t) => t.category === active);

  const trending = filtered.filter((t) => t.trending);
  const fresh = filtered.filter((t) => t.isNew);

  return (
    <PageShell>
      {/* Hero greeting */}
      <section className="px-4 pt-4 pb-2">
        <p className="text-sm text-muted-foreground">Welcome back ✨</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight">
          Find the perfect <em className="not-italic text-primary">template</em> for your big day.
        </h1>
      </section>

      {/* Category chips */}
      <div className="scrollbar-hide -mx-1 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {categories.map((c) => {
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "border-border bg-card text-foreground/70 hover:bg-muted",
              )}
            >
              <span className="mr-1.5">{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="🔥 Trending" linkText="See all" />
          <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2">
            {trending.map((t) => (
              <TemplateCard key={t.id} template={t} className="w-[62%] shrink-0 sm:w-[44%]" />
            ))}
          </div>
        </section>
      )}

      {/* New uploads */}
      <section className="mt-8">
        <SectionHeader title="✨ New Uploads" linkText="See all" />
        <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3">
          {(fresh.length > 0 ? fresh : filtered).map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>

      {/* All */}
      <section className="mt-8">
        <SectionHeader title="🧭 Explore All" />
        <div className="grid grid-cols-2 gap-3 px-4 pb-8 sm:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function SectionHeader({ title, linkText }: { title: string; linkText?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between px-4">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      {linkText && (
        <Link to="/search" className="text-sm font-medium text-primary">
          {linkText}
        </Link>
      )}
    </div>
  );
}
