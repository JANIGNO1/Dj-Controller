export const config = { runtime: "edge" };

const NETWORK = {
  main: [
    "https://mrdanish.lovable.app/",
    "https://mrdanish.netlify.app/",
    "https://mrdanish.vercel.app/"
  ],
  fallback: "https://future-updates.vercel.app/"
};

export default async function handler(req) {
  const country = req.geo?.country || "PK";

  // Region priority
  let servers = NETWORK.main;

  if (country === "PK" || country === "IN") {
    servers = [...servers].reverse(); // prefer Vercel in Asia
  }

  for (const url of servers) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok || res.type === "opaque") {
        return Response.redirect(url, 302);
      }
    } catch {}
  }

  return Response.redirect(NETWORK.fallback, 302);
}
