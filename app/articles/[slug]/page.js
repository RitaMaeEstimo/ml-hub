import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LikeButtons from "@/components/LikeButtons";
import CommentSection from "@/components/CommentSection";

export default async function ArticleDetailPage({ params }) {
  const { slug } = params;

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !article) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let currentUserId = null;

  if (user) {
    currentUserId = user.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "admin";
  }

  if (article.status !== "approved" && article.author_id !== currentUserId && !isAdmin) {
    notFound();
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="brand">
            ML <span>HUB</span>
          </Link>

          <div className="button-row">
            <Link href="/articles" className="btn-ghost">
              Articles
            </Link>
            <Link href="/top-liked" className="btn-ghost">
              Top Liked
            </Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: "36px 0 48px" }}>
        <div className="panel">
          <h1 className="page-title">{article.title}</h1>

          <div className="meta-row">
            {article.category ? <span>{article.category}</span> : null}
            {article.created_at ? (
              <span>{new Date(article.created_at).toLocaleString()}</span>
            ) : null}
            <span>{article.post_type === "link" ? "Link Post" : "Written"}</span>
            <span>Status: {article.status}</span>
          </div>

          {article.post_type === "written" ? (
            <div className="article-content">{article.content}</div>
          ) : (
            <section className="link-preview" style={{ marginTop: 24 }}>
              <div className="section-title">Linked Article</div>

              {article.source_image ? (
                <img
                  src={article.source_image}
                  alt={article.source_title || "Article source preview"}
                  className="preview-image"
                />
              ) : null}

              <h2 style={{ marginTop: 12 }}>
                {article.source_title || article.title}
              </h2>
              <p>{article.source_description || article.content}</p>

              {article.source_url ? (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open original article
                </a>
              ) : null}
            </section>
          )}

          <LikeButtons articleId={article.id} />

          <CommentSection
            articleId={article.id}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        </div>
      </main>
    </div>
  );
}