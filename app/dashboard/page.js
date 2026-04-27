import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="page-title">Creator Dashboard</h1>
      <p className="page-subtitle">
        Publish ML articles, manage shared content, and explore community engagement.
      </p>

      <div className="grid-cards">
        <div className="stat-card">
          <div className="stat-label">Quick Action</div>
          <div className="stat-value">Publish</div>
          <div className="meta-row">
            <span>Create a new article entry</span>
          </div>
          <div className="button-row" style={{ marginTop: "14px" }}>
            <Link href="/dashboard/articles/new" className="btn">New Article</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Community</div>
          <div className="stat-value">Discuss</div>
          <div className="meta-row">
            <span>Comments and replies on articles</span>
          </div>
          <div className="button-row" style={{ marginTop: "14px" }}>
            <Link href="/articles" className="btn-secondary">Browse</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Discover</div>
          <div className="stat-value">Top Liked</div>
          <div className="meta-row">
            <span>See what readers engage with most</span>
          </div>
          <div className="button-row" style={{ marginTop: "14px" }}>
            <Link href="/top-liked" className="btn-secondary">Open</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
