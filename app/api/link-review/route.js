import { NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const { result } = await ogs({ url });

    return NextResponse.json({
      title: result.ogTitle || "",
      description: result.ogDescription || "",
      image: result.ogImage?.[0]?.url || "",
      siteName: result.ogSiteName || "",
      url,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not fetch link preview" },
      { status: 500 }
    );
  }
}
