"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function ModeratorPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const [reportedComments, setReportedComments] = useState([]);
  const [reportedArticles, setReportedArticles] = useState([]);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role || "user";

      if (userRole !== "admin" && userRole !== "moderator") {
        router.push("/");
        return;
      }

      setRole(userRole);

      const { data: comments } = await supabase
        .from("comments")
        .select("id, content, created_at, is_hidden, report_count")
        .gt("report_count", 0)
        .order("report_count", { ascending: false });

      const { data: articles } = await supabase
        .from("articles")
        .select("id, title, slug, created_at, is_hidden, report_count")
        .gt("report_count", 0)
        .order("report_count", { ascending: false });

      setReportedComments(comments || []);
      setReportedArticles(articles || []);
      setLoading(false);
    }

    init();
  }, [router]);

  async function hideComment(id) {
    const { error } = await supabase
      .from("comments")
      .update({ is_hidden: true })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setReportedComments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_hidden: true } : item))
    );
  }

  async function unhideComment(id) {
    const { error } = await supabase
      .from("comments")
      .update({ is_hidden: false })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setReportedComments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_hidden: false } : item))
    );
  }

  async function hideArticle(id) {
    const { error } = await supabase
      .from("articles")
      .update({ is_hidden: true })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setReportedArticles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_hidden: true } : item))
    );
  }

  async function unhideArticle(id) {
    const { error } = await supabase
      .from("articles")
      .update({ is_hidden: false })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setReportedArticles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_hidden: false } : item))
    );
  }

  async function deleteComment(id) {
    if (role !== "admin") {
      alert("Only admins can permanently delete comments.");
      return;
    }

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setReportedComments((prev) => prev.filter((item) => item.id !== id));
  }

  async function deleteArticle(id) {
    if (role !== "admin") {
      alert("Only admins can permanently delete articles.");
      return;
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setReportedArticles((prev) => prev.filter((item) => item.id !== id));
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
          <div className="panel">Loading moderator panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="panel" style={{ marginBottom: 20 }}>
          <h1 className="page-title">Moderator Panel</h1>
          <p className="page-subtitle">
            Signed in as: {role}. Moderators can hide content, while admins can also delete permanently.
          </p>
        </div>

        <div className="panel" style={{ marginBottom: 20 }}>
          <h2 className="section-title">Reported Comments</h2>

          {reportedComments.length === 0 ? (
            <div className="empty-state">No reported comments right now.</div>
          ) : (
            <div className="grid-cards">
              {reportedComments.map((comment) => (
                <div key={comment.id} className="article-card">
                  <p>{comment.content}</p>

                  <div className="meta-row">
                    <span>Reports: {comment.report_count || 0}</span>
                    <span>{comment.is_hidden ? "Hidden" : "Visible"}</span>
                  </div>

                  <div className="button-row" style={{ marginTop: 16 }}>
                    {!comment.is_hidden ? (
                      <button className="btn-secondary" onClick={() => hideComment(comment.id)}>
                        Hide
                      </button>
                    ) : (
                      <button className="btn-ghost" onClick={() => unhideComment(comment.id)}>
                        Unhide
                      </button>
                    )}

                    {role === "admin" && (
                      <button className="btn" onClick={() => deleteComment(comment.id)}>
                        Delete Permanently
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2 className="section-title">Reported Articles</h2>

          {reportedArticles.length === 0 ? (
            <div className="empty-state">No reported articles right now.</div>
          ) : (
            <div className="grid-cards">
              {reportedArticles.map((article) => (
                <div key={article.id} className="article-card">
                  <h3>{article.title}</h3>

                  <div className="meta-row">
                    <span>Reports: {article.report_count || 0}</span>
                    <span>{article.is_hidden ? "Hidden" : "Visible"}</span>
                  </div>

                  <div className="button-row" style={{ marginTop: 16 }}>
                    {!article.is_hidden ? (
                      <button className="btn-secondary" onClick={() => hideArticle(article.id)}>
                        Hide
                      </button>
                    ) : (
                      <button className="btn-ghost" onClick={() => unhideArticle(article.id)}>
                        Unhide
                      </button>
                    )}

                    {role === "admin" && (
                      <button className="btn" onClick={() => deleteArticle(article.id)}>
                        Delete Permanently
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}