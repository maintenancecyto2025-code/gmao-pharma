document.addEventListener('DOMContentLoaded',()=>{
  const el = id=>document.getElementById(id);
  // Helper JSONP
  function api(action,data={},cb){
    const cbName = 'cb'+Math.random().toString(36).substr(2,8);
    window[cbName] = res=>{
      delete window[cbName];
      cb(res);
    };
    const script = document.createElement('script');
    script.src = `${API_URL}?action=${action}&data=${encodeURIComponent(JSON.stringify(data))}&callback=${cbName}`;
    document.body.appendChild(script);
  }
  // SHA-256 hashing (client-side, for demo only; real hash server-side)
  async function hash(str){
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  // UI helpers
  const show = i=>el(i).classList.remove('hidden');
  const hide = i=>el(i).classList.add('hidden');
  const clearList = i=>el(i).innerHTML='';

  // LOGIN
  el('loginBtn').onclick = async ()=>{
    el('loginError').textContent = '';
    const email = el('emailInput').value.trim();
    const pwd   = el('pwdInput').value.trim();
    if(!email||!pwd) return el('loginError').textContent='Email & mdp requis';
    const hashedPwd = await hash(pwd);
    api('login',{email,password:hashedPwd}, res=>{
      if(res.success){
        hide('loginBox'); show('appBox');
        window.USER = res.user;
        loadKPI();
      } else el('loginError').textContent=res.error;
    });
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
  function loadKPI(){
    clearList('kpiList');
    api('getKPI',{}, res=>{
      if(res.kpi){
        Object.entries(res.kpi).forEach(([l,v])=>{
          const li=document.createElement('li');
          li.textContent=`${l}: ${v}`; el('kpiList').append(li);
        });
      }
    });
  }
  el('exportPDF').onclick = ()=>api('exportPDF',{},res=>{window.open(res.url)});

  // USERS
  el('loadUsers').onclick = ()=>{ clearList('usersList');
    api('getUsers',{},res=>{
      res.users.forEach(u=>{
        const li=document.createElement('li');
        li.textContent=`${u.nom} (${u.role})`;
        el('usersList').append(li);
      });
    });
  };

  // OT
  el('loadWO').onclick = ()=>{ clearList('woList');
    api('getOT',{},res=>{
      res.ot.forEach(o=>{
        const li=document.createElement('li');
        li.textContent=`${o.type} - ${o.equipement} - ${o.date} - ${o.status}`;
        el('woList').append(li);
      });
    });
  };

  // DOCS
  el('loadDocs').onclick = ()=>{ clearList('docsList');
    api('getDocs',{},res=>{
      res.docs.forEach(d=>{
        const li=document.createElement('li');
        li.textContent=`${d.nom} v${d.version} - ${d.equipement}`;
        el('docsList').append(li);
      });
    });
  };

  // STOCKS
  el('loadStocks').onclick = ()=>{ clearList('stocksList');
    api('getStocks',{},res=>{
      res.stocks.forEach(s=>{
        const li=document.createElement('li');
        li.textContent=`${s.ref} - ${s.fournisseur} - ${s.qte} (seuil: ${s.seuil})`;
        el('stocksList').append(li);
      });
    });
  };

  // EVALS
  el('loadEvals').onclick = ()=>{ clearList('evalsList');
    api('getEvals',{},res=>{
      res.evals.forEach(e=>{
        const li=document.createElement('li');
        li.textContent=`${e.nom} - ${e.date} - ${e.resultat}`;
        el('evalsList').append(li);
      });
    });
  };
});