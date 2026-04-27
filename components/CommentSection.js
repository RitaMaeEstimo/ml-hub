"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  async function loadComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    setComments(data || []);
  }

  useEffect(() => {
    loadComments();
  }, [articleId]);

  async function addComment(parentId = null, text = content) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id,
      content: text,
      parent_id: parentId,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setContent("");
    setReplyText("");
    setReplyTo(null);
    loadComments();
  }

  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = (id) => comments.filter((c) => c.parent_id === id);

  return (
    <section style={{ marginTop: 40 }}>
      <h2 className="section-title">Comments</h2>

      <div className="button-row" style={{ marginBottom: 20 }}>
        <input
          className="input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment"
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={() => addComment()}>Post</button>
      </div>

      {topLevel.length === 0 ? (
        <div className="empty-state">No comments yet. Be the first to reply.</div>
      ) : null}

      {topLevel.map((comment) => (
        <div key={comment.id} className="comment-box">
          <p>{comment.content}</p>
          <div className="button-row" style={{ marginTop: 10 }}>
            <button className="btn-ghost" onClick={() => setReplyTo(comment.id)}>Reply</button>
          </div>

          {replyTo === comment.id && (
            <div className="button-row" style={{ marginTop: 10 }}>
              <input
                className="input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply"
                style={{ flex: 1 }}
              />
              <button className="btn-secondary" onClick={() => addComment(comment.id, replyText)}>Send</button>
            </div>
          )}

          <div className="comment-replies">
            {replies(comment.id).map((reply) => (
              <div key={reply.id} style={{ padding: "8px 0" }}>
                <p>{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
