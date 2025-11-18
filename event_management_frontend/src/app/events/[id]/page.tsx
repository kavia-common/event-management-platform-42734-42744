"use client";

import { useEffect, useState } from "react";
import { EventsAPI, SchedulesAPI, RegistrationsAPI } from "@/src/lib/api";
import { Event, Schedule } from "@/src/lib/types";
import { useParams, useRouter } from "next/navigation";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [event, setEvent] = useState<Event | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [e, s] = await Promise.all([EventsAPI.get(id), SchedulesAPI.list(id)]);
        setEvent(e);
        setSchedules(s);
      } catch (err: any) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const register = async () => {
    setRegLoading(true);
    try {
      await RegistrationsAPI.register(id);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
      <div className="card">
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <p><strong>When:</strong> {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</p>
        <p><strong>Where:</strong> {event.location || "TBA"}</p>
      </div>
      <div className="card">
        <h3>Register</h3>
        {error && <div style={{ color: "var(--error)" }}>{error}</div>}
        <button className="btn" onClick={register} disabled={regLoading}>{regLoading ? "Registering..." : "Register"}</button>
      </div>
      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>Schedule</h3>
        {schedules.map((s) => (
          <div key={s.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <div><strong>{s.title}</strong></div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{new Date(s.start_time).toLocaleString()} - {new Date(s.end_time).toLocaleString()}</div>
            <div>{s.description}</div>
          </div>
        ))}
        {schedules.length === 0 && <div>No schedule yet.</div>}
      </div>
    </div>
  );
}
