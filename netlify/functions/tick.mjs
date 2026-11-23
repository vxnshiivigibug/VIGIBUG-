import { store, notifyIfChanged } from "./_lib.mjs";
// Toutes les 5 minutes : prévient quand une vigilance prévue démarre ou se termine.
export const config = { schedule: "*/5 * * * *" };
export default async () => { const v = await store().get("state", { type: "json" }); if (v) await notifyIfChanged(v); };
