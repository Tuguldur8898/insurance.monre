import { NextRequest, NextResponse } from "next/server";

const ENDPOINT =
  process.env.GRAPHQL_URL ??
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  "https://monre.erxes.io/gateway/graphql";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-token": process.env.ERXES_APP_TOKEN ?? "",
        ...(req.headers.get("authorization")
          ? { authorization: req.headers.get("authorization") as string }
          : {}),
      },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return NextResponse.json(
      { errors: [{ message: e instanceof Error ? e.message : "Proxy error" }] },
      { status: 500 }
    );
  }
}
