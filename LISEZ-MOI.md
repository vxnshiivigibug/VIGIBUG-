# Vigibug + blog vxnshii sur Netlify

## Mise en ligne (une seule fois)
1. Crée un dépôt GitHub avec le contenu de ce dossier, puis sur Netlify : Add new site, Import from Git.
2. Crée tes clés d'alerte : `npx web-push generate-vapid-keys`.
3. Dans Netlify, Site configuration, Environment variables, ajoute :
   - `ADMIN_TOKEN` : le code que tu tapes dans Vigibug (choisis-le long et secret)
   - `VAPID_PUBLIC` et `VAPID_PRIVATE` : les deux clés de l'étape 2
   - `VAPID_SUBJECT` : `mailto:ton-email`
4. Redéploie. Blog : `https://ton-site.netlify.app/`, Vigibug : `https://ton-site.netlify.app/vigibug.html`.

## Utilisation
- Vigibug, onglet Gestion : entre ton code, choisis le niveau (et un début/fin prévus), puis Publier.
- Le blog lit le niveau toutes les minutes ; les visiteurs qui ont activé les alertes reçoivent une notification.
- Une vigilance prévue démarre toute seule à l'heure choisie (contrôle toutes les 5 minutes).
- iPhone : ouvre Vigibug dans Safari, Partager, Sur l'écran d'accueil, puis active les alertes.
