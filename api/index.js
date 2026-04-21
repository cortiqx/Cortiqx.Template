// Vercel Node.js serverless function — adapts Web Fetch API to Node.js req/res
import server from "../dist/server/server.js";

function nodeReqToFetchRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host =
    req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
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
  const body = hasBody ? req : undefined;

  return new Request(url.toString(), {
    method: req.method,
    headers,
    body,
    ...(hasBody ? { duplex: "half" } : {}),
  });
}

async function fetchResponseToNodeRes(fetchRes, res) {
  res.statusCode = fetchRes.status;
  fetchRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (fetchRes.body) {
    const reader = fetchRes.body.getReader();
    const write = () =>
      reader.read().then(({ done, value }) => {
        if (done) {
          res.end();
          return;
        }
        res.write(value);
        return write();
      });
    await write();
  } else {
    res.end();
  }
}

export default async function handler(req, res) {
  try {
    const fetchReq = nodeReqToFetchRequest(req);
    const fetchRes = await server.fetch(fetchReq);
    await fetchResponseToNodeRes(fetchRes, res);
  } catch (err) {
    console.error("[SSR Error]", err?.message, err?.stack);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end(`SSR Error: ${err?.message || "Unknown error"}`);
  }
}
