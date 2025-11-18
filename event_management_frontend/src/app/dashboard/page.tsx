"use client";

import { useEffect, useState } from "react";
import { RegistrationsAPI, UsersAPI } from "@/src/lib/api";
import { Registration, User } from "@/src/lib/types";

export default function DashboardPage() {
  const [me, setMe] = useState<User | null>(null);
  const [regs, setRegs] = useState<Registration[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [user, registrations] = await Promise.all([UsersAPI.me(), RegistrationsAPI.my()]);
        setMe(user);
        setRegs(registrations);
      } catch {
        // 401 handling causes redirect via fetcher
      }
    };
    load();
  }, []);

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
      <div className="card">
        <h2>Profile</h2>
        <div><strong>Name:</strong> {me?.name}</div>
        <div><strong>Email:</strong> {me?.email}</div>
        <div><strong>Role:</strong> {me?.is_admin ? "Admin" : "User"}</div>
      </div>
      <div className="card">
        <h2>My registrations</h2>
        {regs.map((r) => (
          <div key={r.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <div>Registration #{r.id} - Event {r.event_id}</div>
            <div>Status: {r.status}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{new Date(r.created_at).toLocaleString()}</div>
          </div>
        ))}
        {regs.length === 0 && <div>You have no registrations yet.</div>}
      </div>
    </div>
  );
}
