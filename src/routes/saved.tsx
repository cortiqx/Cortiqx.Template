import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { TemplateCard } from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import { useSaved } from "@/hooks/use-saved";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved templates — Cortiqx Templates" },
      { name: "description", content: "Your saved website templates." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { saved } = useSaved();
  const items = templates.filter((t) => saved.includes(t.id));

  return (
    <PageShell>
      <h1 className="px-4 pt-4 font-display text-2xl font-semibold tracking-tight">Saved</h1>
      <p className="px-4 text-sm text-muted-foreground">
        {items.length} template{items.length === 1 ? "" : "s"} saved
      </p>

      {items.length === 0 ? (
        <div className="mx-4 mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-muted">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">Nothing saved yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on any template to save it for later.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Browse templates
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 px-4 pb-8 sm:grid-cols-3">
          {items.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
