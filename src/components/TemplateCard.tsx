import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useSaved } from "@/hooks/use-saved";
import { cn } from "@/lib/utils";
import type { Template } from "@/data/templates";

interface Props {
  template: Template;
  className?: string;
}

export function TemplateCard({ template, className }: Props) {
  const { isSaved, toggle } = useSaved();
  const liked = isSaved(template.id);

  return (
    <Link
      to="/template/$id"
      params={{ id: template.id }}
      className={cn(
        "group block overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={template.cover}
          alt={template.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(template.id);
          }}
          aria-label={liked ? "Unsave template" : "Save template"}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition active:scale-90"
        >
          <Heart
            className={cn(
              "h-4.5 w-4.5 transition",
              liked ? "fill-primary text-primary" : "text-foreground/70",
            )}
            size={18}
          />
        </button>
        <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-foreground/70 backdrop-blur">
          {template.category}
        </span>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{template.title}</h3>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-semibold",
              template.price === 0 ? "text-success" : "text-foreground",
            )}
          >
            {template.price === 0 ? "Free" : `₹${template.price}`}
          </span>
          <span className="text-[11px] text-muted-foreground">by {template.author}</span>
        </div>
      </div>
    </Link>
  );
}
