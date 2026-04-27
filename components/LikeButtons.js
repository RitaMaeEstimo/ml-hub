"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LikeButtons({ articleId }) {
  const [score, setScore] = useState(0);

  async function loadScore() {
    const { data } = await supabase
      .from("article_likes")
      .select("value")
      .eq("article_id", articleId);

    const total = (data || []).reduce((sum, row) => sum + row.value, 0);
    setScore(total);
  }

  useEffect(() => {
    loadScore();
  }, [articleId]);

  async function vote(value) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const { error } = await supabase.from("article_likes").upsert(
      {
        article_id: articleId,
        user_id: user.id,
        value,
      },
      { onConflict: "article_id,user_id" }
    );

    if (error) {
      alert(error.message);
      return;
    }

    loadScore();
  }

  return (
    <div className="button-row" style={{ marginTop: 24 }}>
      <button className="btn-secondary" onClick={() => vote(1)}>Like +</button>
      <button className="btn-secondary" onClick={() => vote(-1)}>Dislike -</button>
      <span className="meta-row">Score: {score}</span>
    </div>
  );
}
