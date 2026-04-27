import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ArticlesPage() {
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="brand">
            ML <span>HUB</span>
          </Link>
          <div className="button-row">
            <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
            <Link href="/top-liked" className="btn-ghost">Top Liked</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "36px 0 48px" }}>
        <div className="panel">
          <h1 className="page-title">Articles</h1>
          <p className="page-subtitle">
            Explore machine learning articles published by the community.
          </p>

          {(articles || []).length === 0 ? (
            <div className="empty-state">No articles yet. Publish the first one from the dashboard.</div>
          ) : (
            <div className="grid-cards">
              {articles.map((article) => (
                <article key={article.id} className="article-card">
                  <h2 className="section-title" style={{ marginBottom: 8 }}>{article.title}</h2>
                  <div className="meta-row">
                    {article.category ? <span>{article.category}</span> : null}
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                    {article.source_description || article.content?.slice(0, 140) || "No preview available."}
                  </p>
                  <div className="button-row" style={{ marginTop: 16 }}>
                    <Link href={`/articles/${article.slug}`} className="btn-secondary">Read Article</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
