import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { getAllTemplatesForAdmin, updateTemplateStatus, TemplateData } from "@/services/templateService";

export const Route = createFileRoute("/admin/pending")({
  component: PendingPage,
});

function PendingPage() {
  const [pending, setPending] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await getAllTemplatesForAdmin();
    setPending(data?.filter(t => t.status === "pending") || []);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    if (!id) return;
    try {
      await updateTemplateStatus(id, status);
      await loadTemplates();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold">Pending Uploads</h1>
        <p className="text-sm text-muted-foreground">{pending.length} awaiting review</p>
      </div>

      <div className="space-y-3">
        {pending.map((t) => (
          <div key={t.id} className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
            <img src={t.images?.[0] || ""} alt={t.title} className="h-40 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    by {t.createdBy} · submitted {new Date(t.createdAt).toLocaleDateString()}
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
                  onClick={() => handleUpdateStatus(t.id!, "approved")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground hover:bg-success/90"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(t.id!, "rejected")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
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
