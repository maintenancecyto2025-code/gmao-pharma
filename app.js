// Cette fonction permet de calculer le hash SHA-256 d’un texte (mot de passe)
async function hash(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

document.addEventListener('DOMContentLoaded',()=>{
  // Adresse de ton API Google Apps Script
  const API_URL = 'https://script.google.com/macros/s/AKfycbxheHKevjLd_zTIVSzBwkYJfvmGWem8-C1H7iZW0Qs7HjdL5BM8lLOpTnes7xnlicew0A/exec';
  const el = id=>document.getElementById(id);

  // Fonction d’appel à l’API
  const api = (action,data={})=> fetch(API_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action,...data})
  }).then(r=>r.json());

  // Afficher/masquer une partie du site
  const show = i=>el(i).classList.remove('hidden');
  const hide = i=>el(i).classList.add('hidden');
  const clearList = i=>el(i).innerHTML='';

  // --- LOGIN ---
  el('loginBtn').onclick = async ()=>{
    el('loginError').textContent = '';
    const email = el('emailInput').value.trim();
    const pwd   = el('pwdInput').value.trim();
    if(!email||!pwd) return el('loginError').textContent='Email & mdp requis';

    // Hashage du mot de passe AVANT l’envoi
    const hashedPwd = await hash(pwd);

    try {
      // On envoie l’email et le hash du mdp au serveur
      const res = await api('login',{email,password:hashedPwd});
      if(res.success){
        hide('loginBox'); show('appBox');
        loadKPI();
      } else el('loginError').textContent=res.error;
    } catch {
      el('loginError').textContent='Erreur réseau';
    }
  };

  // --- LOGOUT ---
  el('logoutBtn').onclick = ()=>{hide('appBox');show('loginBox');};

  // --- NAVIGATION ---
  document.querySelectorAll('nav a').forEach(a=>{
    a.onclick = e=>{
      e.preventDefault();
      document.querySelectorAll('nav a').forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
      document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
      show(a.dataset.sec);
    };
  });

  // --- KPI ---
  el('refreshKPI').onclick = loadKPI;
  async function loadKPI(){
    clearList('kpiList');
    try {
      const all = await api('getAll',{tab:'WorkOrders'});
      [['Ouverts',all.filter(o=>!o.report).length],
       ['Retard',all.filter(o=>Date.now()-+o.date>86400000).length]]
      .forEach(([l,v])=>{
        const li=document.createElement('li');
        li.textContent=`${l}: ${v}`; el('kpiList').append(li);
      });
    } catch { alert('Erreur KPI'); }
  }

  // --- LISTES ---
  const bind = (btnId,listId,tab)=> el(btnId).onclick=async()=>{
    clearList(listId);
    try {
      const arr = await api('getAll',{tab});
      arr.forEach(o=>{
        const li=document.createElement('li');
        li.textContent=Object.values(o).join(' – ');
        el(listId).append(li);
      });
    } catch { alert(`Erreur ${tab}`); }
  };
  bind('loadWO','woList','WorkOrders');
  bind('loadStocks','stocksList','Stocks');
  bind('loadDocs','docsList','Docs');
  bind('loadUsers','usersList','Users');
});
