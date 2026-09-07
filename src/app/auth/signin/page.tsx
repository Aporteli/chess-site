"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(res?.error ?? "არასწორი მონაცემები");
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-deepest px-4 py-8 text-text-primary">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border-default bg-bg-surface p-8 shadow-panel">
        <div className="space-y-2 text-center">
          <h1 className="font-serif-display text-2xl font-medium tracking-tight text-text-primary">
            ავტორიზაცია
          </h1>
          <p className="text-sm text-text-secondary">
            შედი ანგარიშზე ვარჯიშის გასაგრძელებლად
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              ელ-ფოსტა
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full rounded-lg border border-border-default bg-bg-deepest px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition focus:border-accent-gold focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              პაროლი
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-border-default bg-bg-deepest px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition focus:border-accent-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-accent-gold px-4 py-2.5 font-semibold text-bg-deepest shadow-md transition duration-150 hover:bg-accent-gold-bright disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "შესვლა..." : "შესვლა"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-default" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-bg-surface px-2 text-text-muted">ან</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full rounded-lg border border-border-default bg-bg-deepest px-4 py-2.5 text-sm font-semibold text-text-primary transition duration-150 hover:border-accent-gold"
        >
          Google-ით შესვლა
        </button>
      </div>
    </main>
  );
}