"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CommentSection({
  articleId,
  currentUserId,
  isAdmin = false,
}) {
  const [comments, setComments] = useState([]);
  const [commentVotes, setCommentVotes] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  async function loadAll() {
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    setComments(commentsData || []);

    const ids = (commentsData || []).map((c) => c.id);
    if (!ids.length) {
      setCommentVotes([]);
      return;
    }

    const { data: votesData } = await supabase
      .from("comment_reactions")
      .select("*")
      .in("comment_id", ids);

    setCommentVotes(votesData || []);
  }

  useEffect(() => {
    if (articleId) loadAll();
  }, [articleId]);

  async function addComment(parentId = null, text = content) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id,
      content: trimmed,
      parent_id: parentId,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setContent("");
    setReplyText("");
    setReplyTo(null);
    loadAll();
  }

  async function deleteComment(id) {
    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadAll();
  }

  async function reactToComment(commentId, value) {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const existing = commentVotes.find(
      (vote) => vote.comment_id === commentId && vote.user_id === user.id
    );

    if (existing?.value === value) {
      await supabase
        .from("comment_reactions")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
    } else if (existing) {
      await supabase
        .from("comment_reactions")
        .update({ value })
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("comment_reactions").insert({
        comment_id: commentId,
        user_id: user.id,
        value,
      });
    }

    loadAll();
  }

  const grouped = useMemo(() => {
    const top = comments.filter((c) => !c.parent_id);
    const replies = {};

    comments
      .filter((c) => c.parent_id)
      .forEach((c) => {
        if (!replies[c.parent_id]) replies[c.parent_id] = [];
        replies[c.parent_id].push(c);
      });

    return { top, replies };
  }, [comments]);

  function score(commentId) {
    return commentVotes
      .filter((v) => v.comment_id === commentId)
      .reduce((sum, row) => sum + row.value, 0);
  }

  function canDelete(comment) {
    return currentUserId === comment.user_id || isAdmin;
  }

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
        <button className="btn" onClick={() => addComment()}>
          Post
        </button>
      </div>

      {grouped.top.length === 0 ? (
        <div className="empty-state">No comments yet. Start the discussion.</div>
      ) : null}

      {grouped.top.map((comment) => (
        <div key={comment.id} className="comment-box">
          <p>{comment.content}</p>

          <div className="meta-row">
            <span>{new Date(comment.created_at).toLocaleString()}</span>
            <span>Score: {score(comment.id)}</span>
          </div>

          <div className="button-row" style={{ marginTop: 10 }}>
            <button className="btn-ghost" onClick={() => setReplyTo(comment.id)}>
              Reply
            </button>
            <button
              className="btn-secondary"
              onClick={() => reactToComment(comment.id, 1)}
            >
              Like
            </button>
            <button
              className="btn-secondary"
              onClick={() => reactToComment(comment.id, -1)}
            >
              Dislike
            </button>
            {canDelete(comment) ? (
              <button
                className="btn-ghost"
                onClick={() => deleteComment(comment.id)}
              >
                Delete
              </button>
            ) : null}
          </div>

          {replyTo === comment.id ? (
            <div className="button-row" style={{ marginTop: 10 }}>
              <input
                className="input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply"
                style={{ flex: 1 }}
              />
              <button
                className="btn-secondary"
                onClick={() => addComment(comment.id, replyText)}
              >
                Send
              </button>
            </div>
          ) : null}

          <div className="comment-replies">
            {(grouped.replies[comment.id] || []).map((reply) => (
              <div key={reply.id} style={{ padding: "10px 0" }}>
                <p>{reply.content}</p>
                <div className="meta-row">
                  <span>{new Date(reply.created_at).toLocaleString()}</span>
                  <span>Score: {score(reply.id)}</span>
                </div>
                <div className="button-row" style={{ marginTop: 8 }}>
                  <button
                    className="btn-secondary"
                    onClick={() => reactToComment(reply.id, 1)}
                  >
                    Like
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => reactToComment(reply.id, -1)}
                  >
                    Dislike
                  </button>
                  {canDelete(reply) ? (
                    <button
                      className="btn-ghost"
                      onClick={() => deleteComment(reply.id)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}