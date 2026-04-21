import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Upload, Heart, ShoppingBag, Settings, LogOut, ChevronRight, Shield, User as UserIcon, Loader2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getUserRole } from "@/services/userService";

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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const r = await getUserRole(u.uid);
        setRole(r);
      } else {
        setRole("user");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.navigate({ to: "/" });
  };

  if (loading) {
    return (
      <PageShell>
        <div className="grid min-h-[50vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-4 pt-6">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-semibold text-primary-foreground">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="truncate font-display text-xl font-semibold">{user.displayName || "User"}</h1>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold">Guest</h1>
              <Link to="/login" className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
                Sign in or create account
              </Link>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
          <Stat label="Saved" value={user ? "12" : "0"} />
          <Stat label="Purchases" value={user ? "3" : "0"} />
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Account
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
          <Row to="/saved" icon={Heart} label="Saved templates" />
          <Row to="/profile" icon={ShoppingBag} label="My purchases" />
          {user && (role === "admin" || role === "developer") && (
            <Row to="/upload" icon={Upload} label="Upload a template" />
          )}
        </div>
      </section>

      <section className="mt-5 px-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          More
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
          {role === "admin" && (
            <Row to="/admin" icon={Shield} label="Admin dashboard" />
          )}
          {user ? (
            <>
              <Row to="/profile" icon={Settings} label="Settings" />
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 border-b border-border/60 px-4 py-3.5 last:border-b-0 active:bg-muted"
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                  <LogOut className="h-4 w-4 text-destructive" />
                </div>
                <span className="flex-1 text-left text-sm font-medium text-destructive">
                  Sign out
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </>
          ) : (
            <Row to="/login" icon={LogOut} label="Sign in" />
          )}
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
