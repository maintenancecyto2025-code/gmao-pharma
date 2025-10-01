# GMAO Pharma - Solution statique sur GitHub Pages

## Déploiement

1. **Fork/Cloner le dépôt**
2. Placer vos fichiers dans le dossier racine :
   - `index.html`, `style.css`, `config.js`, `app.js`, `assets/logo.png`
3. Activer GitHub Pages :
   - Aller dans `Settings > Pages` du dépôt
   - Source : branch `main` ou `master`, dossier `/root`
   - L’URL est affichée juste après

## Connexion à Google Sheets

- Le back-end Apps Script expose les services en JSONP (`doGet` avec paramètre `callback`)
- Configurez le script selon l’exemple `docs/architecture.md` pour les onglets :
  - `Users`, `WorkOrders`, `Docs`, `Stocks`, `AuditTrail`, `Evals`

## Sécurité

- Aucun secret dans le client.
- Les mots de passe sont hashés en SHA-256 côté client et côté serveur (Google Apps Script).
- Toutes les API sont en HTTPS.

## Fonctionnalités

- Gestion utilisateurs/évaluations/stock/OT/docs/KPI
- Signature électronique et audit trail sur les actions sensibles
- Export PDF automatique
