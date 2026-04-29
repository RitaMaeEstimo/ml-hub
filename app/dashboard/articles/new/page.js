"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();

  const [role, setRole] = useState("user");
  const [mode, setMode] = useState("written");
  const [loading, setLoading] = useState(false);
  const [fetchingPreview, setFetchingPreview] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceDescription, setSourceDescription] = useState("");
  const [sourceImage, setSourceImage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data?.role) setRole(data.role);
    }

    loadProfile();
  }, []);

  const helperText = useMemo(() => {
    return role === "admin"
      ? "Admin posts are published immediately."
      : "Your article will be submitted for admin approval.";
  }, [role]);

  async function fetchPreview() {
    if (!sourceUrl) {
      alert("Please paste a link first.");
      return;
    }

    setFetchingPreview(true);

    try {
      const res = await fetch("/api/link-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to fetch preview.");
        setFetchingPreview(false);
        return;
      }

      setSourceTitle(data.title || "");
      setSourceDescription(data.description || "");
      setSourceImage(data.image || "");

      if (!title && data.title) setTitle(data.title);
      if (!content && data.description) setContent(data.description);
    } catch {
      alert("Could not fetch the link preview.");
    }

    setFetchingPreview(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const finalTitle =
      mode === "written" ? title : sourceTitle || title || sourceUrl;
    const finalSlug = slugify(finalTitle);

    if (!finalTitle) {
      alert("Title is required.");
      return;
    }

    if (mode === "written" && !content) {
      alert("Content is required.");
      return;
    }

    if (mode === "link" && !sourceUrl) {
      alert("Source URL is required.");
      return;
    }

    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      setLoading(false);
      alert("Please sign in first.");
      return;
    }

    const status = role === "admin" ? "approved" : "pending";

    const { error } = await supabase.from("articles").insert({
      author_id: user.id,
      title: finalTitle,
      slug: finalSlug,
      category,
      content: mode === "written" ? content : sourceDescription || "Link post",
      post_type: mode,
      status,
      source_url: mode === "link" ? sourceUrl : null,
      source_title: mode === "link" ? sourceTitle || finalTitle : null,
      source_description: mode === "link" ? sourceDescription || "" : null,
      source_image: mode === "link" ? sourceImage || "" : null,
      approved_at: role === "admin" ? new Date().toISOString() : null,
      approved_by: role === "admin" ? user.id : null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(role === "admin" ? "/articles" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="panel">
      <h1 className="page-title">Publish Article</h1>
      <p className="page-subtitle">{helperText}</p>

      <div className="button-row" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={mode === "written" ? "btn" : "btn-secondary"}
          onClick={() => setMode("written")}
        >
          Written Article
        </button>
        <button
          type="button"
          className={mode === "link" ? "btn" : "btn-secondary"}
          onClick={() => setMode("link")}
        >
          Link Post
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        {mode === "link" ? (
          <>
            <label className="label">
              Source Link
              <input
                className="input"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/article"
                required
              />
            </label>

            <div className="button-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={fetchPreview}
                disabled={fetchingPreview}
              >
                {fetchingPreview ? "Fetching..." : "Fetch Link Preview"}
              </button>
            </div>

            {(sourceTitle || sourceDescription || sourceImage) && (
              <div className="link-preview">
                <div className="section-title">Preview</div>
                {sourceImage ? (
                  <img
                    src={sourceImage}
                    alt={sourceTitle || "Source preview"}
                    className="preview-image"
                  />
                ) : null}
                <strong>{sourceTitle || "No title yet"}</strong>
                <p>{sourceDescription || "No description yet"}</p>
                <span className="meta-row">{sourceUrl}</span>
              </div>
            )}
          </>
        ) : null}

        <label className="label">
          Title
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required={mode === "written"}
          />
        </label>

        <label className="label">
          Category
          <input
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Machine Learning, NLP, CV..."
          />
        </label>

        {mode === "written" ? (
          <label className="label">
            Content
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your full article here..."
              required
            />
          </label>
        ) : null}

        <div className="button-row">
          <button type="submit" className="btn" disabled={loading}>
            {loading
              ? "Submitting..."
              : role === "admin"
              ? "Publish Article"
              : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}