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
    <main className="flex items-center justify-center min-h-screen bg-[#121110] text-[#E0DACE] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1C1A17] border border-[#2A2723] rounded-xl shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#F5EDC7]">ავტორიზაცია</h1>
          <p className="text-sm text-[#A0988C]">შედი ანგარიშზე ვარჯიშის გასაგრძელებლად</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#A0988C]">
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
              className="w-full px-3.5 py-2.5 bg-[#121110] border border-[#2A2723] rounded-lg text-[#E0DACE] placeholder-[#5C5549] focus:outline-none focus:border-[#E1B056] transition text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#A0988C]">
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
              className="w-full px-3.5 py-2.5 bg-[#121110] border border-[#2A2723] rounded-lg text-[#E0DACE] placeholder-[#5C5549] focus:outline-none focus:border-[#E1B056] transition text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 font-semibold text-[#121110] bg-[#E1B056] hover:bg-[#F0C16A] active:bg-[#C9983E] rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2"
            disabled={loading}
          >
            {loading ? "შესვლა..." : "შესვლა"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2A2723]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-[#1C1A17] px-2 text-[#5C5549]">ან</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full py-2.5 px-4 font-semibold text-[#E0DACE] bg-[#121110] border border-[#2A2723] hover:border-[#E1B056] rounded-lg transition duration-150 text-sm"
        >
          Google-ით შესვლა
        </button>
      </div>
    </main>
  );
}