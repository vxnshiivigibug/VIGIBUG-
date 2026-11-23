import { store, json } from "./_lib.mjs";
export const config = { path: "/api/subscribe" };
export default async (req) => {
  if (req.method === "GET") return json({ key: process.env.VAPID_PUBLIC || "" });
  if (req.method !== "POST") return json({ error: "Méthode non permise" }, 405);
  let sub; try { sub = await req.json(); } catch { return json({ error: "JSON invalide" }, 400); }
  if (!sub || !sub.endpoint || !sub.keys) return json({ error: "Abonnement invalide" }, 400);
  const s = store(), subs = ((await s.get("subs", { type: "json" })) || []).filter((x) => x.endpoint !== sub.endpoint);
  subs.push(sub); await s.setJSON("subs", subs.slice(-2000));
  return json({ ok: true });
};
