"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LikeButtons({ articleId }) {
  const [votes, setVotes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  async function loadVotes() {
    const { data: authData } = await supabase.auth.getUser();
    setCurrentUserId(authData?.user?.id || null);

    const { data } = await supabase
      .from("article_reactions")
      .select("*")
      .eq("article_id", articleId);

    setVotes(data || []);
  }

  useEffect(() => {
    if (articleId) loadVotes();
  }, [articleId]);

  const score = useMemo(
    () => votes.reduce((sum, row) => sum + row.value, 0),
    [votes]
  );

  const myVote = useMemo(
    () => votes.find((row) => row.user_id === currentUserId)?.value ?? 0,
    [votes, currentUserId]
  );

  async function vote(value) {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const existing = votes.find((v) => v.user_id === user.id);

    if (existing?.value === value) {
      await supabase
        .from("article_reactions")
        .delete()
        .eq("article_id", articleId)
        .eq("user_id", user.id);
    } else if (existing) {
      await supabase
        .from("article_reactions")
        .update({ value })
        .eq("article_id", articleId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("article_reactions").insert({
        article_id: articleId,
        user_id: user.id,
        value,
      });
    }

    loadVotes();
  }

  return (
    <div className="button-row" style={{ marginTop: 24 }}>
      <button className="btn-secondary" onClick={() => vote(1)}>
        {myVote === 1 ? "Retract Like" : "Like"}
      </button>
      <button className="btn-secondary" onClick={() => vote(-1)}>
        {myVote === -1 ? "Retract Dislike" : "Dislike"}
      </button>
      <span className="meta-row">Score: {score}</span>
    </div>
  );
}