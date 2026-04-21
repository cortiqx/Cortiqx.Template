import { Link } from "@tanstack/react-router";
import { Search, Upload } from "lucide-react";

interface Props {
  showSearch?: boolean;
}

export function AppHeader({ showSearch = true }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-1.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
            C
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Cortiqx Templates</span>
        </Link>
        {showSearch && (
          <Link
            to="/search"
            className="flex flex-1 items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span>Search templates...</span>
          </Link>
        )}
        <Link
          to="/upload"
          aria-label="Upload"
          className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background"
        >
          <Upload className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
