import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const users = [
  { name: "Aanya Sharma", email: "aanya@example.com", role: "Customer", joined: "Jan 2025" },
  { name: "Rohan Mehta", email: "rohan@dev.io", role: "Developer", joined: "Feb 2025" },
  { name: "Priya Verma", email: "priya@studio.in", role: "Developer", joined: "Mar 2025" },
  { name: "Devansh Kapoor", email: "dev@cortiqx.com", role: "Admin", joined: "Dec 2024" },
  { name: "Meera Joshi", email: "meera@photo.co", role: "Customer", joined: "Apr 2025" },
];

const roleColor: Record<string, string> = {
  Customer: "bg-secondary text-secondary-foreground",
  Developer: "bg-accent text-accent-foreground",
  Admin: "bg-primary text-primary-foreground",
};

function UsersPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">{users.length} registered users</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
        {users.map((u, i) => (
          <div
            key={u.email}
            className={`flex items-center gap-3 p-4 ${i !== users.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-muted font-semibold">
              {u.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{u.name}</p>
              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${roleColor[u.role]}`}
            >
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
