// Config API Google Apps Script exposé en JSONP
const API_URL = 'https://script.google.com/macros/s/AKfycbxheHKevjLd_zTIVSzBwkYJfvmGWem8-C1H7iZW0Qs7HjdL5BM8lLOpTnes7xnlicew0A/exec';
// Rôles & permissions
const ROLES = {
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  TECH: 'Technicien'
};
const PERMISSIONS = {
  'Administrateur': ['all'],
  'Manager': [
    'create_ot', 'close_ot', 'eval_create', 'eval_read', 'user_read', 'doc_sign', 'stock_read', 'kpi'
  ],
  'Technicien': [
    'ot_read', 'eval_read_own', 'doc_read', 'stock_read', 'kpi'
  ]
};