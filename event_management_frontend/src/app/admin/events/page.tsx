"use client";

import { useEffect, useState } from "react";
import { EventsAPI, UsersAPI } from "@/src/lib/api";
import { Event, User } from "@/src/lib/types";

function emptyEvent(): Partial<Event> {
  const now = new Date();
  const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  return {
    title: "",
    description: "",
    location: "",
    start_time: now.toISOString(),
    end_time: later.toISOString(),
    capacity: 100,
  };
}

export default function AdminEventsPage() {
  const [me, setMe] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Partial<Event>>(emptyEvent());

  const load = async () => {
    const user = await UsersAPI.me();
    setMe(user);
    const res = await EventsAPI.list(undefined, 1, 100);
    setEvents(res.items);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await EventsAPI.create(form);
    setForm(emptyEvent());
    await load();
  };

  const update = async (id: number, payload: Partial<Event>) => {
    await EventsAPI.update(id, payload);
    await load();
  };

  const remove = async (id: number) => {
    await EventsAPI.delete(id);
    await load();
  };

  if (me && !me.is_admin) return <div className="card">You must be an admin to access this page.</div>;

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
      <div className="card">
        <h2>Create Event</h2>
        <input className="input" placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input" placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="input" type="datetime-local" value={form.start_time ? form.start_time.substring(0, 16) : ""} onChange={(e) => setForm({ ...form, start_time: new Date(e.target.value).toISOString() })} />
        <input className="input" type="datetime-local" value={form.end_time ? form.end_time.substring(0, 16) : ""} onChange={(e) => setForm({ ...form, end_time: new Date(e.target.value).toISOString() })} />
        <input className="input" type="number" placeholder="Capacity" value={form.capacity ?? 0} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
        <button className="btn" onClick={create}>Create</button>
      </div>
      <div className="card">
        <h2>Manage Events</h2>
        {events.map((ev) => (
          <div key={ev.id} style={{ borderBottom: "1px solid #eee", padding: "0.5rem 0", display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{ev.title}</strong>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn ghost" onClick={() => update(ev.id, { title: ev.title + " (Updated)" })}>Quick Update</button>
                <button className="btn ghost" onClick={() => remove(ev.id)}>Delete</button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{new Date(ev.start_time).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
