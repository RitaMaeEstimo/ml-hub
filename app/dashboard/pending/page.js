import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function PendingPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <h1 className="page-title">My Pending Posts</h1>
        <div className="empty-state">Please log in first.</div>
      </div>
    );
  }

  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("author_id", user.id)
    .in("status", ["pending", "rejected"])
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="page-title">My Pending Posts</h1>
        <div className="empty-state">{error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">My Pending Posts</h1>
      <p className="page-subtitle">
        Review your submitted articles and wait for admin approval.
      </p>

      {(articles || []).length === 0 ? (
        <div className="empty-state">No pending or rejected posts.</div>
      ) : (
        <div className="grid-cards">
          {articles.map((article) => (
            <article key={article.id} className="article-card">
              <h2 className="section-title" style={{ marginBottom: 8 }}>
                {article.title}
              </h2>

              <div className="meta-row">
                <span>Status: {article.status}</span>
                {article.category ? <span>{article.category}</span> : null}
                <span>
                  {article.created_at
                    ? new Date(article.created_at).toLocaleDateString()
                    : "No date"}
                </span>
              </div>

              <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                {article.source_description ||
                  article.content?.slice(0, 140) ||
                  "No preview available."}
              </p>

              <div className="button-row" style={{ marginTop: 16 }}>
                <Link href={`/articles/${article.slug}`} className="btn-secondary">
                  Open
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}