import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function TopLikedPage() {
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "approved");

  const { data: reactions } = await supabase
    .from("article_reactions")
    .select("article_id,value");

  const scoreMap = {};

  for (const reaction of reactions || []) {
    scoreMap[reaction.article_id] =
      (scoreMap[reaction.article_id] || 0) + reaction.value;
  }

  const ranked = (articles || [])
    .map((article) => ({
      ...article,
      score: scoreMap[article.id] || 0,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="brand">
            ML <span>HUB</span>
          </Link>

          <div className="button-row">
            <Link href="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
            <Link href="/articles" className="btn-ghost">
              Articles
            </Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "36px 0 48px" }}>
        <div className="panel">
          <h1 className="page-title">Top Liked Articles</h1>
          <p className="page-subtitle">
            Discover the most appreciated approved ML content from your platform.
          </p>

          {ranked.length === 0 ? (
            <div className="empty-state">No ranked articles yet.</div>
          ) : (
            <div className="grid-cards">
              {ranked.map((article) => (
                <div key={article.id} className="article-card">
                  <h2 className="section-title" style={{ marginBottom: 8 }}>
                    {article.title}
                  </h2>

                  <div className="meta-row">
                    <span>Score: {article.score}</span>
                    {article.category ? <span>{article.category}</span> : null}
                    <span>{article.post_type === "link" ? "Link Post" : "Written"}</span>
                  </div>

                  <div className="button-row" style={{ marginTop: 16 }}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="btn-secondary"
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}