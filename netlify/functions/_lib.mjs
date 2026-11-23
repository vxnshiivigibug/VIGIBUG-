import { getStore } from "@netlify/blobs";
import webpush from "web-push";
export const store = () => getStore("vigibug");
export const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });
export const isAdmin = (req) => !!process.env.ADMIN_TOKEN && req.headers.get("authorization") === "Bearer " + process.env.ADMIN_TOKEN;
const ORDER = ["black", "violet", "red", "orange", "yellow", "green"];
const FR = { green: "verte", yellow: "jaune", orange: "orange", red: "rouge", violet: "violette", black: "noire" };
const ADV = { green: "Le site est disponible.", yellow: "Un bug est connu ou en cours de correction.", orange: "Une panne touche une partie du site.", red: "Panne extrême : une grande partie du site peut ne pas fonctionner.", violet: "Hors service : reviens plus tard.", black: "Hors service extrême : n'utilise pas le site." };
export function effective(v, now = Date.now()) {
  const f = Date.parse(v.from || ""), u = Date.parse(v.until || "");
  if (!isNaN(f) && f > now) return "green";
  if (!isNaN(u) && u < now) return "green";
  return ORDER.find((c) => v[c + "Active"]) || "green";
}
// Envoie une notification si le niveau effectif a changé depuis la dernière fois.
export async function notifyIfChanged(v) {
  const s = store(), name = effective(v), meta = (await s.get("meta", { type: "json" })) || {};
  if (meta.last === name) return false;
  await s.setJSON("meta", { last: name });
  if (!meta.last && name === "green") return false;
  if (!process.env.VAPID_PUBLIC || !process.env.VAPID_PRIVATE) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@example.com", process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
  const payload = JSON.stringify({ title: name === "green" ? "Retour à la normale" : "Vigilance " + FR[name], body: v.msg || ADV[name], high: ["red", "violet", "black"].includes(name) });
  const subs = (await s.get("subs", { type: "json" })) || [], keep = [];
  for (const sub of subs) {
    try { await webpush.sendNotification(sub, payload); keep.push(sub); }
    catch (e) { if (e.statusCode !== 404 && e.statusCode !== 410) keep.push(sub); }
  }
  await s.setJSON("subs", keep);
  return true;
}
