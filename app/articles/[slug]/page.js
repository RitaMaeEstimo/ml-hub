import Link from "next/link";
import { supabase } from "@/lib/supabase";
import LikeButtons from "@/components/LikeButtons";
import CommentSection from "@/components/CommentSection";

export default async function ArticlePage({ params }) {
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!article) {
    return (
      <div className="page-shell">
        <main className="container" style={{ padding: "48px 0" }}>
          <div className="panel">Article not found.</div>
        </main>
      </div>
    );
  }

  const { data: related } = await supabase
    .from("articles")
    .select("*")
    .eq("category", article.category)
    .neq("id", article.id)
    .limit(3);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="brand">
            ML <span>HUB</span>
          </Link>
          <div className="button-row">
            <Link href="/articles" className="btn-ghost">Articles</Link>
            <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "36px 0 48px" }}>
        <div className="panel">
          <h1 className="page-title">{article.title}</h1>

          <div className="meta-row">
            {article.category ? <span>{article.category}</span> : null}
            {article.created_at ? (
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            ) : null}
          </div>

          <div className="article-content">{article.content}</div>

          {article.source_url && (
            <section className="link-preview" style={{ marginTop: 24 }}>
              <div className="section-title">Source</div>
              {article.source_image ? (
                <img
                  src={article.source_image}
                  alt={article.source_title || "Article source preview"}
                  className="preview-image"
                />
              ) : null}
              {article.source_title ? <strong>{article.source_title}</strong> : null}
              {article.source_description ? <p>{article.source_description}</p> : null}
              <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                Visit original link
              </a>
            </section>
          )}

          <LikeButtons articleId={article.id} />
          <CommentSection articleId={article.id} />

          <section style={{ marginTop: 40 }}>
            <h2 className="section-title">Related Articles</h2>
            {(related || []).length === 0 ? (
              <div className="empty-state">No related articles yet.</div>
            ) : (
              <div className="grid-cards">
                {related.map((item) => (
                  <div key={item.id} className="article-card">
                    <h3 className="section-title" style={{ fontSize: "1.15rem", marginBottom: 8 }}>
                      {item.title}
                    </h3>
                    <div className="button-row">
                      <Link href={`/articles/${item.slug}`} className="btn-secondary">
                        Read article
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
