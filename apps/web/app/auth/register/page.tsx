"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegister } from "@/hooks/useApi";
import { useAuthStore } from "@/lib/store/auth.store";
import { UserRole } from "@setu/shared";

const ROLES: { value: UserRole; label: string; desc: string }[] = [
  { value: "donor",    label: "Donor",            desc: "Donate goods or resources" },
  { value: "ngo",      label: "NGO",              desc: "Receive and distribute aid" },
  { value: "worker",   label: "Worker",           desc: "Find work with NGOs" },
  { value: "village",  label: "Village rep",      desc: "Request resources for your community" },
  { value: "platform", label: "Platform admin",   desc: "Coordinate the platform" },
];

const roleDestinations: Record<UserRole, string> = {
  donor:    "/dashboard/donor",
  platform: "/dashboard/platform",
  ngo:      "/dashboard/ngo",
  worker:   "/dashboard/worker",
  village:  "/dashboard/village",
};

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState<Record<string, string>>({
    name: "", email: "", password: "",
    orgName: "", state: "", district: "",
    villageName: "", skills: "", preferredWork: "",
  });
  const [error, setError] = useState("");

  const register = useRegister();
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep(2);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await register.mutateAsync({
        ...form,
        role,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
        focusAreas: [],
      });
      setAuth(data.user, data.token);
      router.push(roleDestinations[data.user.role]);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-medium">
            Se<span className="text-forest-600">tu</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Create your account</p>
        </div>

        {step === 1 && (
          <div>
            <p className="text-sm text-gray-500 text-center mb-4">I am joining as a…</p>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRoleSelect(r.value)}
                  className="w-full card p-4 text-left hover:border-forest-600 hover:bg-forest-50 transition-colors group"
                >
                  <p className="text-sm font-medium group-hover:text-forest-800">{r.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-forest-600 hover:underline">Sign in</Link>
            </p>
          </div>
        )}

        {step === 2 && role && (
          <div className="card p-6">
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-700 mb-4 flex items-center gap-1">
              ← Back
            </button>
            <p className="text-xs font-medium text-forest-600 uppercase tracking-wider mb-4 capitalize">{role} account</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Full name</label>
                <input className="input" placeholder="Your name" value={form.name} onChange={set("name")} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Min 8 characters" value={form.password} onChange={set("password")} required minLength={8} />
              </div>

              {/* Role-specific fields */}
              {(role === "donor" || role === "ngo") && (
                <div>
                  <label className="label">Organisation name</label>
                  <input className="input" placeholder="Company / NGO name" value={form.orgName} onChange={set("orgName")} />
                </div>
              )}
              {(role === "ngo" || role === "village") && (
                <div>
                  <label className="label">State</label>
                  <input className="input" placeholder="e.g. Himachal Pradesh" value={form.state} onChange={set("state")} />
                </div>
              )}
              {role === "village" && (
                <>
                  <div>
                    <label className="label">Village name</label>
                    <input className="input" placeholder="e.g. Chamba" value={form.villageName} onChange={set("villageName")} />
                  </div>
                  <div>
                    <label className="label">District</label>
                    <input className="input" placeholder="District" value={form.district} onChange={set("district")} />
                  </div>
                </>
              )}
              {role === "worker" && (
                <>
                  <div>
                    <label className="label">Skills (comma-separated)</label>
                    <input className="input" placeholder="Driving, Lifting, Sorting" value={form.skills} onChange={set("skills")} />
                  </div>
                  <div>
                    <label className="label">Preferred work type</label>
                    <input className="input" placeholder="e.g. Distribution & logistics" value={form.preferredWork} onChange={set("preferredWork")} />
                  </div>
                </>
              )}

              {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <button type="submit" disabled={register.isPending} className="btn-primary w-full justify-center py-2.5">
                {register.isPending ? "Creating account…" : "Create account"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
