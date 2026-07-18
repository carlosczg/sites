/* =====================================================================
   LANDING — Modern Databricks Stack
   ===================================================================== */
const ICONS={
apps:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
watch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',
people:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M2.5 20c0-3.3 2.5-5.5 5.5-5.5S13.5 16.7 13.5 20Z"/><path d="M14.6 20c.2-2.6 1.7-4.2 3.9-4.2 2.2 0 3.7 1.8 3.9 4.2Z"/></svg>',
genie:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.3 2.7 6.4 7 7-4.3.6-6.4 2.7-7 7-.6-4.3-2.7-6.4-7-7 4.3-.6 6.4-2.7 7-7Z"/><path d="M19.5 13c.2 1.6 1 2.4 2.5 2.7-1.5.3-2.3 1.1-2.5 2.6-.2-1.5-1-2.3-2.5-2.6 1.5-.3 2.3-1.1 2.5-2.7Z"/></svg>',
lamp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 16c0-1.9 3-3.3 8-3.3 1.4 0 2.7.1 3.8.3l3.6-2.2c.5-.3 1.1-.1 1.3.4.2.5 0 1-.4 1.3l-1.9 1c1.3.7 2.1 1.5 2.1 2.5 0 2-3.8 3.3-8.5 3.3S2.5 18 2.5 16Z"/><path d="M9.5 12.6V9.5h4v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
bricks:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="8.5" height="4.3" rx="1.2"/><rect x="13" y="4" width="8" height="4.3" rx="1.2"/><rect x="3" y="9.8" width="8" height="4.3" rx="1.2"/><rect x="12.5" y="9.8" width="8.5" height="4.3" rx="1.2"/><rect x="3" y="15.6" width="8.5" height="4.3" rx="1.2"/><rect x="13" y="15.6" width="8" height="4.3" rx="1.2"/></svg>',
flower:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2.3"/><circle cx="12" cy="19" r="2.3"/><circle cx="5.2" cy="8.5" r="2.3"/><circle cx="18.8" cy="8.5" r="2.3"/><circle cx="5.2" cy="15.5" r="2.3"/><circle cx="18.8" cy="15.5" r="2.3"/><circle cx="12" cy="12" r="2.6"/></svg>',
cog:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3.2"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22M4.9 4.9l2.3 2.3M16.8 16.8l2.3 2.3M19.1 4.9l-2.3 2.3M7.2 16.8l-2.3 2.3"/></g></svg>',
agent:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 3.5v3.3"/><circle cx="12" cy="2.8" r="1.2" fill="currentColor"/><circle cx="9.6" cy="13.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.4" cy="13.5" r="1.1" fill="currentColor" stroke="none"/></svg>',
flow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5h11l-3-3M21 7.5h-3.5"/><path d="M21 16.5H10l3 3M3 16.5h3.5"/></svg>',
house:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 11h3v9h5v-5h4v5h5v-9h3z"/></svg>',
layers:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 10-5z"/><path d="M2 12l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 17l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
db:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="7" ry="2.8" fill="currentColor" stroke="none"/><path d="M5 5v6c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V5"/><path d="M5 11v6c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-6"/></svg>',
delta:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4 22 20H2z"/></svg>',
iceberg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 20 14H4z"/><path d="M2 17.5c2 0 2-1.4 4-1.4s2 1.4 4 1.4 2-1.4 4-1.4 2 1.4 4 1.4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
cloud:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18h10a4 4 0 000-8 5 5 0 00-9.6-1.3A3.6 3.6 0 007 18Z"/></svg>',
model:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 7.5 16 11M8 16.5 16 12.8"/><circle cx="6" cy="7" r="2.2" fill="currentColor" stroke="none"/><circle cx="6" cy="17" r="2.2" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>',
share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 11 16 6.9M8 13 16 17.1"/><circle cx="6" cy="12" r="2.4" fill="currentColor" stroke="none"/><circle cx="18" cy="6" r="2.4" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r="2.4" fill="currentColor" stroke="none"/></svg>',
one:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 7.2 13.2 5v14h-2.6V8.6l-1.8 1z"/></svg>',
code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7 3.5 12 8 17M16 7l4.5 5L16 17"/></svg>',
ops:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 10-1.6 5.5"/><path d="M20 4.5V10h-5.3"/></svg>'
};
const OFFICIAL_PRODUCT_TILES=new Set([
  'apps','watch','people','genie','lamp','bricks','flower','cog','agent','flow','house','db'
]);
function renderLanding(){
  const tile=(ic)=>OFFICIAL_PRODUCT_TILES.has(ic)
    ? `<span class="itile product-logo logo-${ic}" aria-hidden="true"></span>`
    : `<span class="itile" aria-hidden="true">${ICONS[ic]||ic}</span>`;
  const item=(route,ic,name,sm)=>`<div class="pditem${sm?' sm':''}" role="button" tabindex="0" data-route="${route}">
    ${tile(ic)}<span class="iname">${name}</span></div>`;
  const pill=(route,ic,label)=>`<span class="gpill" role="button" tabindex="0" data-route="${route}"><span class="d">${ICONS[ic]||ic}</span>${label}</span>`;
  const xchip=(route,name)=>`<span class="xchip" role="button" tabindex="0" data-route="${route}">${name}${C[route]&&C[route].flagship?' <span class="flag" style="--lc:var(--lava)">sim</span>':''}</span>`;

  app.innerHTML = `
  <div class="pdwrap">
    <div class="pdhead">
      <div class="db">
        <svg class="dbmark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <rect width="64" height="64" rx="14" fill="#071f26"/>
          <g fill="none" stroke="#ff3621" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20 32 9l20 11-20 11Z"/>
            <path d="m12 29 20 11 20-11"/>
            <path d="m12 39 20 11 20-11"/>
          </g>
        </svg>
        databricks
      </div>
      <div class="sep"></div>
      <div class="dai">DATA<span class="plus">+</span>AI<small>PLATFORM</small></div>
      <div class="sep"></div>
      <div class="tag">Context<i>.</i> Control<i>.</i> Cost<i>.</i> Choice<i>.</i></div>
    </div>

    <div class="pdiagram">
      <div class="player apps">
        <div class="lbl">${t('l_agenticapps')}</div>
        <div class="pdrow">
          ${item('marketplace','apps',t('l_apps'))}
          ${item('lakewatch','watch','Lakewatch')}
          ${item('agenticcdp','people','CustomerLake')}
        </div>
      </div>

      <div class="player work">
        <div class="lbl">${t('l_agenticwork')}</div>
        <div class="workcontent">
          <div class="pdrow worktop">
            <div class="pgroup genie">
              ${item('geniecode','genie','Genie')}
              <div class="pills">
                ${pill('genieone','one','One')}
                ${pill('genieagents','genie','Agents')}
                ${pill('geniecode','code','Code')}
                ${pill('vibecoding','apps','App Builder')}
                ${pill('geniezeroops','ops','Zero Ops')}
              </div>
            </div>
            <div class="pgroup devtools">
              ${item('agentbricks','bricks','Agent Bricks')}
              <div class="vsep"></div>
              ${item('omnigent','flower','Omnigent')}
            </div>
            <div class="lbl right">${t('l_agenticdev')}</div>
          </div>
          <div class="pontology"><span class="line"></span>${item('geniontology','lamp','Genie Ontology')}<span class="line"></span></div>
        </div>
      </div>

      <div class="player governance">
        <div class="lbl">${t('l_governance')}</div>
        <div class="pdrow">
          ${item('unitycatalog','cog','Unity Catalog')}
          ${item('aigateway','agent','Unity AI Gateway')}
        </div>
      </div>

      <div class="player data">
        <div class="lbl">${t('l_agenticdata')}</div>
        <div class="pdrow">
          ${item('lakeflow','flow','Lakeflow')}
          ${item('lakehouse','house','Lakehouse')}
          ${item('lakebasepartners','db','Lakebase')}
        </div>
      </div>

      <div class="player infra">
        <div class="lbl">${t('l_openinfra')}</div>
        <div class="pdrow infra">
          <span class="infralabel">${t('l_openformat')}</span>
          ${item('lakehouse','delta','Delta Lake',true)}
          ${item('lakehouse','iceberg','Iceberg',true)}
          <span class="infragap"></span>
          ${item('azure','cloud',t('l_anycloud'),true)}
          ${item('aiplatform','model',t('l_anymodel'),true)}
          ${item('opensharing','share',t('l_anydata'),true)}
        </div>
      </div>
    </div>

    <div class="event-meta">● Data + AI Summit 2026 · June 15–18 · Moscone, SF</div>

    <div class="alsohead">${t('l_also')}</div>
    <div class="xchips">
      ${xchip('aiplatform','AI Platform — Real-Time ML')}
      ${xchip('ltap','LTAP & Lakebase')}
      ${xchip('lakehousert','Lakehouse//RT')}
      ${xchip('opensharing','OpenSharing')}
      ${xchip('secureconnect','SecureConnect')}
      ${xchip('aifirst','AI-First Data Engineering')}
      ${xchip('security','Platform Security & Compliance')}
      ${xchip('aibi','AI/BI Dashboards')}
      ${xchip('freeedition','Free Edition')}
      ${xchip('azure','Azure Databricks')}
      ${xchip('aws','AWS')}
    </div>
  </div>`;

  app.querySelectorAll('[data-route]').forEach(el=>{
    const open=()=>{ location.hash='#/'+el.dataset.route; };
    el.addEventListener('click',open);
    el.addEventListener('keydown',e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); } });
  });
}

/* =====================================================================
   GENERIC SCREEN SHELL
   ===================================================================== */
function renderScreen(key){
  const c = tr(key);
  const bullets = c.bullets.map(b=>`<li><span><b>${b[0]}.</b> ${b[1]}</span></li>`).join('');
  const stats = c.stats.map(s=>`<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
  app.innerHTML = `
  <section class="screen">
    <div class="shead">
      <span class="tag" style="color:var(${c.color})">${c.tag}</span>
      <h1>${c.title}</h1>
      <span class="date">${c.date}</span>
      <p class="sum">${c.sum}</p>
    </div>
    <div class="grid2">
      <div class="card">
        <h3><span class="ic">▸</span> ${t('whatsnew')}</h3>
        <ul class="bullets">${bullets}</ul>
        <div class="source">${t('source')} <a href="${c.src}" target="_blank" rel="noopener">${t('blog')}</a></div>
        ${c.signup?`<div class="source"><a href="${c.signup}" target="_blank" rel="noopener">${t('signup')}</a></div>`:''}
      </div>
      <div class="card">
        <h3><span class="ic">▦</span> ${t('bynumbers')}</h3>
        <div class="stats">${stats}</div>
        <div id="cardChart" style="margin-top:16px"></div>
      </div>
    </div>
    <div id="vidwrap"></div>
    <div class="simwrap" id="simwrap"></div>
  </section>`;
  // mount keynote video clips
  if(VIDEOS[key]) renderVideo(document.getElementById('vidwrap'), key);
  // mount sim or card chart
  if(c.flagship && SIMS[key]) SIMS[key](document.getElementById('simwrap'), c);
  else if(c.chart && CARDCHARTS[c.chart]) CARDCHARTS[c.chart](document.getElementById('cardChart'), c);
}

/* =====================================================================
   KEYNOTE VIDEO CLIPS — DAIS 2026 keynote, deep-linked by timestamp
   ===================================================================== */
// Source keynote videos. Each clip references one via its `v` key.
const KEYNOTE = {
  d1: "Qux8E-L1mk8",   // Data + AI Summit Keynote 2026 — Day 1
  d2: "sn9My5Pj0mE",   // Data + AI Summit Keynote 2026 — Day 2 (Agentic Era)
};
// clip = {v:'d1'|'d2', t:seconds, l:label}
const VIDEOS = {
  ltap:        [{v:'d1', t:7763,  l:"Lakebase"}, {v:'d1', t:10065, l:"LTAP"}],
  lakehousert: [{v:'d1', t:7582,  l:"Lakehouse//RT"}],
  genieone:    [{v:'d1', t:2596,  l:"Genie One"}, {v:'d1', t:4280, l:"Genie One — GA"}],
  geniontology:[{v:'d1', t:2330,  l:"Genie Ontology"}],
  lakeflow:    [{v:'d1', t:5475,  l:"Lakeflow"}],
  unitycatalog:[{v:'d1', t:1751,  l:"Unity Catalog"}],
  opensharing: [{v:'d1', t:1853,  l:"OpenSharing"}],
  lakehouse:   [{v:'d1', t:979,   l:"Lakehouse"}],
  genieagents: [{v:'d1', t:2702,  l:"Genie Agents"}],
  geniecode:   [{v:'d2', t:282,   l:"Genie Code for Data Engineering"}, {v:'d2', t:5893, l:"Genie Code for ML"}, {v:'d2', t:6322, l:"Genie Code / ZeroOps demo"}],
  // pages with clips from both keynotes
  geniezeroops:[{v:'d1', t:2793,  l:"Day 1 — Genie ZeroOps"}, {v:'d2', t:5362, l:"Day 2 — ML automation"}],
  aigateway:   [{v:'d1', t:1876,  l:"Day 1 — AI Gateway"}, {v:'d2', t:2811, l:"Day 2 — deep dive"}],
  agenticcdp:  [{v:'d1', t:3425,  l:"Day 1 — CustomerLake"}, {v:'d2', t:6768, l:"Day 2 — Infinity Campaigns"}],
  lakewatch:   [{v:'d1', t:3249,  l:"Day 1 — LakeWatch"}, {v:'d1', t:3358, l:"Day 1 — Panther Labs"}, {v:'d2', t:8185, l:"Day 2 — agentic security"}],
  // Day 2 (Agentic Era) only
  omnigent:    [{v:'d2', t:671,   l:"Omnigent"}],
  agentbricks: [{v:'d2', t:2171,  l:"Agent Bricks"}],
  aiplatform:  [{v:'d2', t:5362,  l:"ML Engineering & AI Runtime"}],
  vibecoding:  [{v:'d2', t:4384,  l:"Databricks Apps"}, {v:'d2', t:4853, l:"Genie App Builder"}],
};
function fmtTs(s){
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
  const mm=h?String(m).padStart(2,'0'):m;
  return (h?h+':':'')+mm+':'+String(sec).padStart(2,'0');
}
function ytEmbed(clip){
  return `https://www.youtube.com/embed/${KEYNOTE[clip.v]}?start=${clip.t}&rel=0&modestbranding=1`;
}
function renderVideo(parent, key){
  const clips=VIDEOS[key];
  const chips=clips.map((cl,i)=>
    `<button class="vidchip${i===0?' on':''}" data-i="${i}">▶ ${cl.l} <span class="ts">${fmtTs(cl.t)}</span></button>`
  ).join('');
  const usesBoth = clips.some(c=>c.v==='d1') && clips.some(c=>c.v==='d2');
  const card=document.createElement('div');
  card.className='card vidcard collapsed';
  card.innerHTML=`<h3><span class="vidlabel"><span class="ic">▶</span> Watch it in the keynote</span><span class="vidchevron">▾</span></h3>
    <div class="vidbody">
      <div class="vidframe"><iframe id="ytFrame"
        title="DAIS 2026 keynote" allow="accelerator;encrypted-media;picture-in-picture"
        allowfullscreen></iframe></div>
      ${clips.length>1?`<div class="vidchips">${chips}</div>`:''}
      <div class="vidnote">Clipped from the Data + AI Summit 2026 keynote${usesBoth?'s (Day 1 &amp; Day 2)':''}.</div>
    </div>`;
  parent.appendChild(card);
  const frame=card.querySelector('#ytFrame');
  let cur=0;
  const load=(i,autoplay)=>{ cur=i; frame.src=ytEmbed(clips[i])+(autoplay?'&autoplay=1':''); };
  // header toggles collapse; iframe loads lazily on first open, stops when collapsed
  card.querySelector('h3').onclick=()=>{
    const collapsed=card.classList.toggle('collapsed');
    if(collapsed) frame.src='';            // stop playback
    else load(cur, false);                 // (re)load current clip
  };
  card.querySelectorAll('.vidchip').forEach(b=>{
    b.onclick=()=>{
      card.querySelectorAll('.vidchip').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      load(+b.dataset.i, true);
    };
  });
}

/* shared chart helpers ------------------------------------------------ */
Chart.defaults.color = cssv('--ink3');
Chart.defaults.font.family = 'DM Sans, sans-serif';
Chart.defaults.borderColor = cssv('--line');
function mkCanvas(parent,h){ const w=document.createElement('div'); w.className='canvasbox';
  if(h) w.style.height=h+'px'; const cv=document.createElement('canvas'); w.appendChild(cv);
  parent.appendChild(w); return cv; }
function chart(cv,cfg){ const ch=new Chart(cv,cfg); onTeardown(()=>ch.destroy()); return ch; }
const COL={lava:'#ff3621',lava2:'#ff6a52',amber:'#ffab00',cyan:'#15afdd',blue:'#2375a8',
  green:'#52a870',pink:'#c85070',gold:'#c89930',good:'#3ddc84',bad:'#ff5470',ink3:'#6b7e9c'};

/* simbox helper */
function simShell(parent,label,title,inner){
  const box=document.createElement('div'); box.className='simbox';
  box.innerHTML=`<div class="simtitle"><h3>${title}</h3><span class="lab">${label}</span></div>${inner}`;
  parent.appendChild(box); return box;
}
