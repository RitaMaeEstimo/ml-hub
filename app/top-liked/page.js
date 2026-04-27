import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function TopLikedPage() {
  const { data: articles } = await supabase.from("articles").select("*");
  const { data: likes } = await supabase.from("article_likes").select("article_id,value");

  const scoreMap = {};
  for (const like of likes || []) {
    scoreMap[like.article_id] = (scoreMap[like.article_id] || 0) + like.value;
  }

  const ranked = (articles || [])
    .map((article) => ({ ...article, score: scoreMap[article.id] || 0 }))
    .sort((a, b) => b.score - a.score);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>Top Liked Articles</h1>
      <div style={{ display: "grid", gap: 16 }}>
        {ranked.map((article) => (
          <div key={article.id} style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
            <h2>{article.title}</h2>
            <p>Score: {article.score}</p>
            <Link href={`/articles/${article.slug}`}>Read article</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
