"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();

  const [mode, setMode] = useState("written");
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
    } finally {
      setFetchingPreview(false);
    }
  }

  async function publishWritten(e) {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    setLoading(true);

    const slug = slugify(title);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("articles").insert({
      title,
      slug,
      category,
      content,
      author_id: user?.id ?? null,
      post_type: "written",
      source_url: null,
      source_title: null,
      source_description: null,
      source_image: null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/articles/${slug}`);
    router.refresh();
  }

  async function publishLink(e) {
    e.preventDefault();

    if (!sourceUrl) {
      alert("Source URL is required.");
      return;
    }

    const finalTitle = sourceTitle || title || sourceUrl;
    const slug = slugify(finalTitle);

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("articles").insert({
      title: finalTitle,
      slug,
      category,
      content: content || sourceDescription || "Link post",
      author_id: user?.id ?? null,
      post_type: "link",
      source_url: sourceUrl,
      source_title: sourceTitle || finalTitle,
      source_description: sourceDescription || "",
      source_image: sourceImage || "",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/articles/${slug}`);
    router.refresh();
  }

  const panel = {
    background: "linear-gradient(180deg, rgba(18,4,4,0.94), rgba(10,2,2,0.95))",
    border: "1px solid #2a0808",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
    display: "grid",
    gap: "18px",
  };

  const sectionTitle = {
    fontSize: "26px",
    color: "#fff4f4",
    lineHeight: 1.1,
  };

  const fieldGroup = {
    display: "grid",
    gap: "8px",
  };

  const label = {
    color: "#f5b8b8",
    fontSize: "15px",
  };

  const input = {
    width: "100%",
    background: "#120505",
    color: "#f5eded",
    border: "1px solid #2a0808",
    borderRadius: "16px",
    padding: "14px 16px",
    outline: "none",
    fontSize: "16px",
  };

  const primaryBtn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 20px",
    borderRadius: "999px",
    border: "1px solid transparent",
    background: "linear-gradient(135deg, #c0392b, #6b0f0f)",
    color: "white",
    fontSize: "16px",
    fontWeight: 700,
  };

  const secondaryBtn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: "999px",
    border: "1px solid #2a0808",
    background: "rgba(192,57,43,0.08)",
    color: "#f5b8b8",
    fontSize: "15px",
    fontWeight: 600,
  };

  const tab = {
    padding: "12px 18px",
    borderRadius: "999px",
    border: "1px solid #2a0808",
    background: "rgba(255,255,255,0.03)",
    color: "#f5b8b8",
  };

  const activeTab = {
    ...tab,
    background: "linear-gradient(135deg, #c0392b, #6b0f0f)",
    color: "white",
    border: "1px solid transparent",
  };

  const previewBox = {
    border: "1px solid #2a0808",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "18px",
    padding: "16px",
  };

  return (
    <div style={{ color: "#f5eded" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05, marginBottom: 10 }}>
          Publish Article
        </h1>
        <p style={{ color: "#9b7474", maxWidth: 700 }}>
          Choose whether you want to publish a full written article or post an article link that users can open from your website.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button type="button" onClick={() => setMode("written")} style={mode === "written" ? activeTab : tab}>
          Written Article
        </button>
        <button type="button" onClick={() => setMode("link")} style={mode === "link" ? activeTab : tab}>
          Post by Link
        </button>
      </div>

      {mode === "written" ? (
        <form onSubmit={publishWritten} style={panel}>
          <h2 style={sectionTitle}>Write a full article</h2>

          <div style={fieldGroup}>
            <label style={label}>Title</label>
            <input
              style={input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          <div style={fieldGroup}>
            <label style={label}>Category</label>
            <input
              style={input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Machine Learning, NLP, CV..."
            />
          </div>

          <div style={fieldGroup}>
            <label style={label}>Content</label>
            <textarea
              style={{ ...input, minHeight: 280, resize: "vertical", lineHeight: 1.7 }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your full article here..."
              required
            />
          </div>

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Publishing..." : "Publish Written Article"}
          </button>
        </form>
      ) : (
        <form onSubmit={publishLink} style={panel}>
          <h2 style={sectionTitle}>Publish using a link</h2>

          <div style={fieldGroup}>
            <label style={label}>Article Link</label>
            <input
              type="url"
              style={input}
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/article"
              required
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
            <button type="button" onClick={fetchPreview} style={secondaryBtn} disabled={fetchingPreview}>
              {fetchingPreview ? "Fetching Preview..." : "Fetch Link Preview"}
            </button>
          </div>

          <div style={fieldGroup}>
            <label style={label}>Category</label>
            <input
              style={input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Machine Learning, Research, AI News..."
            />
          </div>

          <div style={fieldGroup}>
            <label style={label}>Override Title (optional)</label>
            <input
              style={input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave blank to use fetched title"
            />
          </div>

          <div style={fieldGroup}>
            <label style={label}>Description / Caption (optional)</label>
            <textarea
              style={{ ...input, minHeight: 160, resize: "vertical", lineHeight: 1.7 }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Optional text to show with this link post"
            />
          </div>

          <div style={previewBox}>
            <h3 style={{ marginBottom: 10, color: "#fff2f2" }}>Preview</h3>

            {sourceImage ? (
              <img
                src={sourceImage}
                alt={sourceTitle || "Source preview"}
                style={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 14,
                  marginBottom: 12,
                }}
              />
            ) : null}

            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {sourceTitle || "No title yet"}
            </div>

            <div style={{ color: "#9b7474", lineHeight: 1.6, marginBottom: 8 }}>
              {sourceDescription || "No description yet"}
            </div>

            <div style={{ color: "#f5b8b8", wordBreak: "break-word" }}>
              {sourceUrl || "No link yet"}
            </div>
          </div>

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Publishing..." : "Publish Link Post"}
          </button>
        </form>
      )}
    </div>
  );
}