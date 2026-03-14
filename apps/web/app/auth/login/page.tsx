"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/hooks/useApi";
import { useAuthStore } from "@/lib/store/auth.store";

const roleDestinations: Record<string, string> = {
  donor:    "/dashboard/donor",
  platform: "/dashboard/platform",
  ngo:      "/dashboard/ngo",
  worker:   "/dashboard/worker",
  village:  "/dashboard/village",
};

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const login   = useLogin();
  const setAuth = useAuthStore((s) => s.setAuth);
  const router  = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login.mutateAsync({ email, password });
      setAuth(data.user, data.token);
      router.push(roleDestinations[data.user.role] ?? "/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-medium">
            Se<span className="text-forest-600">tu</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="btn-primary w-full justify-center py-2.5"
            >
              {login.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">
            No account?{" "}
            <Link href="/auth/register" className="text-forest-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-xs text-center text-gray-300 mt-6">
          Test: donor@ramesh.in / donor1234
        </p>
      </div>
    </div>
  );
}
