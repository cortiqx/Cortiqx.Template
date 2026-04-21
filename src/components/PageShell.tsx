import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/categories", label: "Categories", icon: LayoutGrid, exact: false },
  { to: "/saved", label: "Saved", icon: Heart, exact: false },
  { to: "/profile", label: "Profile", icon: User, exact: false },
] as const;

interface Props {
  children: React.ReactNode;
  showSearch?: boolean;
  hideHeader?: boolean;
}

export function PageShell({ children, showSearch, hideHeader }: Props) {
  const location = useLocation();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {!hideHeader && <AppHeader showSearch={showSearch} />}

      <div className="mx-auto flex max-w-6xl gap-0">
        {/* Desktop left sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-56 md:shrink-0 md:sticky md:top-[57px] md:h-[calc(100vh-57px)] md:border-r md:border-border/60 pr-2 pt-4">
          <nav className="flex flex-col gap-1 px-3">
            {sidebarItems.map((it) => {
              const active = it.exact
                ? location.pathname === it.to
                : location.pathname.startsWith(it.to);
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl md:px-6 md:py-4">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
