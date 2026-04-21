import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { getAllTemplatesForAdmin, updateTemplateStatus, TemplateData } from "@/services/templateService";

export const Route = createFileRoute("/admin/")({
  component: AllTemplates,
});

function AllTemplates() {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await getAllTemplatesForAdmin();
    setTemplates(data || []);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: "rejected") => {
    if (!id || !confirm("Are you sure you want to delete/reject this?")) return;
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
        <h1 className="font-display text-2xl font-semibold">All Templates</h1>
        <p className="text-sm text-muted-foreground">{templates.length} total uploads</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
          >
            <img src={t.images?.[0] || ""} alt={t.title} className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold">{t.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${t.status === 'approved' ? 'bg-success/10 text-success' : t.status === 'pending' ? 'bg-accent/10 text-accent-foreground' : 'bg-destructive/10 text-destructive'}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.category} · by {t.createdBy} · {t.price === 0 ? "Free" : `₹${t.price}`}
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="View"
                className="grid h-8 w-8 place-items-center rounded-full bg-muted"
                onClick={() => window.open(`/template/${t.id}`, '_blank')}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete"
                onClick={() => handleUpdateStatus(t.id!, 'rejected')}
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
