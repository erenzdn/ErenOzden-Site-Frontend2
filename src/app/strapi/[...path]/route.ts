import http from "node:http";
import https from "node:https";
import { NextRequest, NextResponse } from "next/server";
import { STRAPI_URL } from "@/lib/constants";

const insecureHttpsAgent =
  process.env.NODE_ENV === "development"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

function upstreamRequest(
  target: string,
  method: string,
  headers: Record<string, string>,
  body?: string
): Promise<{ status: number; contentType: string; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const url = new URL(target);
    const lib = url.protocol === "https:" ? https : http;
    const requestOptions: https.RequestOptions = {
      method,
      headers,
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: `${url.pathname}${url.search}`,
      agent: url.protocol === "https:" ? insecureHttpsAgent : undefined,
    };

    const req = lib.request(requestOptions, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode || 500,
          contentType: res.headers["content-type"] || "application/json",
          body: Buffer.concat(chunks),
        });
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function proxyToStrapi(request: NextRequest, path: string[]) {
  const target = `${STRAPI_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const response = await upstreamRequest(target, request.method, headers, body);

  return new NextResponse(new Uint8Array(response.body), {
    status: response.status,
    headers: {
      "content-type": response.contentType,
    },
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToStrapi(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToStrapi(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToStrapi(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToStrapi(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToStrapi(request, path);
}
