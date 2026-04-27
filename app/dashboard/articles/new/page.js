"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const slug = slugify(title);

    const { error } = await supabase.from("articles").insert({
      title,
      slug,
      category,
      content,
      author_id: user?.id ?? null,
    });

    setLoading(false);

    if (!error) router.push(`/articles/${slug}`);
    else alert(error.message);
  };

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>Publish Article</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article..."
          rows={12}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </main>
  );
}
