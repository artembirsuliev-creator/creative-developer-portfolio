import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REVIEW_COLUMNS = "id,author_name,body,rating,created_at";
const MAX_BODY_BYTES = 8_000;

type ReviewPayload = {
  author_name?: unknown;
  body?: unknown;
  rating?: unknown;
  website?: unknown;
};

function getSupabaseConfig() {
  const projectUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!projectUrl || !secretKey) return null;

  try {
    const parsedUrl = new URL(projectUrl);
    if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") return null;
  } catch {
    return null;
  }

  return { projectUrl, secretKey };
}

function supabaseHeaders(secretKey: string, extra?: HeadersInit) {
  const headers = new Headers(extra);
  headers.set("apikey", secretKey);

  // Legacy service_role keys are JWTs. New sb_secret keys must be sent only as apikey.
  if (secretKey.startsWith("eyJ")) {
    headers.set("Authorization", `Bearer ${secretKey}`);
  }

  return headers;
}

async function readBodyWithinLimit(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new RangeError("request_body_too_large");
  }

  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError("request_body_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes);
}

export async function GET() {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ error: "reviews_unavailable" }, { status: 503 });
  }

  try {
    const url = new URL(`${config.projectUrl}/rest/v1/reviews`);
    url.searchParams.set("select", REVIEW_COLUMNS);
    url.searchParams.set("status", "eq.published");
    url.searchParams.set("order", "created_at.desc");
    url.searchParams.set("limit", "12");

    const response = await fetch(url, {
      headers: supabaseHeaders(config.secretKey),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "reviews_unavailable" }, { status: 502 });
    }

    const reviews: unknown = await response.json();
    return NextResponse.json(reviews, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ error: "reviews_unavailable" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ error: "reviews_unavailable" }, { status: 503 });
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  let payload: ReviewPayload;
  try {
    const rawBody = await readBodyWithinLimit(request);
    payload = JSON.parse(rawBody) as ReviewPayload;
  } catch (error) {
    if (error instanceof RangeError) {
      return NextResponse.json({ error: "review_too_large" }, { status: 413 });
    }
    return NextResponse.json({ error: "invalid_review" }, { status: 400 });
  }

  // Honeypot: silently accept bot submissions without storing them.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const authorName = typeof payload.author_name === "string" ? payload.author_name.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  const rating = payload.rating;

  if (authorName.length < 2 || authorName.length > 80) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }

  if (body.length < 20 || body.length > 1200) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "invalid_rating" }, { status: 400 });
  }

  try {
    const response = await fetch(`${config.projectUrl}/rest/v1/reviews`, {
      method: "POST",
      headers: supabaseHeaders(config.secretKey, {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      }),
      body: JSON.stringify({
        author_name: authorName,
        body,
        rating,
        status: "pending",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "review_not_saved" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, status: "pending" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "review_not_saved" }, { status: 502 });
  }
}
