import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ArticlesPage() {
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>Articles</h1>
      <div style={{ display: "grid", gap: 16 }}>
        {(articles || []).map((article) => (
          <article key={article.id} style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
            <h2>{article.title}</h2>
            <p>{article.category}</p>
            <Link href={`/articles/${article.slug}`}>Read article</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
