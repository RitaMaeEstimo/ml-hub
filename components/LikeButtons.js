"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LikeButtons({ articleId }) {
  const [score, setScore] = useState(0);

  async function loadScore() {
    const { data } = await supabase.from("article_likes").select("value").eq("article_id", articleId);
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

    if (!error) loadScore();
    else alert(error.message);
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 24 }}>
      <button onClick={() => vote(1)}>+</button>
      <span>Score: {score}</span>
      <button onClick={() => vote(-1)}>-</button>
    </div>
  );
}
