// Vercel Node.js serverless function adapter for TanStack Start
// Converts Node.js req/res to Web Fetch API and back
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { URL } from "node:url";

// Dynamically import the built server (ESM)
let serverHandler = null;

async function getHandler() {
  if (!serverHandler) {
    const mod = await import("../dist/server/server.js");
    serverHandler = mod.default;
  }
  return serverHandler;
}

function nodeReqToFetchRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
  const url = new URL(req.url, `${proto}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? Readable.toWeb(req) : undefined;

  return new Request(url.toString(), {
    method: req.method,
    headers,
    body,
    duplex: "half",
  });
}

async function fetchResponseToNodeRes(fetchRes, res) {
  res.statusCode = fetchRes.status;
  fetchRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (fetchRes.body) {
    const reader = fetchRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}

export default async function handler(req, res) {
  try {
    const server = await getHandler();
    const fetchReq = nodeReqToFetchRequest(req);
    const fetchRes = await server.fetch(fetchReq);
    await fetchResponseToNodeRes(fetchRes, res);
  } catch (err) {
    console.error("SSR Error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
