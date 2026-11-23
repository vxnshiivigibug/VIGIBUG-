import { store, json, isAdmin, effective, notifyIfChanged } from "./_lib.mjs";
export const config = { path: "/api/vigilance" };
export default async (req) => {
  const s = store();
  if (req.method === "GET") {
    if (new URL(req.url).searchParams.get("check")) return isAdmin(req) ? json({ ok: true }) : json({ ok: false }, 401);
    return json((await s.get("state", { type: "json" })) || {});
  }
  if (req.method === "POST") {
    if (!isAdmin(req)) return json({ error: "Code admin incorrect" }, 401);
    let b; try { b = await req.json(); } catch { return json({ error: "JSON invalide" }, 400); }
    const prev = (await s.get("state", { type: "json" })) || {};
    const hist = Array.isArray(prev.history) ? prev.history : [];
    const was = effective(prev), now = effective(b);
    const label = { green: "verte", yellow: "jaune", orange: "orange", red: "rouge", violet: "violette", black: "noire" };
    if (was !== now || (b.from && Date.parse(b.from) > Date.now())) hist.unshift({ l: now, t: "Vigilance " + label[now], d: new Date().toISOString() });
    b.history = hist.slice(0, 10);
    await s.setJSON("state", b);
    await notifyIfChanged(b);
    return json(b);
  }
  return json({ error: "Méthode non permise" }, 405);
};
