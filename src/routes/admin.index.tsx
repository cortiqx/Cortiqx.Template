import { createFileRoute } from "@tanstack/react-router";
import { templates } from "@/data/templates";
import { Eye, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AllTemplates,
});

function AllTemplates() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold">All Templates</h1>
        <p className="text-sm text-muted-foreground">{templates.length} templates live</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
          >
            <img src={t.cover} alt={t.title} className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold">{t.title}</h3>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase text-success">
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.category} · by {t.author} · {t.price === 0 ? "Free" : `₹${t.price}`}
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="View"
                className="grid h-8 w-8 place-items-center rounded-full bg-muted"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete"
                className="grid h-8 w-8 place-items-center rounded-full bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
