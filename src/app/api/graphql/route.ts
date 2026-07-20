import { NextRequest, NextResponse } from "next/server";

const ENDPOINT =
  process.env.GRAPHQL_URL ??
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  "https://monre.erxes.io/gateway/graphql";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-app-token": process.env.ERXES_APP_TOKEN ?? "",
    };
    const auth = req.headers.get("authorization");
    if (auth) headers["authorization"] = auth;
    const clientToken = req.headers.get("x-client-auth-token");
    if (clientToken) {
      headers["cookie"] = `client-auth-token=${clientToken}`;
    } else {
      const cookie = req.headers.get("cookie");
      if (cookie) headers["cookie"] = cookie;
    }

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });

    const text = await res.text();

    // Extract client-auth-token from erxes set-cookie and expose it in the JSON body
    let authToken = "";
    const setCookies =
      typeof (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie ===
      "function"
        ? (res.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
        : [];
    for (const sc of setCookies) {
      const m = sc.match(/client-auth-token=([^;]+)/);
      if (m) {
        authToken = m[1];
        break;
      }
    }

    if (authToken) {
      try {
        const json = JSON.parse(text) as Record<string, unknown>;
        json.extensions = { ...(json.extensions as object), authToken };
        return NextResponse.json(json, { status: res.status });
      } catch {
        // fall through to plain passthrough
      }
    }

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
