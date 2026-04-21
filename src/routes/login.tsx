import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { signInWithGoogle, signInWithEmail } from "@/firebase/auth";
import { syncUser } from "@/services/userService";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Cortiqx Templates" },
      { name: "description", content: "Sign in to Cortiqx Templates to save and download templates." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listen for any auth state change — fires after Google redirect OR email sign-in
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await syncUser(user);
        } catch (e) {
          console.error("syncUser failed:", e);
          // Continue anyway — user is authenticated even if profile sync failed
        }
        router.navigate({ to: "/" });
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(); // Redirects away — onAuthStateChanged will fire on return
    } catch (error) {
      console.error(error);
      alert("Failed to initiate Google sign in.");
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmail(email, password);
      // onAuthStateChanged above will detect and redirect
    } catch (error) {
      console.error(error);
      alert("Failed to sign in. Check your email and password.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 relative">
      <Link to="/" className="absolute left-6 top-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold">
            C
          </span>
          <span className="font-display text-2xl font-semibold">Cortiqx Templates</span>
        </Link>

        <h1 className="text-center font-display text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Enter your email to continue
        </p>

        <form className="mt-8 space-y-3" onSubmit={handleEmailSignIn}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (used for sign in or creation)"
              className="w-full rounded-full border border-border bg-card py-3.5 px-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] active:scale-[0.99] disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Google sign-in temporarily disabled
        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-6 w-full rounded-full border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-muted disabled:opacity-70"
        >
          Continue with Google
        </button>
        */}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
