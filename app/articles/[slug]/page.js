import { supabase } from "@/lib/supabase";
import LikeButtons from "@/components/LikeButtons";
import CommentSection from "@/components/CommentSection";
import Link from "next/link";

export default async function ArticlePage({ params }) {
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!article) {
    return <main style={{ padding: 20 }}>Article not found.</main>;
  }

  const { data: related } = await supabase
    .from("articles")
    .select("*")
    .eq("category", article.category)
    .neq("id", article.id)
    .limit(3);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>{article.title}</h1>
      <p>{article.category}</p>

      <div style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
        {article.content}
      </div>

      <LikeButtons articleId={article.id} />
      <CommentSection articleId={article.id} />

      <section style={{ marginTop: 40 }}>
        <h2>Related Articles</h2>
        {(related || []).length === 0 ? (
          <p>No related articles yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {related.map((item) => (
              <div
                key={item.id}
                style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}
              >
                <h3>{item.title}</h3>
                <Link href={`/articles/${item.slug}`}>Read article</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
