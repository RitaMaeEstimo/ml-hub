import { NextResponse } from "next/server";
import { parse } from "node-html-parser";

function absoluteUrl(base, maybeRelative) {
  if (!maybeRelative) return "";
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return maybeRelative;
  }
}

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    const html = await response.text();
    const root = parse(html);

    const meta = {};
    root.querySelectorAll("meta").forEach((tag) => {
      const key = tag.getAttribute("property") || tag.getAttribute("name");
      const content = tag.getAttribute("content");
      if (key && content && !meta[key]) meta[key] = content;
    });

    const title =
      meta["og:title"] ||
      meta["twitter:title"] ||
      root.querySelector("title")?.text ||
      url;

    const description =
      meta["og:description"] ||
      meta["description"] ||
      meta["twitter:description"] ||
      "";

    const image =
      absoluteUrl(url, meta["og:image"] || meta["twitter:image"] || "");

    return NextResponse.json({
      url,
      title,
      description,
      image,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch article metadata" },
      { status: 500 }
    );
  }
}