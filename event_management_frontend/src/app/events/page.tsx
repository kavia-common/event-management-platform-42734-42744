"use client";

import { useEffect, useState } from "react";
import { EventsAPI } from "@/src/lib/api";
import { Event, Paginated } from "@/src/lib/types";
import Link from "next/link";

export default function EventsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<Event> | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await EventsAPI.list(q, page, 9);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div>
      <h1>Events</h1>
      <form onSubmit={onSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input className="input" placeholder="Search events..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-3">
        {data?.items?.map((ev) => (
          <div key={ev.id} className="card">
            <h3>{ev.title}</h3>
            <p>{ev.description?.slice(0, 120)}</p>
            <p style={{ fontSize: 12, color: "#6b7280" }}>{new Date(ev.start_time).toLocaleString()}</p>
            <Link className="btn ghost" href={`/events/${ev.id}`}>View</Link>
          </div>
        ))}
      </div>
      {data && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button className="btn ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <button className="btn ghost" disabled={(data.items?.length || 0) < 9} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
