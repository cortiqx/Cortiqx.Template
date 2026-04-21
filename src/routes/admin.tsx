import { createFileRoute, Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { LayoutGrid, Clock, Users, ChevronLeft, Menu, X, Loader2, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase/config";
import { getUserRole } from "@/services/userService";

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.navigate({ to: "/login" });
        return;
      }
      try {
        const role = await getUserRole(user.uid);
        if (role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      }
      setAuthChecking(false);
    });
    return () => unsub();
  }, [router]);

  if (authChecking) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center text-center px-6">
        <div>
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 font-display text-2xl font-semibold">Admin Only</h2>
          <p className="mt-2 text-sm text-muted-foreground">You don't have permission to view this page.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

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
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col -translate-x-full border-r border-border bg-background transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
            open && "translate-x-0",
          )}
        >
          <div className="flex h-16 items-center gap-2 border-b border-border px-5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
              C
            </span>
            <span className="font-display text-lg font-semibold">Cortiqx Templates Admin</span>
          </div>
          <nav className="flex-1 space-y-1 p-3">
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
          
          <div className="border-t border-border p-3">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition hover:bg-muted text-destructive"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 p-4 pb-24 md:p-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex border-t border-border bg-background md:hidden">
        {nav.map((it) => {
          const active = it.exact
            ? location.pathname === it.to
            : location.pathname === it.to || (!it.exact && location.pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              {it.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
