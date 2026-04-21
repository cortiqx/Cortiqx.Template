import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, X, Loader2, UserPlus, Shield, Pencil, Trash2 } from "lucide-react";
import { getAllUsers, UserProfile } from "@/services/userService";
import { firebaseConfig } from "@/firebase/config";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const roleColor: Record<string, string> = {
  user: "bg-secondary text-secondary-foreground",
  developer: "bg-accent text-accent-foreground",
  admin: "bg-primary text-primary-foreground",
};

function UsersPage() {
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Add user form
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserProfile["role"]>("user");

  // Edit user modal
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editRole, setEditRole] = useState<UserProfile["role"]>("user");
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUserList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsCreating(true);
    let secondaryApp;
    try {
      secondaryApp = initializeApp(firebaseConfig, "AdminUserCreator");
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newUser = userCredential.user;
      await updateProfile(newUser, { displayName: name });
      const userRef = doc(db, "users", newUser.uid);
      const newProfile: UserProfile = {
        uid: newUser.uid,
        email: email.toLowerCase(),
        role,
        createdAt: Date.now(),
      };
      await setDoc(userRef, newProfile);
      setShowForm(false);
      setName(""); setEmail(""); setPassword(""); setRole("user");
      loadUsers();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        alert(`An account with "${email}" already exists.`);
      } else {
        alert(err.message || "Failed to create user.");
      }
    } finally {
      if (secondaryApp) await deleteApp(secondaryApp);
      setIsCreating(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", editingUser.uid), { role: editRole });
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", deletingUser.uid));
      setDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">{userList.length} registered users</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Add New User</h2>
              <button onClick={() => setShowForm(false)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              {[
                { label: "Name", value: name, setter: setName, type: "text", placeholder: "e.g. John Doe" },
                { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "john@example.com" },
                { label: "Initial Password", value: password, setter: setPassword, type: "password", placeholder: "At least 6 characters" },
              ].map(({ label, value, setter, type, placeholder }) => (
                <div key={label} className="space-y-1.5">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
                  <input
                    type={type} required value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value as UserProfile["role"])}
                  className="w-full appearance-none rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary">
                  <option value="user">User / Customer</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" disabled={isCreating}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all active:scale-95 disabled:opacity-70">
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                {isCreating ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Edit User</h2>
              <button onClick={() => setEditingUser(null)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 truncate text-sm text-muted-foreground">{editingUser.email}</p>
            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</label>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value as UserProfile["role"])}
                className="w-full appearance-none rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary">
                <option value="user">User / Customer</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button onClick={handleEditSave} disabled={isSaving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all active:scale-95 disabled:opacity-70">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-destructive">Delete User</h2>
              <button onClick={() => setDeletingUser(null)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-foreground">{deletingUser.email}</span> from the platform? This removes their Firestore profile.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeletingUser(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground disabled:opacity-70">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
          {userList.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No users found.</div>
          ) : (
            userList.map((u, i) => (
              <div key={u.uid}
                className={`flex items-center gap-4 p-5 transition-colors hover:bg-muted/30 ${i !== userList.length - 1 ? "border-b border-border/50" : ""}`}>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-muted/50 font-semibold text-foreground/70 shadow-sm">
                  {u.email[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{u.email}</p>
                  <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    {u.role === "admin" && <Shield className="h-3 w-3" />}
                    Joined {new Date(u.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${roleColor[u.role]}`}>
                  {u.role}
                </span>
                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditingUser(u); setEditRole(u.role); }}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Edit role"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingUser(u)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Remove user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
