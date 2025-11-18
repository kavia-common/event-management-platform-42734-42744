"use client";

import { useState } from "react";
import { AuthAPI } from "@/src/lib/api";
import { setTokens } from "@/src/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.login(email, password);
      setTokens(res.access_token, res.refresh_token);
      router.push("/events");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h1>Login</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: "0.75rem" }}>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
        {error && <div style={{ color: "var(--error)" }}>{error}</div>}
        <button className="btn" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  );
}
