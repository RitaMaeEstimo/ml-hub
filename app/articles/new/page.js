"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceDescription, setSourceDescription] = useState("");
  const [sourceImage, setSourceImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingPreview, setFetchingPreview] = useState(false);

  async function fetchPreview() {
    if (!sourceUrl) return;
    setFetchingPreview(true);

    const res = await fetch("/api/link-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: sourceUrl }),
    });

    const data = await res.json();
    setFetchingPreview(false);

    if (!res.ok) {
      alert(data.error || "Failed to fetch link preview");
      return;
    }

    if (!title && data.title) setTitle(data.title);
    setSourceTitle(data.title || "");
    setSourceDescription(data.description || "");
    setSourceImage(data.image || "");

    if (!content && data.description) {
      setContent(data.description);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const finalSlug = slugify(title);

    const { error } = await supabase.from("articles").insert({
      title,
      slug: finalSlug,
      category,
      content,
      author_id: user?.id ?? null,
      source_url: sourceUrl || null,
      source_title: sourceTitle || null,
      source_description: sourceDescription || null,
      source_image: sourceImage || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/articles/${finalSlug}`);
  }

  return (
    <div>
      <h1 className="page-title">Publish Article</h1>
      <p className="page-subtitle">
        Create a machine learning article manually or attach a source link to enrich the post.
      </p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label className="label">
          Source Link
          <input
            className="input"
            type="url"
            placeholder="https://example.com/article"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
        </label>

        <div className="button-row">
          <button type="button" className="btn-secondary" onClick={fetchPreview} disabled={fetchingPreview}>
            {fetchingPreview ? "Fetching..." : "Fetch Link Preview"}
          </button>
        </div>

        {(sourceTitle || sourceDescription || sourceImage) && (
          <div className="link-preview">
            <div className="section-title">Linked Source Preview</div>
            {sourceImage ? (
              <img
                src={sourceImage}
                alt={sourceTitle || "Source preview"}
                className="preview-image"
              />
            ) : null}
            {sourceTitle ? <strong>{sourceTitle}</strong> : null}
            {sourceDescription ? <p>{sourceDescription}</p> : null}
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {sourceUrl}
              </a>
            ) : null}
          </div>
        )}

        <label className="label">
          Title
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            required
          />
        </label>

        <label className="label">
          Category
          <input
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Machine Learning, Deep Learning, NLP..."
          />
        </label>

        <label className="label">
          Content
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here"
            required
          />
        </label>

        <div className="button-row">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
