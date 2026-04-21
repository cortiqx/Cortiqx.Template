import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Clock, Users, ChevronLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Cortiqx Templates" },
      { name: "description", content: "Cortiqx Templates admin: review templates, users, and uploads." },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin" as const, label: "All Templates", icon: LayoutGrid, exact: true },
  { to: "/admin/pending" as const, label: "Pending Uploads", icon: Clock },
  { to: "/admin/users" as const, label: "Users", icon: Users },
];

function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
        <Link to="/" aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 font-display text-lg font-semibold">Admin</h1>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="grid h-9 w-9 place-items-center rounded-full bg-muted"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-border bg-background transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
            open && "translate-x-0",
          )}
        >
          <div className="flex h-16 items-center gap-2 border-b border-border px-5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
              C
            </span>
            <span className="font-display text-lg font-semibold">Cortiqx Templates Admin</span>
          </div>
          <nav className="space-y-1 p-3">
            {nav.map((it) => {
              const active = it.exact
                ? location.pathname === it.to
                : location.pathname.startsWith(it.to);
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
