import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Event Management",
  description: "Discover and manage events",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Link href="/events">Events</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/admin/events">Admin</Link>
            </div>
            <div>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          </div>
        </nav>
        <main className="container" style={{ paddingTop: "1.5rem" }}>{children}</main>
      </body>
    </html>
  );
}
