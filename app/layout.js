import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="brand">
            ML <span>HUB</span>
          </Link>

          <div className="button-row">
            <Link href="/articles" className="btn-ghost">Articles</Link>
            <Link href="/top-liked" className="btn-ghost">Top Liked</Link>
          </div>
        </div>
      </header>

      <div className="container dashboard-shell">
        <aside className="sidebar">
          <div className="sidebar-title">Dashboard</div>
          <nav className="nav-list">
            <Link href="/dashboard" className="nav-link">Overview</Link>
            <Link href="/dashboard/articles/new" className="nav-link">Publish Article</Link>
            <Link href="/articles" className="nav-link">Browse Articles</Link>
            <Link href="/top-liked" className="nav-link">Top Liked</Link>
          </nav>
        </aside>

        <section className="panel">
          {children}
        </section>
      </div>
    </div>
  );
}
