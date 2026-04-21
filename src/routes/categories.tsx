import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { categories, templates } from "@/data/templates";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Cortiqx Templates" },
      { name: "description", content: "Browse template categories: weddings, invitations, portfolios, business." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <PageShell>
      <h1 className="px-4 pt-4 font-display text-2xl font-semibold tracking-tight">Categories</h1>
      <p className="px-4 text-sm text-muted-foreground">Pick a vibe to explore.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 px-4 pb-8">
        {categories
          .filter((c) => c.key !== "All")
          .map((c) => {
            const count = templates.filter((t) => t.category === c.key).length;
            const cover = templates.find((t) => t.category === c.key)?.cover;
            return (
              <Link
                key={c.key}
                to="/search"
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-card)]"
              >
                {cover && (
                  <img
                    src={cover}
                    alt={c.label}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-background">
                  <div className="text-2xl">{c.emoji}</div>
                  <h2 className="mt-1 font-display text-xl font-semibold">{c.label}</h2>
                  <p className="text-xs opacity-80">{count} templates</p>
                </div>
              </Link>
            );
          })}
      </div>
    </PageShell>
  );
}
