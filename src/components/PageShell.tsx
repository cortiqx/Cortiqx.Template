import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

interface Props {
  children: React.ReactNode;
  showSearch?: boolean;
  hideHeader?: boolean;
}

export function PageShell({ children, showSearch, hideHeader }: Props) {
  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {!hideHeader && <AppHeader showSearch={showSearch} />}
      <main className="mx-auto max-w-3xl">{children}</main>
      <BottomNav />
    </div>
  );
}
