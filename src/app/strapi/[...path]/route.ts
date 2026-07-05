import { NextRequest, NextResponse } from "next/server";
import { STRAPI_URL } from "@/lib/constants";
import { checkStrapiProxyAllowlist } from "@/lib/strapiProxyAllowlist";
import { serverStrapiFetch } from "@/lib/strapiUpstream";

async function proxyToStrapi(request: NextRequest, path: string[]) {
  const target = `${STRAPI_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const response = await serverStrapiFetch(target, {
    method: request.method,
    headers,
    body,
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
    },
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handleProxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const allowlist = checkStrapiProxyAllowlist(request.method, path);

  if (!allowlist.allowed) {
    return new NextResponse(null, { status: allowlist.status });
  }

  return proxyToStrapi(request, path);
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context);
}
