import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { TemplateCard } from "@/components/TemplateCard";
import { categories, templates, type Category } from "@/data/templates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search templates — Cortiqx Templates" },
      { name: "description", content: "Search and filter wedding & event website templates." },
    ],
  }),
  component: SearchPage,
});

type Price = "all" | "free" | "paid";

function SearchPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [price, setPrice] = useState<Price>("all");

  const results = useMemo(() => {
    return templates.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (price === "free" && t.price !== 0) return false;
      if (price === "paid" && t.price === 0) return false;
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        const hay = `${t.title} ${t.description} ${t.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, cat, price]);

  return (
    <PageShell showSearch={false}>
      <div className="px-4 pt-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search wedding, portfolio, business..."
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-10 text-sm outline-none focus:border-primary"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-muted"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto px-4">
        {categories.map((c) => {
          const active = cat === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCat(c.key)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/70",
              )}
            >
              {c.emoji} {c.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2 px-4">
        {(["all", "free", "paid"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPrice(p)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition",
              price === p
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-foreground/70",
            )}
          >
            {p === "all" ? "All prices" : p}
          </button>
        ))}
      </div>

      <p className="mt-4 px-4 text-xs text-muted-foreground">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-3 px-4 pb-8 sm:grid-cols-3">
        {results.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          No templates match your filters.
        </div>
      )}
    </PageShell>
  );
}
