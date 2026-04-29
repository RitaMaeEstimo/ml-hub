import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          lineHeight: "1.05",
          marginBottom: "8px",
          color: "#f5eded",
        }}
      >
        Creator Dashboard
      </h1>

      <p
        style={{
          color: "#8a6060",
          marginBottom: "22px",
          fontSize: "1.1rem",
        }}
      >
        Publish ML articles, manage pending posts, and moderate community content.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
        }}
      >
        <div style={card}>
          <div style={label}>Quick Action</div>
          <div style={value}>Publish</div>
          <p style={sub}>Create a new article entry.</p>
          <div style={{ marginTop: "14px" }}>
            <Link href="/dashboard/articles/new" style={primaryBtn}>
              New Article
            </Link>
          </div>
        </div>

        <div style={card}>
          <div style={label}>My Queue</div>
          <div style={value}>Pending</div>
          <p style={sub}>View articles waiting for approval.</p>
          <div style={{ marginTop: "14px" }}>
            <Link href="/dashboard/pending" style={secondaryBtn}>
              Open
            </Link>
          </div>
        </div>

        <div style={card}>
          <div style={label}>Moderation</div>
          <div style={value}>Review</div>
          <p style={sub}>Approve or reject submitted posts.</p>
          <div style={{ marginTop: "14px" }}>
            <Link href="/dashboard/moderation" style={secondaryBtn}>
              Manage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "rgba(20,4,4,0.82)",
  border: "1px solid #1e0707",
  borderRadius: "18px",
  padding: "18px",
};

const label = {
  color: "#8a6060",
  fontSize: "0.98rem",
};

const value = {
  color: "#f5eded",
  fontSize: "2rem",
  marginTop: "8px",
  fontWeight: "700",
};

const sub = {
  marginTop: "10px",
  color: "#8a6060",
};

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #c0392b, #6b0f0f)",
  color: "white",
  border: "1px solid transparent",
};

const secondaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: "999px",
  background: "rgba(192,57,43,0.08)",
  color: "#f5b8b8",
  border: "1px solid #2a0808",
};