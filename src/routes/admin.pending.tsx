import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { templates } from "@/data/templates";

export const Route = createFileRoute("/admin/pending")({
  component: PendingPage,
});

const pending = templates.slice(0, 3).map((t, i) => ({
  ...t,
  submittedAt: ["2 hours ago", "Yesterday", "3 days ago"][i],
}));

function PendingPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold">Pending Uploads</h1>
        <p className="text-sm text-muted-foreground">{pending.length} awaiting review</p>
      </div>

      <div className="space-y-3">
        {pending.map((t) => (
          <div key={t.id} className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
            <img src={t.cover} alt={t.title} className="h-40 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    by {t.author} · submitted {t.submittedAt}
                  </p>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-medium uppercase text-accent-foreground">
                  Pending
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{t.description}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
