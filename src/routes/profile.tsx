import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, Heart, ShoppingBag, Settings, LogOut, ChevronRight, Shield } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Cortiqx Templates" },
      { name: "description", content: "Your Cortiqx Templates profile, purchases, and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <PageShell>
      <section className="px-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-semibold text-primary-foreground">
            A
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-semibold">Aanya Sharma</h1>
            <p className="text-sm text-muted-foreground">aanya@example.com</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
          <Stat label="Saved" value="12" />
          <Stat label="Bought" value="3" />
          <Stat label="Uploaded" value="0" />
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Account
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
          <Row to="/saved" icon={Heart} label="Saved templates" />
          <Row to="/upload" icon={Upload} label="Upload a template" />
          <Row to="/profile" icon={ShoppingBag} label="My purchases" />
        </div>
      </section>

      <section className="mt-5 px-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          More
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
          <Row to="/admin" icon={Shield} label="Admin dashboard" />
          <Row to="/profile" icon={Settings} label="Settings" />
          <Row to="/login" icon={LogOut} label="Sign out" danger />
        </div>
      </section>

      <p className="mt-8 px-4 text-center text-xs text-muted-foreground">Cortiqx Templates · v0.1</p>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({
  to,
  icon: Icon,
  label,
  danger,
}: {
  to: "/saved" | "/upload" | "/profile" | "/admin" | "/login";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5 last:border-b-0 active:bg-muted"
    >
      <div className="grid h-9 w-9 place-items-center rounded-full bg-muted">
        <Icon className={danger ? "h-4 w-4 text-destructive" : "h-4 w-4 text-foreground/70"} />
      </div>
      <span className={`flex-1 text-sm font-medium ${danger ? "text-destructive" : ""}`}>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
