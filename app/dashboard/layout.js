import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #080202 0%, #050101 100%)",
        color: "#f5eded",
        fontFamily: "Georgia, serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(10, 2, 2, 0.92)",
          borderBottom: "1px solid #2a0808",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            width: "min(1120px, calc(100% - 32px))",
            margin: "0 auto",
            minHeight: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "12px 0",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#f5eded",
              textDecoration: "none",
              fontSize: "2rem",
              fontWeight: "700",
              letterSpacing: "0.06em",
            }}
          >
            ML <span style={{ color: "#e07070" }}>HUB</span>
          </Link>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/articles" style={topBtn}>
              Articles
            </Link>
            <Link href="/top-liked" style={topBtn}>
              Top Liked
            </Link>
          </div>
        </div>
      </header>

      <div
        style={{
          width: "min(1120px, calc(100% - 32px))",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "24px",
          padding: "28px 0 40px",
        }}
      >
        <aside
          style={{
            background: "linear-gradient(180deg, rgba(18,4,4,0.95), rgba(10,2,2,0.9))",
            border: "1px solid #2a0808",
            borderRadius: "22px",
            padding: "18px",
            alignSelf: "start",
          }}
        >
          <div
            style={{
              color: "#f5b8b8",
              fontSize: "1rem",
              marginBottom: "14px",
              fontWeight: "700",
            }}
          >
            Dashboard
          </div>

          <nav style={{ display: "grid", gap: "10px" }}>
            <Link href="/dashboard" style={navBtn}>
              Overview
            </Link>
            <Link href="/dashboard/articles/new" style={navBtn}>
              Publish Article
            </Link>
            <Link href="/dashboard/pending" style={navBtn}>
              My Pending Posts
            </Link>
            <Link href="/dashboard/moderation" style={navBtn}>
              Moderation
            </Link>
            <Link href="/articles" style={navBtn}>
              Browse Articles
            </Link>
            <Link href="/top-liked" style={navBtn}>
              Top Liked
            </Link>
          </nav>
        </aside>

        <section
          style={{
            background: "linear-gradient(180deg, rgba(14,3,3,0.92), rgba(9,2,2,0.92))",
            border: "1px solid #2a0808",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          }}
        >
          {children}
        </section>
      </div>
    </div>
  );
}

const topBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid #1e0707",
  color: "#8a6060",
  textDecoration: "none",
  background: "transparent",
};

const navBtn = {
  display: "block",
  padding: "12px 14px",
  borderRadius: "14px",
  color: "#f5eded",
  textDecoration: "none",
  background: "rgba(192,57,43,0.08)",
  border: "1px solid #2a0808",
};