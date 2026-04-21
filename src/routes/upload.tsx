import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ImagePlus, X, FileArchive, Plus, Loader2, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { categories } from "@/data/templates";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase/config";
import { uploadTemplateFiles, createTemplate, TemplateData } from "@/services/templateService";
import { getUserRole } from "@/services/userService";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a template — Cortiqx Templates" },
      { name: "description", content: "Developers can upload website templates to the Cortiqx Templates marketplace." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [githubUrl, setGithubUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [tags, setTags] = useState<string[]>(["wedding", "minimal"]);
  const [tagInput, setTagInput] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [zipName, setZipName] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.navigate({ to: "/login" });
        return;
      }
      const role = await getUserRole(user.uid);
      if (role !== "admin" && role !== "developer") {
        setAccessDenied(true);
      }
      setAuthChecking(false);
    });
    return () => unsub();
  }, [router]);

  if (authChecking) {
    return (
      <PageShell>
        <div className="grid min-h-[60vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </PageShell>
    );
  }

  if (accessDenied) {
    return (
      <PageShell>
        <div className="grid min-h-[60vh] place-items-center text-center px-6">
          <div>
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 font-display text-2xl font-semibold">Access Denied</h1>
            <p className="mt-2 text-sm text-muted-foreground">Only developers and admins can upload templates.</p>
            <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
              Go Home
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const onScreenshots = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10 - previews.length);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews([...previews, ...urls].slice(0, 10));
    setImages([...images, ...files].slice(0, 10));
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setZipName(file.name);
      setZipFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to upload.");
    if (!title || !description || !category || images.length === 0) return alert("Please fill all required fields and add at least one image.");

    setIsUploading(true);
    try {
      const pathPrefix = `${user.uid}/${Date.now()}`;
      const { imageUrls, fileUrl } = await uploadTemplateFiles(
        { images, zip: zipFile || undefined },
        pathPrefix
      );

      const newTemplate: Omit<TemplateData, "status" | "downloads" | "createdAt"> = {
        title,
        description,
        category,
        tags,
        price,
        isFree: price === 0,
        images: imageUrls,
        previewUrl,
        githubUrl,
        fileUrl,
        createdBy: user.uid,
      };

      await createTemplate(newTemplate);
      alert("Template submitted for review!");
      router.navigate({ to: "/" });
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageShell hideHeader>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/" aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-lg font-semibold">Upload template</h1>
          <p className="text-xs text-muted-foreground">For developers · all fields required</p>
        </div>
      </header>

      <form className="space-y-5 px-4 py-5" onSubmit={handleSubmit}>
        <Field label="Title">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Rose & Vows"
            className="input"
          />
        </Field>

        <Field label="Description">
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your template..."
            className="input resize-none"
          />
        </Field>

        <Field label="Category">
          <select 
            required 
            className="input appearance-none" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Choose a category</option>
            {categories.filter((c) => c.key !== "All").map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Price (INR, 0 for Free)">
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="0"
            className="input"
          />
        </Field>

        <Field label="Tags">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-2.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  aria-label={`Remove ${t}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <div className="flex flex-1 items-center gap-1">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag..."
                className="min-w-[80px] flex-1 bg-transparent px-1 text-sm outline-none"
              />
              <button
                type="button"
                onClick={addTag}
                className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-background"
                aria-label="Add tag"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Field>

        <Field label="GitHub repo (optional)">
          <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/you/repo" className="input" />
        </Field>

        <Field label="Live preview URL (optional)">
          <input type="url" value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} placeholder="https://your-template.vercel.app" className="input" />
        </Field>

        <Field label={`Screenshots (${previews.length}/10)`}>
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <img src={src} alt={`screenshot ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviews(previews.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-foreground/80 text-background"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {previews.length < 10 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                <div className="flex flex-col items-center gap-1">
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Add</span>
                </div>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onScreenshots}
          />
        </Field>

        <Field label="Template ZIP">
          <label className={cn(
            "flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed p-4 transition",
            zipName ? "border-primary bg-primary/5" : "border-border bg-card",
          )}>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
              <FileArchive className="h-5 w-5" />
            </div>
            <div className="flex-1 text-sm">
              {zipName ? (
                <>
                  <p className="font-medium text-foreground">{zipName}</p>
                  <p className="text-xs text-muted-foreground">Tap to replace</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-foreground">Upload ZIP</p>
                  <p className="text-xs text-muted-foreground">.zip · max 50 MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleZipChange}
            />
          </label>
        </Field>

        <button
          type="submit"
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] active:scale-[0.99] disabled:opacity-70"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for review"}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid var(--color-border);
          background: var(--color-card);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: var(--color-primary); }
      `}</style>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
