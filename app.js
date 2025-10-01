document.addEventListener('DOMContentLoaded',()=>{
  const API_URL = 'https://script.google.com/macros/s/AKfycbysa0N4UVXpSDjWGL3NHvPiSgRDdaAMfCY9OEyDgiNLWWaf-MLhcUBTsw0TwTHdhwoNZg/exec';
  const el = id=>document.getElementById(id);

  // show/hide
  const show = i=>el(i).classList.remove('hidden');
  const hide = i=>el(i).classList.add('hidden');
  const clearList = i=>el(i).innerHTML='';

  // LOGIN
  el('loginBtn').onclick = async ()=>{
    el('loginError').textContent = '';
    const email = el('emailInput').value.trim();
    const pwd   = el('pwdInput').value.trim();
    if(!email||!pwd) return el('loginError').textContent='Email & mdp requis';
    try {
      const res = await fetch(API_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'login',email,password:pwd})
      }).then(r=>r.json());
      if(res.success){
        hide('loginBox'); show('appBox');
        loadKPI();
      } else el('loginError').textContent=res.error;
    } catch {
      el('loginError').textContent='Erreur réseau';
    }
  };

  // LOGOUT
  el('logoutBtn').onclick = ()=>{hide('appBox');show('loginBox');};

  // NAV
  document.querySelectorAll('nav a').forEach(a=>{
    a.onclick = e=>{
      e.preventDefault();
      document.querySelectorAll('nav a').forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
      document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
      show(a.dataset.sec);
    };
  });

  // KPI
  el('refreshKPI').onclick = loadKPI;
  async function loadKPI(){
    clearList('kpiList');
    try {
      const all = await fetch(API_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'getAll',tab:'WorkOrders'})
      }).then(r=>r.json());
      [['Ouverts',all.filter(o=>!o.report).length],
       ['Retard',all.filter(o=>Date.now()-+o.date>86400000).length]]
      .forEach(([l,v])=>{
        const li=document.createElement('li');
        li.textContent=`${l}: ${v}`; el('kpiList').append(li);
      });
    } catch { alert('Erreur KPI'); }
  }

  // LISTES
  const bind = (btnId,listId,tab)=> el(btnId).onclick=async()=>{
    clearList(listId);
    try {
      const arr = await fetch(API_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'getAll',tab})
      }).then(r=>r.json());
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
