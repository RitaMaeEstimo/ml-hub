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

function normalizeUrl(input) {
  try {
    const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rawUrl = body?.url;

    if (!rawUrl) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const url = normalizeUrl(rawUrl);

    if (!url) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch article metadata" },
        { status: 400 }
      );
    }

    const html = await response.text();
    const root = parse(html);

    const meta = {};
    root.querySelectorAll("meta").forEach((tag) => {
      const key = tag.getAttribute("property") || tag.getAttribute("name");
      const content = tag.getAttribute("content");
      if (key && content && !meta[key]) {
        meta[key.toLowerCase()] = content;
      }
    });

    const title =
      meta["og:title"] ||
      meta["twitter:title"] ||
      root.querySelector("title")?.text?.trim() ||
      url;

    const description =
      meta["og:description"] ||
      meta["description"] ||
      meta["twitter:description"] ||
      "";

    const image = absoluteUrl(
      url,
      meta["og:image"] || meta["twitter:image"] || ""
    );

    const siteName =
      meta["og:site_name"] ||
      new URL(url).hostname.replace(/^www\./, "");

    return NextResponse.json({
      url,
      title,
      description,
      image,
      siteName,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch article metadata" },
      { status: 500 }
    );
  }
}