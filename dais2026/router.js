/* =====================================================================
   ROUTER + NAV  (screen renderers loaded below)
   ===================================================================== */
let teardowns = [];
function cleanup(){ teardowns.forEach(fn=>{try{fn()}catch(e){}}); teardowns=[]; }
function onTeardown(fn){ teardowns.push(fn); }
const app = document.getElementById('app');
const $crumb = document.getElementById('crumb');
const $prev = document.getElementById('prevBtn');
const $next = document.getElementById('nextBtn');

function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),1600); }

function cssv(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

function route(){
  cleanup();
  const hash = location.hash.replace(/^#\//,'');
  window.scrollTo({top:0,behavior:'instant'});
  if(!hash || !C[hash]){ renderLanding(); $crumb.textContent=''; setNav(null);
    return; }
  renderScreen(hash);
  const idx = ORDER.indexOf(hash);
  const tc = tr(hash);
  $crumb.innerHTML = `<b>${tc.tag}</b> · ${tc.title}`;
  setNav(idx);
}
function setNav(idx){
  if(idx===null){ $prev.disabled=true; $next.disabled=true; return; }
  $prev.disabled = idx<=0; $next.disabled = idx>=ORDER.length-1;
  $prev.onclick = ()=>{ if(idx>0) location.hash='#/'+ORDER[idx-1]; };
  $next.onclick = ()=>{ if(idx<ORDER.length-1) location.hash='#/'+ORDER[idx+1]; };
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ location.hash='#/'; }
  const m = location.hash.replace(/^#\//,''); const idx=ORDER.indexOf(m);
  if(e.key==='ArrowRight' && idx>-1 && idx<ORDER.length-1) location.hash='#/'+ORDER[idx+1];
  if(e.key==='ArrowLeft' && idx>0) location.hash='#/'+ORDER[idx-1];
  if(e.key==='ArrowRight' && idx===-1) location.hash='#/'+ORDER[0];
});
window.addEventListener('hashchange',route);
