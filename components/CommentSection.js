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

    if (!error) {
      setContent("");
      setReplyText("");
      setReplyTo(null);
      loadComments();
    } else {
      alert(error.message);
    }
  }

  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = (id) => comments.filter((c) => c.parent_id === id);

  return (
    <section style={{ marginTop: 40 }}>
      <h2>Comments</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment"
          style={{ flex: 1 }}
        />
        <button onClick={() => addComment()}>Post</button>
      </div>

      {topLevel.map((comment) => (
        <div key={comment.id} style={{ borderTop: "1px solid #ddd", padding: "12px 0" }}>
          <p>{comment.content}</p>
          <button onClick={() => setReplyTo(comment.id)}>Reply</button>

          {replyTo === comment.id && (
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply"
                style={{ flex: 1 }}
              />
              <button onClick={() => addComment(comment.id, replyText)}>Send</button>
            </div>
          )}

          <div style={{ marginLeft: 24, marginTop: 10 }}>
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
