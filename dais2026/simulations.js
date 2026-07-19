/* =====================================================================
   FLAGSHIP SIMULATIONS
   ===================================================================== */
const SIMS = {};

/* Lakehouse//RT — benchmark race: Reyden vs serving layer ------------ */
SIMS.lakehousert = (root)=>{
  const box = simShell(root,'Interactive simulation','Benchmark race — ramp QPS, watch p99 latency hold',`
    <div class="controls">
      <div class="ctl"><label>Concurrent QPS: <b id="rtQ" style="color:var(--ink)">2,000</b></label>
        <input type="range" id="rtQps" min="100" max="12000" step="100" value="2000"></div>
      <div class="ctl"><label>Dataset</label><div class="seg" id="rtScale"><button data-s="0" class="on">GB</button><button data-s="1">100 GB</button><button data-s="2">TB</button></div></div>
    </div>
    <div class="simgrid">
      <div><canvas id="rtChart" height="200"></canvas></div>
      <div><div class="readout">
        <div class="ro"><b id="rtReyden" style="color:var(--good)">—</b><span>Reyden p99</span></div>
        <div class="ro"><b id="rtServe" style="color:var(--bad)">—</b><span>serving layer p99</span></div>
        <div class="ro"><b id="rtMult">—</b><span>Reyden advantage</span></div>
        <div class="ro"><b>1 copy</b><span>no duplication</span></div>
      </div>
      <div class="note" id="rtNote">Slide up the load. Reyden holds <b>sub-100ms to 12,000 QPS</b> on one governed copy; legacy serving layers spike or fail as load and scale grow.</div></div>
    </div>`);
  let scale=0;
  const hist=Array(30).fill(8);
  const ch=chart(box.querySelector('#rtChart'),{type:'line',
    data:{labels:hist.map((_,i)=>i),datasets:[
      {label:'Reyden (Lakehouse//RT)',data:hist.slice(),borderColor:COL.green,backgroundColor:'rgba(82,168,112,.15)',fill:true,tension:.35,pointRadius:0},
      {label:'Serving layer',data:hist.slice(),borderColor:COL.bad,tension:.35,pointRadius:0}]},
    options:{animation:false,plugins:{legend:{position:'bottom'}},scales:{y:{min:0,suggestedMax:300,title:{display:true,text:'p99 ms'}},x:{display:false}}}});
  function update(){
    const q=+box.querySelector('#rtQps').value;
    box.querySelector('#rtQ').textContent=q.toLocaleString();
    const base=[6,18,45][scale];
    const reyden=base + (q/12000)*(40+scale*25);
    const serve=base*2.2 + Math.pow(q/3000,2.0)*(20+scale*30);
    hist.push(reyden);hist.shift();
    ch.data.datasets[0].data=hist.slice();
    ch.data.datasets[1].data=Array(30).fill(serve);
    ch.update('none');
    box.querySelector('#rtReyden').textContent=reyden.toFixed(0)+' ms';
    box.querySelector('#rtServe').textContent=serve>2000?'timeout':serve.toFixed(0)+' ms';
    box.querySelector('#rtMult').textContent=(serve/reyden).toFixed(1)+'x';
  }
  box.querySelector('#rtQps').oninput=update;
  box.querySelector('#rtScale').onclick=e=>{if(e.target.dataset.s){scale=+e.target.dataset.s;
    box.querySelector('#rtScale').querySelectorAll('button').forEach(b=>b.classList.remove('on'));e.target.classList.add('on');update();}};
  const iv=setInterval(update,650);onTeardown(()=>clearInterval(iv));update();
};

/* 1. LakeWatch — threat-response race -------------------------------- */
SIMS.lakewatch = (root)=>{
  const box = simShell(root,'Interactive simulation','Threat-response race: traditional SIEM vs LakeWatch',`
    <div class="controls">
      <div class="seg" id="lwMode"><button data-m="trad">Traditional SIEM</button><button data-m="lw" class="on">LakeWatch</button></div>
      <button class="btn" id="lwRun">▶ Launch attack</button>
    </div>
    <div class="simgrid">
      <div><canvas id="lwBars" height="200"></canvas></div>
      <div>
        <div class="readout">
          <div class="ro"><b id="lwTime">—</b><span>time to detect</span></div>
          <div class="ro"><b id="lwData">—</b><span>telemetry seen</span></div>
          <div class="ro"><b id="lwCost">—</b><span>relative cost</span></div>
          <div class="ro"><b id="lwOut" style="color:var(--good)">—</b><span>outcome</span></div>
        </div>
        <div class="note" id="lwNote">Pick a mode and launch an attack. Attacker mean-time-to-exploit in 2026 is just <b>1.6 days</b> — defenders must respond at machine speed.</div>
      </div>
    </div>`);
  let mode='lw';
  box.querySelectorAll('#lwMode button').forEach(b=>b.onclick=()=>{
    box.querySelectorAll('#lwMode button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); mode=b.dataset.m; });
  const ch = chart(box.querySelector('#lwBars'),{type:'bar',
    data:{labels:['Ingest %','Retention (mo)','Detect speed','Cost'],
      datasets:[{label:'Traditional',data:[35,1,20,100],backgroundColor:COL.ink3},
      {label:'LakeWatch',data:[100,24,95,20],backgroundColor:COL.bad}]},
    options:{plugins:{legend:{position:'bottom'}},scales:{y:{beginAtZero:true,max:120}}}});
  box.querySelector('#lwRun').onclick=()=>{
    const t=box.querySelector('#lwTime'),d=box.querySelector('#lwData'),
      co=box.querySelector('#lwCost'),o=box.querySelector('#lwOut'),n=box.querySelector('#lwNote');
    if(mode==='trad'){ t.textContent='38 hrs'; t.style.color=COL.bad; d.textContent='35%';
      co.textContent='100%'; o.textContent='BREACHED'; o.style.color=COL.bad;
      n.innerHTML='Coupled storage/compute forced you to drop 65% of telemetry and keep only weeks. The attack hid in data you never ingested.'; }
    else { t.textContent='4 min'; t.style.color=COL.good; d.textContent='100%';
      co.textContent='20%'; o.textContent='CONTAINED'; o.style.color=COL.good;
      n.innerHTML='Full-fidelity telemetry in your own storage + Genie agents detecting at machine speed. <b>80% lower cost</b>, years hot-queryable.'; }
    toast(mode==='lw'?'Threat contained in 4 minutes':'Breach: blind spots in dropped data');
  };
  // mttE trend mini chart in card slot
};

/* 2. OpenSharing — share routing across recipients ------------------- */
SIMS.opensharing = (root)=>{
  const box = simShell(root,'Interactive simulation','Share across clouds — toggle SecureConnect & Global Distribution',`
    <div class="controls">
      <span style="font-size:12px;color:var(--ink3)">Share objects:</span>
      <span class="chip on" data-a="data">📊 Data</span><span class="chip" data-a="model">🧠 Models</span>
      <span class="chip" data-a="agent">🤖 Agents</span><span class="chip" data-a="genie">💬 Genie Agents</span>
    </div>
    <div class="controls">
      <label class="chip" id="scToggle">🔐 SecureConnect proxy</label>
      <label class="chip" id="gdToggle">🌐 Global Distribution</label>
      <span style="margin-left:auto;font-size:12px;color:var(--ink3)">Recipients: <b id="recCount" style="color:var(--ink)">3</b> · <button class="btn ghost" id="addRec">+ add recipient</button></span>
    </div>
    <canvas id="osCanvas" class="flowcanvas" height="240"></canvas>
    <div class="note" id="osNote">Drag-free demo: toggle options and add recipients to watch governed shares route from the provider. Unity Catalog enforces row/column controls end-to-end.</div>`);
  const cv=box.querySelector('#osCanvas'); const ctx=cv.getContext('2d');
  let recips=3, sc=false, gd=false; const objs={data:true,model:false,agent:false,genie:false};
  box.querySelectorAll('.chip[data-a]').forEach(ch=>ch.onclick=()=>{objs[ch.dataset.a]=!objs[ch.dataset.a];ch.classList.toggle('on');draw();});
  box.querySelector('#scToggle').onclick=function(){sc=!sc;this.classList.toggle('on');draw();toast(sc?'SecureConnect on — one config for all recipients':'SecureConnect off');};
  box.querySelector('#gdToggle').onclick=function(){gd=!gd;this.classList.toggle('on');draw();toast(gd?'Global Distribution — local replicas, zero egress':'Global Distribution off');};
  box.querySelector('#addRec').onclick=()=>{recips=Math.min(recips+1,7);box.querySelector('#recCount').textContent=recips;draw();};
  function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=240*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);draw();}
  let raf, t0=performance.now();
  function draw(){
    const W=cv.clientWidth,H=240; ctx.clearRect(0,0,W,H);
    const px=70, py=H/2; const objList=Object.keys(objs).filter(k=>objs[k]);
    // provider
    ctx.fillStyle=COL.cyan; roundRect(ctx,px-46,py-30,92,60,10); ctx.fill();
    ctx.fillStyle=canvasTextColor(COL.cyan);ctx.font='600 12px Inter';ctx.textAlign='center';canvasLabel(ctx,'Provider',px,py-6,82);
    canvasLabel(ctx,'Unity Catalog',px,py+10,82);
    // proxy node if SecureConnect
    const proxyX = sc? W*0.45 : null;
    if(sc){ ctx.fillStyle=COL.amber; roundRect(ctx,proxyX-34,py-22,68,44,9);ctx.fill();
      ctx.fillStyle=canvasTextColor(COL.amber);canvasLabel(ctx,'Secure',proxyX,py-2,58);canvasLabel(ctx,'Connect',proxyX,py+12,58);}
    // recipients
    const rx=W-72; const now=performance.now();
    for(let i=0;i<recips;i++){
      const ry= recips===1?py : 36 + i*((H-72)/(recips-1||1));
      // connection
      ctx.strokeStyle = sc?'rgba(255,171,0,.55)':'rgba(107,126,156,.5)';
      ctx.lineWidth=sc?2:1; if(!sc && recips>3){ctx.setLineDash([4,4]);} else ctx.setLineDash([]);
      ctx.beginPath();
      if(sc){ ctx.moveTo(px+46,py); ctx.lineTo(proxyX-34,py); }
      const startX = sc?proxyX+34:px+46, startY=py;
      ctx.moveTo(startX,startY); ctx.bezierCurveTo((startX+rx)/2,startY,(startX+rx)/2,ry,rx-30,ry); ctx.stroke();
      ctx.setLineDash([]);
      // animated packets
      objList.forEach((o,oi)=>{
        const phase=((now-t0)/1400 + i*0.13 + oi*0.22)%1;
        const t=phase; const bx=lerp(startX,rx-30,t), by=qb(startY,ry,t,(startX+rx)/2);
        ctx.fillStyle=objColor(o); ctx.beginPath();ctx.arc(bx,by,4,0,7);ctx.fill();
      });
      // recipient box
      const replica = gd;
      ctx.fillStyle= replica?COL.green:COL.blue; roundRect(ctx,rx-30,ry-15,60,30,8);ctx.fill();
      ctx.fillStyle=canvasTextColor(replica?COL.green:COL.blue);ctx.font='600 10px Inter';canvasLabel(ctx,'R'+(i+1),rx,ry-1,50);
      canvasLabel(ctx,replica?'replica':'remote',rx,ry+10,50);
    }
    // legend / status
    ctx.textAlign='left';ctx.font='11px Inter';ctx.fillStyle=COL.ink3;
    canvasLabel(ctx,(sc?'1 config for all':(recips+' manual allowlists'))+(gd?' · 0 egress':''),10,H-10,W-20);
    raf=requestAnimationFrame(draw);
  }
  function objColor(o){return o==='data'?COL.cyan:o==='model'?COL.amber:o==='agent'?COL.green:COL.pink;}
  window.addEventListener('resize',resize); onTeardown(()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);});
  resize();
};

/* 3. Unity Catalog — lineage + pillar graph -------------------------- */
SIMS.unitycatalog = (root)=>{
  const box = simShell(root,'Interactive simulation','Governance graph — click an asset to trace lineage & policies',`
    <div class="controls">
      <div class="seg" id="ucPillar">
        <button data-p="control" class="on">Control</button><button data-p="context">Context</button><button data-p="choice">Choice</button>
      </div>
    </div>
    <div class="simgrid">
      <div><canvas id="ucCanvas" class="flowcanvas" height="240"></canvas></div>
      <div><div class="card" style="box-shadow:none" id="ucInfo">
        <h3 style="margin-bottom:8px">Asset detail</h3>
        <div id="ucDetail" style="font-size:13px;color:var(--ink2)">Click any node in the lineage graph to inspect its governance.</div>
      </div></div>
    </div>`);
  const cv=box.querySelector('#ucCanvas'),ctx=cv.getContext('2d');
  const nodes=[{id:'src',x:.12,y:.5,l:'raw_events',t:'source'},
    {id:'silver',x:.4,y:.3,l:'customers',t:'table'},
    {id:'gold',x:.4,y:.72,l:'orders',t:'table'},
    {id:'metric',x:.7,y:.5,l:'revenue',t:'metric'},
    {id:'bi',x:.92,y:.3,l:'Exec BI',t:'report'},
    {id:'agent',x:.92,y:.72,l:'Sales Agent',t:'agent'}];
  const edges=[['src','silver'],['src','gold'],['silver','metric'],['gold','metric'],['metric','bi'],['metric','agent']];
  const details={
    src:'<b>raw_events</b> · external location<br>FILE type (multimodal), Iceberg v3.<br><span class="pill beta">tags: pii=false</span>',
    silver:'<b>customers</b><br>ABAC: <span class="pill pp">mask email unless role=analyst</span><br>row filter by region · lineage from raw_events',
    gold:'<b>orders</b><br>col-level: revenue visible to finance<br><span class="pill ga">tag propagation: confidential</span>',
    metric:'<b>revenue</b> metric view<br>multi-fact + level-of-detail · materialized<br>authored via Genie · imported from Tableau',
    bi:'<b>Exec BI</b> report<br>external lineage (GA) recorded automatically<br>downstream of revenue metric',
    agent:'<b>Sales Agent</b><br>governed by Unity AI Gateway<br><span class="pill pp">context attr: agent-access policy</span> · traced in LakeWatch'};
  let pillar='control', sel=null;
  box.querySelectorAll('#ucPillar button').forEach(b=>b.onclick=()=>{
    box.querySelectorAll('#ucPillar button').forEach(x=>x.classList.remove('on'));b.classList.add('on');pillar=b.dataset.p;});
  function pos(n){return{x:n.x*cv.clientWidth,y:n.y*240};}
  function draw(){const W=cv.clientWidth,H=240;ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(107,126,156,.45)';ctx.lineWidth=1.5;
    edges.forEach(([a,b])=>{const p=pos(nodes.find(n=>n.id===a)),q=pos(nodes.find(n=>n.id===b));
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();});
    nodes.forEach(n=>{const p=pos(n);const on= sel===n.id;
      const c= n.t==='agent'||n.t==='report'?COL.amber : n.t==='metric'?COL.green : COL.cyan;
      ctx.fillStyle=on?COL.lava:c;ctx.beginPath();ctx.arc(p.x,p.y,on?13:10,0,7);ctx.fill();
      ctx.fillStyle=cssv('--ink');ctx.font='600 11px Inter';ctx.textAlign='center';canvasLabel(ctx,n.l,p.x,p.y-16,76);});
  }
  cv.onclick=(e)=>{const r=cv.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
    let hit=null;nodes.forEach(n=>{const p=pos(n);if(Math.hypot(p.x-mx,p.y-my)<16)hit=n.id;});
    if(hit){sel=hit;box.querySelector('#ucDetail').innerHTML=details[hit];draw();}};
  function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=240*devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);draw();}
  window.addEventListener('resize',resize);onTeardown(()=>window.removeEventListener('resize',resize));resize();
};

/* 4. AI Platform — QPS load test ------------------------------------- */
SIMS.aiplatform = (root)=>{
  const box = simShell(root,'Interactive simulation','Real-time serving load test — ramp QPS, watch p99 hold',`
    <div class="controls">
      <div class="ctl"><label>Target QPS: <b id="qpsVal" style="color:var(--ink)">50,000</b></label>
        <input type="range" id="qps" min="1000" max="320000" step="1000" value="50000"></div>
      <label class="chip on" id="autoTune">⚙ Auto platform tuning</label>
    </div>
    <div class="simgrid">
      <div><canvas id="qpsChart" height="200"></canvas></div>
      <div><div class="readout">
        <div class="ro"><b id="roP99">—</b><span>p99 latency overhead</span></div>
        <div class="ro"><b id="roQps">—</b><span>sustained QPS</span></div>
        <div class="ro"><b id="roCost" style="color:var(--good)">—</b><span>cost vs legacy</span></div>
        <div class="ro"><b id="roNodes">—</b><span>autoscaled replicas</span></div>
      </div>
      <div class="note" id="qpsNote">Slide up the traffic. With auto-tuning, the platform scales past <b>300K+ QPS at &lt;10ms p99</b>; turn it off to see latency blow up.</div></div>
    </div>`);
  let tune=true;
  const hist=Array(30).fill(8);
  const ch=chart(box.querySelector('#qpsChart'),{type:'line',
    data:{labels:hist.map((_,i)=>i),datasets:[{label:'p99 overhead (ms)',data:hist.slice(),
      borderColor:COL.green,backgroundColor:'rgba(82,168,112,.15)',fill:true,tension:.35,pointRadius:0}]},
    options:{animation:false,plugins:{legend:{display:false}},scales:{y:{min:0,suggestedMax:40,title:{display:true,text:'p99 ms'}},x:{display:false}}}});
  function update(){
    const q=+box.querySelector('#qps').value;
    box.querySelector('#qpsVal').textContent=q.toLocaleString();
    let p99, cost, nodes;
    if(tune){ p99 = 6 + (q/320000)*3.5; cost='-90%'; }
    else { p99 = 6 + Math.pow(q/60000,2.2)*6; cost='-10%'; }
    nodes = Math.max(2,Math.round(q/12000));
    hist.push(p99);hist.shift();
    ch.data.datasets[0].data=hist.slice();
    ch.data.datasets[0].borderColor = p99<10?COL.green:p99<25?COL.amber:COL.bad;
    ch.update('none');
    box.querySelector('#roP99').textContent=p99.toFixed(1)+' ms';
    box.querySelector('#roP99').style.color = p99<10?COL.good:p99<25?COL.amber:COL.bad;
    box.querySelector('#roQps').textContent=(q/1000).toFixed(0)+'K';
    box.querySelector('#roCost').textContent=cost;
    box.querySelector('#roNodes').textContent=nodes;
  }
  box.querySelector('#qps').oninput=update;
  box.querySelector('#autoTune').onclick=function(){tune=!tune;this.classList.toggle('on');
    box.querySelector('#qpsNote').innerHTML= tune?'Auto-tuning on — p99 stays flat as you scale.':'Auto-tuning <b>off</b> — watch p99 degrade under load.';update();};
  const iv=setInterval(update,650);onTeardown(()=>clearInterval(iv));update();
};

/* 5. Genie Code — NL → SQL playground -------------------------------- */
SIMS.geniecode = (root)=>{
  const presets={
    "Top 5 customers by revenue this quarter":
      {sql:`SELECT c.name, SUM(o.amount) AS revenue\nFROM orders o JOIN customers c USING (customer_id)\nWHERE o.quarter = current_quarter()\nGROUP BY c.name ORDER BY revenue DESC LIMIT 5;`,
       cols:['Customer','Revenue'],rows:[['Wanderbricks','$1.92M'],['Acme Co','$1.40M'],['Globex','$1.11M'],['Initech','$0.86M'],['Umbrella','$0.74M']],
       chart:[1.92,1.40,1.11,0.86,0.74]},
    "Why did model drift trigger an alert?":
      {sql:`-- Genie Code reads MLflow lineage + Inference Tables\nSELECT feature, psi_score\nFROM model_monitoring.drift\nWHERE endpoint='churn-v3' AND psi_score > 0.2\nORDER BY psi_score DESC;`,
       cols:['Feature','PSI'],rows:[['days_since_login','0.41'],['plan_tier','0.27'],['region','0.22']],
       chart:[0.41,0.27,0.22]},
    "Forecast next month's signups":
      {sql:`SELECT ai_forecast(\n  TABLE(daily_signups), horizon => 30\n) AS projected_signups;`,
       cols:['Week','Projected'],rows:[['W1','4,120'],['W2','4,460'],['W3','4,910'],['W4','5,300']],
       chart:[4.12,4.46,4.91,5.30]}};
  const keys=Object.keys(presets);
  const box = simShell(root,'Interactive simulation','Genie Code — describe it, get governed code + results',`
    <div class="controls">${keys.map((k,i)=>`<span class="chip ${i===0?'on':''}" data-q="${i}">${k}</span>`).join('')}</div>
    <div class="simgrid">
      <div><pre id="gcSql" style="background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:14px;font-size:12.5px;overflow:auto;color:var(--cyan);min-height:150px;white-space:pre-wrap"></pre>
        <div class="note">Grounded in Unity Catalog semantics + your team's patterns. Runs as a reviewable thread.</div></div>
      <div><canvas id="gcChart" height="160"></canvas>
        <div id="gcTable" style="margin-top:10px;font-size:12.5px"></div></div>
    </div>
    <div style="margin-top:12px;display:flex;gap:10px;align-items:center">
      <span style="font-size:12px;color:var(--ink3)">Threads:</span>
      <span class="chip">▣ build-features <span class="pill ga">done</span></span>
      <span class="chip">▣ train-churn-v3 <span class="pill pp">running</span></span>
      <span class="chip">⏱ nightly-metrics <span class="pill beta">scheduled</span></span>
    </div>`);
  let gch=null;
  function run(i){
    const p=presets[keys[i]];
    box.querySelector('#gcSql').textContent='✦ Genie Code\n\n'+p.sql;
    box.querySelector('#gcTable').innerHTML='<table style="width:100%;border-collapse:collapse">'+
      '<tr>'+p.cols.map(c=>`<th style="text-align:left;color:var(--ink3);border-bottom:1px solid var(--line);padding:5px">${c}</th>`).join('')+'</tr>'+
      p.rows.map(r=>'<tr>'+r.map(c=>`<td style="padding:5px;border-bottom:1px solid var(--line)">${c}</td>`).join('')+'</tr>').join('')+'</table>';
    if(gch)gch.destroy();
    gch=new Chart(box.querySelector('#gcChart'),{type:'bar',
      data:{labels:p.rows.map(r=>r[0]),datasets:[{data:p.chart,backgroundColor:COL.lava,borderRadius:5}]},
      options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
    onTeardown(()=>{if(gch)gch.destroy();});
  }
  box.querySelectorAll('.chip[data-q]').forEach(ch=>ch.onclick=()=>{
    box.querySelectorAll('.chip[data-q]').forEach(x=>x.classList.remove('on'));ch.classList.add('on');run(+ch.dataset.q);});
  run(0);
};

/* 6. Agentic CDP — Golden Context builder ---------------------------- */
SIMS.agenticcdp = (root)=>{
  const signals=[
    {k:'status',l:'⭐ Elite status',rec:false},
    {k:'delay',l:'⏱ Flight delayed 3h',rec:true},
    {k:'kids',l:'👨‍👩‍👧‍👦 Traveling w/ 3 kids',rec:true},
    {k:'failure',l:'⚠ Unresolved past complaint',rec:true},
    {k:'intent',l:'🔎 Browsing lounge upgrades',rec:true}];
  const box = simShell(root,'Interactive simulation','Golden Record → Golden Context — build the agent\'s view',`
    <div class="controls">${signals.map(s=>`<span class="chip ${s.k==='status'?'on':''}" data-s="${s.k}">${s.l}</span>`).join('')}</div>
    <div class="simgrid">
      <div class="card" style="box-shadow:none">
        <h3 style="margin-bottom:8px">Customer context</h3>
        <div id="cdpCtx" style="font-size:13px;color:var(--ink2)"></div>
      </div>
      <div class="card" style="box-shadow:none;border-color:var(--pink)">
        <h3 style="margin-bottom:8px">🔁 Infinity Campaign — next best action</h3>
        <div id="cdpAction" style="font-size:14px"></div>
        <div class="meter" style="margin-top:12px"><i id="cdpScore" style="width:20%"></i></div>
        <div class="note">Personalization richness — toggling from a static Golden Record to live Golden Context.</div>
      </div>
    </div>`);
  const on={status:true,delay:false,kids:false,failure:false,intent:false};
  box.querySelectorAll('.chip[data-s]').forEach(c=>c.onclick=()=>{on[c.dataset.s]=!on[c.dataset.s];c.classList.toggle('on');render();});
  function render(){
    const active=signals.filter(s=>on[s.k]);
    box.querySelector('#cdpCtx').innerHTML = active.map(s=>`• ${s.l}`).join('<br>')||'<i>No signals — just a name and demographics (the old Golden Record).</i>';
    const richness=Math.min(100, 20 + active.filter(s=>s.rec).length*20 + (on.status?0:0));
    box.querySelector('#cdpScore').style.width=richness+'%';
    let action;
    if(on.delay&&on.kids&&on.failure) action='Proactively offer <b>family lounge access + rebooking on the next flight</b>, with a personal apology crediting the prior complaint. Sent in milliseconds, before the customer asks.';
    else if(on.delay&&on.failure) action='Offer <b>lounge access + service-recovery credit</b>, acknowledging the unresolved issue.';
    else if(on.delay) action='Notify of the delay and offer <b>rebooking options</b> in real time.';
    else if(on.intent) action='Surface a <b>contextual lounge upgrade</b> matched to current browsing intent.';
    else action='Standard tier message — a generic CDP only knows elite status, so personalization stays shallow.';
    box.querySelector('#cdpAction').innerHTML=action;
  }
  render();
};

/* 7. Lakeflow — pipeline builder ------------------------------------- */
SIMS.lakeflow = (root)=>{
  const box = simShell(root,'Interactive simulation','Build a pipeline — pick a connector, tune Zerobus, watch ZeroOps',`
    <div class="controls">
      <div class="ctl"><label>Source connector</label>
        <select id="lfSrc" style="background:var(--bg2);color:var(--ink);border:1px solid var(--line2);border-radius:8px;padding:8px">
          <option>Salesforce</option><option>SAP</option><option>Jira</option><option>GitHub</option><option>Kafka / Zerobus</option><option>SharePoint</option></select></div>
      <div class="ctl"><label>Mode: <b id="lfModeL" style="color:var(--ink)">Batch</b></label>
        <input type="range" id="lfMode" min="0" max="2" step="1" value="0" style="width:160px"></div>
      <button class="btn" id="lfFail">💥 Inject failure</button>
    </div>
    <canvas id="lfCanvas" class="flowcanvas" height="160"></canvas>
    <div class="readout" style="margin-top:12px">
      <div class="ro"><b id="lfLat">~hours</b><span>end-to-end latency</span></div>
      <div class="ro"><b id="lfThru">batch</b><span>throughput</span></div>
      <div class="ro"><b>100+</b><span>connectors available</span></div>
      <div class="ro"><b id="lfOps" style="color:var(--good)">healthy</b><span>Genie ZeroOps</span></div>
    </div>
    <div class="note" id="lfNote">Spark Declarative Pipelines run batch → near-real-time → real-time (5ms) with zero translation loss.</div>`);
  const cv=box.querySelector('#lfCanvas'),ctx=cv.getContext('2d');
  const modes=['Batch','Near real-time','Real-time'];
  let failing=false, failT=0;
  box.querySelector('#lfMode').oninput=function(){
    const m=+this.value; box.querySelector('#lfModeL').textContent=modes[m];
    box.querySelector('#lfLat').textContent=['~hours','<5 s','5 ms'][m];
    box.querySelector('#lfThru').textContent=['batch','100 MB/s','10 GB/s'][m];
  };
  box.querySelector('#lfFail').onclick=()=>{failing=true;failT=performance.now();
    box.querySelector('#lfOps').textContent='detecting…';box.querySelector('#lfOps').style.color=COL.bad;
    box.querySelector('#lfNote').innerHTML='⚠ Failure injected — Genie ZeroOps is root-causing from quality metrics, logs & lineage…';
    setTimeout(()=>{box.querySelector('#lfOps').textContent='auto-fixed';box.querySelector('#lfOps').style.color=COL.good;
      box.querySelector('#lfNote').innerHTML='✅ ZeroOps proposed a fix, validated it in a sandbox, and recovered — with human-in-the-loop approval.';failing=false;},2200);
    toast('Genie ZeroOps root-causing the failure…');};
  const stages=[{l:'Source',c:COL.cyan},{l:'Ingest',c:COL.blue},{l:'Transform',c:COL.green},{l:'Serve',c:COL.amber}];
  let raf;
  function draw(){const W=cv.clientWidth,H=160;ctx.clearRect(0,0,W,H);const y=H/2;
    const gap=W/(stages.length); const now=performance.now();
    for(let i=0;i<stages.length-1;i++){const x1=gap*(i+0.5),x2=gap*(i+1.5);
      ctx.strokeStyle=failing&&i===1?COL.bad:'rgba(107,126,156,.5)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(x1+38,y);ctx.lineTo(x2-38,y);ctx.stroke();
      const ph=((now/900)+i*0.3)%1; if(!failing){ctx.fillStyle=stages[i].c;ctx.beginPath();
        ctx.arc(lerp(x1+38,x2-38,ph),y,4,0,7);ctx.fill();}}
    stages.forEach((s,i)=>{const x=gap*(i+0.5);ctx.fillStyle=s.c;roundRect(ctx,x-38,y-22,76,44,9);ctx.fill();
      ctx.fillStyle=canvasTextColor(s.c);ctx.font='600 12px Inter';ctx.textAlign='center';canvasLabel(ctx,s.l,x,y+4,66);});
    raf=requestAnimationFrame(draw);}
  function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=160*devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
  window.addEventListener('resize',resize);onTeardown(()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);});resize();draw();
};

/* 8. LTAP — OLTP+OLAP unification ------------------------------------ */
SIMS.ltap = (root)=>{
  const box = simShell(root,'Interactive simulation','Collapse the stack — legacy OLTP+ETL+OLAP vs LTAP',`
    <div class="controls">
      <div class="seg" id="ltMode"><button data-m="legacy">Legacy (separate systems)</button><button data-m="ltap" class="on">LTAP (one copy)</button></div>
      <button class="btn ghost" id="ltBranch">🌿 Branch & snapshot</button>
    </div>
    <canvas id="ltCanvas" class="flowcanvas" height="220"></canvas>
    <div class="readout" style="margin-top:12px">
      <div class="ro"><b id="ltCopies">3</b><span>copies of data</span></div>
      <div class="ro"><b id="ltEtl">2</b><span>ETL pipelines</span></div>
      <div class="ro"><b id="ltFresh">hours</b><span>analytics freshness</span></div>
      <div class="ro"><b id="ltGov">3 systems</b><span>governance</span></div>
    </div>
    <div class="note" id="ltNote">Legacy duplicates data across OLTP, ETL and OLAP. LTAP keeps one governed copy — operational data is instantly queryable.</div>`);
  const cv=box.querySelector('#ltCanvas'),ctx=cv.getContext('2d');
  let mode='ltap', branch=false;
  box.querySelectorAll('#ltMode button').forEach(b=>b.onclick=()=>{
    box.querySelectorAll('#ltMode button').forEach(x=>x.classList.remove('on'));b.classList.add('on');mode=b.dataset.m;upd();draw();});
  box.querySelector('#ltBranch').onclick=()=>{branch=!branch;draw();toast(branch?'Git-style branch created against production':'Branch merged');};
  function upd(){const L=mode==='legacy';
    box.querySelector('#ltCopies').textContent=L?'3':'1';
    box.querySelector('#ltEtl').textContent=L?'2':'0';
    box.querySelector('#ltFresh').textContent=L?'hours':'instant';
    box.querySelector('#ltGov').textContent=L?'3 systems':'Unity Catalog';
    box.querySelector('#ltNote').innerHTML = L?'Legacy: every workload needs its own copy and ETL hop — stale analytics, fractured governance.':'LTAP: Lakebase (Postgres) + Lakehouse on <b>one governed copy</b> — ACID transactions and analytics, independently scaled.';}
  function draw(){const W=cv.clientWidth,H=220;ctx.clearRect(0,0,W,H);ctx.textAlign='center';ctx.font='600 12px Inter';
    if(mode==='legacy'){
      const boxes=[{l:'OLTP DB',x:.15,c:COL.blue},{l:'ETL',x:.4,c:COL.ink3},{l:'Warehouse',x:.65,c:COL.amber},{l:'AI copy',x:.88,c:COL.green}];
      boxes.forEach((b,i)=>{const x=b.x*W;ctx.fillStyle=b.c;roundRect(ctx,x-44,H/2-26,88,52,10);ctx.fill();
        ctx.fillStyle=canvasTextColor(b.c);canvasLabel(ctx,b.l,x,H/2+4,78);
        if(i<boxes.length-1){const nx=boxes[i+1].x*W;ctx.strokeStyle='rgba(255,84,112,.6)';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(x+44,H/2);ctx.lineTo(nx-44,H/2);ctx.stroke();}});
      ctx.fillStyle=COL.bad;canvasLabel(ctx,'copy → copy → copy',W/2,H-14,W-20);
    } else {
      // one storage with two engines
      const cx=W/2;ctx.fillStyle=COL.pink;roundRect(ctx,cx-90,H-58,180,40,10);ctx.fill();
      ctx.fillStyle=canvasTextColor(COL.pink);canvasLabel(ctx,'One copy · Delta/Iceberg · Unity Catalog',cx,H-32,164);
      const oltp={x:cx-110,y:60},olap={x:cx+110,y:60};
      [['Lakebase (OLTP)',oltp,COL.blue],['Lakehouse (OLAP)',olap,COL.amber]].forEach(([l,p,c])=>{
        ctx.fillStyle=c;roundRect(ctx,p.x-70,p.y-22,140,44,10);ctx.fill();ctx.fillStyle=canvasTextColor(c);canvasLabel(ctx,l,p.x,p.y+4,126);
        ctx.strokeStyle='rgba(82,168,112,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y+22);ctx.lineTo(cx,H-58);ctx.stroke();});
      if(branch){ctx.fillStyle=COL.green;roundRect(ctx,cx+150,H-58,70,40,10);ctx.fill();
        ctx.fillStyle=canvasTextColor(COL.green);canvasLabel(ctx,'branch',cx+185,H-32,58);
        ctx.strokeStyle=COL.green;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(cx+90,H-38);ctx.lineTo(cx+150,H-38);ctx.stroke();ctx.setLineDash([]);}
    }}
  function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=220*devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);draw();}
  window.addEventListener('resize',resize);onTeardown(()=>window.removeEventListener('resize',resize));upd();resize();
};

/* 8b. Lakehouse — silos vs unified architecture (animated) ----------- */
SIMS.lakehouse = (root)=>{
  const box = simShell(root,'Animated illustration','From silos to lakehouse — one open copy for every workload',`
    <div class="controls">
      <div class="seg" id="lhMode"><button data-m="legacy">Legacy silos</button><button data-m="lake" class="on">Lakehouse</button></div>
      <span style="font-size:12px;color:var(--ink3)">Workloads:</span>
      <span class="chip on" data-w="bi">📊 SQL / BI</span><span class="chip on" data-w="eng">🛠 Engineering</span>
      <span class="chip on" data-w="stream">⚡ Streaming</span><span class="chip on" data-w="ml">🤖 AI / ML</span>
      <div class="seg" id="lhCloud" style="margin-left:auto"><button data-c="AWS" class="on">AWS</button><button data-c="Azure">Azure</button><button data-c="GCP">GCP</button></div>
    </div>
    <canvas id="lhCanvas" class="flowcanvas" height="280"></canvas>
    <div class="note" id="lhNote"></div>`);
  const cv=box.querySelector('#lhCanvas'),ctx=cv.getContext('2d');
  let mode='lake', cloud='AWS';
  const wl={bi:true,eng:true,stream:true,ml:true};
  const WORK=[{k:'bi',l:'SQL / BI'},{k:'eng',l:'Engineering'},{k:'stream',l:'Streaming'},{k:'ml',l:'AI / ML'}];
  box.querySelectorAll('#lhMode button').forEach(b=>b.onclick=()=>{box.querySelectorAll('#lhMode button').forEach(x=>x.classList.remove('on'));b.classList.add('on');mode=b.dataset.m;note();});
  box.querySelectorAll('#lhCloud button').forEach(b=>b.onclick=()=>{box.querySelectorAll('#lhCloud button').forEach(x=>x.classList.remove('on'));b.classList.add('on');cloud=b.dataset.c;note();});
  box.querySelectorAll('.chip[data-w]').forEach(c=>c.onclick=()=>{wl[c.dataset.w]=!wl[c.dataset.w];c.classList.toggle('on');});
  function note(){box.querySelector('#lhNote').innerHTML = mode==='legacy'
    ? 'Legacy: a <b>data lake</b> (scalable, ungoverned) and a <b>warehouse</b> (governed, rigid), kept in sync by brittle ETL — workloads stranded on different copies.'
    : 'Lakehouse: <b>one open, governed copy</b> on Delta Lake & Spark feeds every workload directly — governed by Unity Catalog, running on '+cloud+'. No copies, no silos.';}
  let raf,t0=performance.now();
  function draw(){
    const W=cv.clientWidth,H=280;ctx.clearRect(0,0,W,H);const now=(performance.now()-t0)/1000;
    ctx.textAlign='center';ctx.font='600 11px Inter';
    if(mode==='lake'){
      const cx=W*0.42, cy=H/2, srcX=66;
      ['Raw files','Streams','Tables'].forEach((s,i)=>{const sy=70+i*70;
        ctx.fillStyle='#2a3852';roundRect(ctx,srcX-46,sy-15,92,30,8);ctx.fill();
        ctx.fillStyle=canvasTextColor('#2a3852');ctx.font='600 11px Inter';canvasLabel(ctx,s,srcX,sy+4,82);
        ctx.strokeStyle='rgba(255,54,33,.3)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(srcX+46,sy);ctx.lineTo(cx-58,cy);ctx.stroke();
        for(let p=0;p<3;p++){const t=(now*0.5+i*0.2+p/3)%1;ctx.fillStyle=COL.lava2;ctx.beginPath();ctx.arc(lerp(srcX+46,cx-58,t),lerp(sy,cy,t),3,0,7);ctx.fill();}});
      ctx.strokeStyle='rgba(255,171,0,.5)';ctx.setLineDash([5,5]);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,74,0,7);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=COL.amber;ctx.font='10px Inter';canvasLabel(ctx,'Unity Catalog governance',cx,cy-82,170);
      ctx.fillStyle=COL.pink;roundRect(ctx,cx-58,cy-34,116,68,14);ctx.fill();
      ctx.fillStyle=canvasTextColor(COL.pink);ctx.font='700 14px Space Grotesk';canvasLabel(ctx,'Lakehouse',cx,cy-3,104);
      ctx.font='10px Inter';canvasLabel(ctx,'Delta Lake · Spark',cx,cy+14,104);
      const wx=W-78;
      WORK.forEach((w,i)=>{const wy=46+i*((H-92)/3),on=wl[w.k];
        ctx.strokeStyle=on?'rgba(82,168,112,.6)':'rgba(107,126,156,.18)';ctx.lineWidth=on?2:1;
        ctx.beginPath();ctx.moveTo(cx+58,cy);ctx.lineTo(wx-52,wy);ctx.stroke();
        if(on)for(let p=0;p<3;p++){const t=(now*0.6+i*0.15+p/3)%1;ctx.fillStyle=COL.green;ctx.beginPath();ctx.arc(lerp(cx+58,wx-52,t),lerp(cy,wy,t),3,0,7);ctx.fill();}
        const workFill=on?'#16243a':'#1b2436';ctx.fillStyle=workFill;roundRect(ctx,wx-52,wy-16,104,32,8);ctx.fill();
        ctx.strokeStyle=on?COL.green:'#2a3852';ctx.lineWidth=1.5;roundRect(ctx,wx-52,wy-16,104,32,8);ctx.stroke();
        ctx.fillStyle=canvasTextColor(workFill);ctx.font='600 11px Inter';canvasLabel(ctx,w.l,wx,wy+4,92);});
      ctx.fillStyle=cssv('--ink3');ctx.font='10px Inter';ctx.textAlign='right';canvasLabel(ctx,'runs on '+cloud,W-8,H-8,100);ctx.textAlign='center';
    } else {
      const lakeY=H*0.3, whY=H*0.72, leftX=110;
      ctx.fillStyle=COL.blue;roundRect(ctx,leftX-66,lakeY-26,132,52,12);ctx.fill();
      ctx.fillStyle=canvasTextColor(COL.blue);ctx.font='700 13px Space Grotesk';canvasLabel(ctx,'Data Lake',leftX,lakeY-2,116);ctx.font='9px Inter';canvasLabel(ctx,'scalable · ungoverned',leftX,lakeY+13,116);
      ctx.fillStyle=COL.amber;roundRect(ctx,leftX-66,whY-26,132,52,12);ctx.fill();
      ctx.fillStyle=canvasTextColor(COL.amber);ctx.font='700 13px Space Grotesk';canvasLabel(ctx,'Warehouse',leftX,whY-2,116);ctx.font='9px Inter';canvasLabel(ctx,'governed · rigid',leftX,whY+13,116);
      ctx.strokeStyle=COL.bad;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(leftX,lakeY+26);ctx.lineTo(leftX,whY-26);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=COL.bad;ctx.font='10px Inter';canvasLabel(ctx,'ETL copy',leftX+44,(lakeY+whY)/2+3,58);
      const wx=W-86;
      WORK.forEach((w,i)=>{const wy=46+i*((H-92)/3),on=wl[w.k],fromWh=(w.k==='bi'||w.k==='eng'),sx=leftX+66,sy=fromWh?whY:lakeY;
        ctx.strokeStyle=on?(fromWh?'rgba(255,171,0,.55)':'rgba(35,117,168,.6)'):'rgba(107,126,156,.18)';ctx.lineWidth=on?2:1;
        ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(wx-52,wy);ctx.stroke();
        if(on)for(let p=0;p<2;p++){const t=(now*0.5+i*0.2+p/2)%1;ctx.fillStyle=fromWh?COL.amber:COL.blue;ctx.beginPath();ctx.arc(lerp(sx,wx-52,t),lerp(sy,wy,t),2.5,0,7);ctx.fill();}
        const workFill='#1b2436';ctx.fillStyle=workFill;roundRect(ctx,wx-52,wy-15,104,30,8);ctx.fill();
        ctx.fillStyle=canvasTextColor(workFill);ctx.font='600 11px Inter';canvasLabel(ctx,w.l,wx,wy+4,92);});
      ctx.fillStyle=COL.bad;ctx.font='10px Inter';canvasLabel(ctx,'two copies · stranded workloads · brittle pipelines',W*0.52,H-8,W-20);
    }
    raf=requestAnimationFrame(draw);
  }
  function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=280*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
  window.addEventListener('resize',resize);onTeardown(()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);});
  resize();note();draw();
};

/* 9. Agent Bricks — 1% loop / 99% debt ------------------------------- */
SIMS.agentbricks = (root)=>{
  const layers=[['Tokens & capacity',COL.cyan],['Deployment',COL.blue],['Security & governance',COL.green],
    ['Evaluation',COL.amber],['Monitoring',COL.gold],['Context & memory',COL.pink],['Sharing',COL.lava2]];
  const box = simShell(root,'Interactive simulation','The agent loop is 1% — assemble the 99% to ship reliably',`
    <div class="controls">${layers.map((l,i)=>`<span class="chip" data-d="${i}">${l[0]}</span>`).join('')}
      <button class="btn ghost" id="abAll">Enable all</button></div>
    <div class="simgrid">
      <div><canvas id="abChart" height="220"></canvas></div>
      <div>
        <div class="readout">
          <div class="ro"><b id="abRel">10%</b><span>production-ready</span></div>
          <div class="ro"><b id="abModel">6</b><span>model families</span></div>
        </div>
        <div class="meter" style="margin-top:14px"><i id="abMeter" style="width:10%"></i></div>
        <div class="note" id="abNote">Just the core loop gets you a demo. Agent Bricks provides the other 99% — choice, context and control — so 100,000+ agents run in production.</div>
        <div class="logogrid" style="margin-top:12px">${['OpenAI','Anthropic','Gemini','Qwen','Kimi','Grok (SpaceX)'].map(m=>`<span class="logo">${m}</span>`).join('')}</div>
      </div>
    </div>`);
  const on=layers.map(()=>false);
  const ch=chart(box.querySelector('#abChart'),{type:'doughnut',
    data:{labels:['Core loop (1%)',...layers.map(l=>l[0])],
      datasets:[{data:[1,...layers.map(()=>14)],
        backgroundColor:['#33405c',...layers.map((l,i)=>on[i]?l[1]:'#1b2436')],borderColor:cssv('--bg'),borderWidth:2}]},
    options:{cutout:'58%',plugins:{legend:{display:false}}}});
  function upd(){
    ch.data.datasets[0].backgroundColor=['#33405c',...layers.map((l,i)=>on[i]?l[1]:'#1b2436')];ch.update();
    const rel=10+on.filter(Boolean).length*Math.round(90/layers.length);
    box.querySelector('#abRel').textContent=Math.min(100,rel)+'%';
    box.querySelector('#abMeter').style.width=Math.min(100,rel)+'%';
    if(on.every(Boolean)) box.querySelector('#abNote').innerHTML='✅ Full platform — choice, context & control. This is how <b>1+ quadrillion tokens/yr</b> of agents run governed in the lakehouse.';
  }
  box.querySelectorAll('.chip[data-d]').forEach(c=>c.onclick=()=>{const i=+c.dataset.d;on[i]=!on[i];c.classList.toggle('on');upd();});
  box.querySelector('#abAll').onclick=()=>{on.fill(true);box.querySelectorAll('.chip[data-d]').forEach(c=>c.classList.add('on'));upd();toast('Full agent platform enabled');};
  upd();
};

/* 9b. Genie Ontology — teach the ontology, agents converge ----------- */
SIMS.geniontology = (root)=>{
  const concepts=[
    {k:'fiscal',l:'📅 Fiscal calendar'},
    {k:'metric',l:'📐 Metric definitions'},
    {k:'org',l:'🏢 Org hierarchy'},
    {k:'synonym',l:'🔤 Synonyms & acronyms'},
    {k:'history',l:'🕓 Decision history'}];
  const box=simShell(root,'Interactive simulation','Teach the ontology — watch two agents converge on one answer',`
    <div class="controls">${concepts.map(c=>`<span class="chip" data-c="${c.k}">${c.l}</span>`).join('')}
      <button class="btn ghost" id="goAll">Teach everything</button></div>
    <div class="simgrid">
      <div><canvas id="goCanvas" class="flowcanvas" height="240"></canvas>
        <div class="note">Both agents are asked the same thing: <b>"What was revenue in Q3 for EMEA?"</b></div></div>
      <div>
        <div class="card" style="box-shadow:none;margin-bottom:10px;border-color:var(--line)"><h3 style="margin-bottom:6px;font-size:14px">🤖 Agent A</h3><div id="goA" style="font-size:13px;color:var(--ink2)"></div></div>
        <div class="card" style="box-shadow:none;border-color:var(--line)"><h3 style="margin-bottom:6px;font-size:14px">🤖 Agent B</h3><div id="goB" style="font-size:13px;color:var(--ink2)"></div></div>
        <div style="margin-top:12px"><div style="font-size:12px;color:var(--ink3);margin-bottom:5px">Answer consistency <b id="goPct" style="color:var(--ink);float:right">25%</b></div><div class="meter"><i id="goMeter" style="width:25%"></i></div>
        <div class="note" id="goNote" style="margin-top:8px">Without shared meaning, two agents read the same question differently. Teach the ontology and watch them agree.</div></div>
      </div>
    </div>`);
  const on={fiscal:false,metric:false,org:false,synonym:false,history:false};
  const cv=box.querySelector('#goCanvas'),ctx=cv.getContext('2d');
  box.querySelectorAll('.chip[data-c]').forEach(c=>c.onclick=()=>{on[c.dataset.c]=!on[c.dataset.c];c.classList.toggle('on');render();});
  box.querySelector('#goAll').onclick=()=>{Object.keys(on).forEach(k=>on[k]=true);
    box.querySelectorAll('.chip[data-c]').forEach(c=>c.classList.add('on'));render();toast('Ontology fully taught — agents aligned');};
  function answer(isA){
    const period = on.fiscal?'fiscal Q3':(isA?'calendar Q3':'fiscal Q3');
    const metric = on.metric?'net revenue':(isA?'gross revenue':'net revenue');
    const scope  = on.org?'EMEA':(isA?'all regions':'EMEA');
    let v=3.60; if(isA){ if(!on.fiscal)v+=0.30; if(!on.metric)v+=0.55; if(!on.org)v+=1.45; }
    return {v:v.toFixed(2),period,metric,scope};
  }
  function render(){
    const A=answer(true),B=answer(false);
    const fmt=x=>`<b style="color:var(--ink);font-size:17px">$${x.v}M</b><br><span style="color:var(--ink3);font-size:12px">${x.period} · ${x.metric} · ${x.scope}</span>`;
    box.querySelector('#goA').innerHTML=fmt(A); box.querySelector('#goB').innerHTML=fmt(B);
    const aligned=[on.fiscal,on.metric,on.org].filter(Boolean).length;
    const pct=[25,55,80,100][aligned];
    box.querySelector('#goPct').textContent=pct+'%'; box.querySelector('#goMeter').style.width=pct+'%';
    if(pct===100) box.querySelector('#goNote').innerHTML='✅ Fully grounded — both agents return the <b>same number</b> from one shared source of meaning. Add synonyms & decision history and the ontology resolves jargon and past adjustments automatically.';
    else box.querySelector('#goNote').innerHTML='Agents disagree on period, metric, or scope. Teach the ontology those concepts to align them.';
  }
  let raf,t0=performance.now();
  function draw(){const W=cv.clientWidth,H=240;ctx.clearRect(0,0,W,H);const now=performance.now();
    const cx=W*0.46, cy=H/2, lx=64;
    concepts.forEach((c,i)=>{const y=26+i*((H-52)/(concepts.length-1));const act=on[c.k];
      ctx.strokeStyle=act?'rgba(200,153,48,.7)':'rgba(107,126,156,.22)';ctx.lineWidth=act?2:1;
      ctx.beginPath();ctx.moveTo(lx+8,y);ctx.lineTo(cx-42,cy);ctx.stroke();
      if(act){const ph=((now-t0)/1200+i*0.2)%1;ctx.fillStyle=COL.gold;ctx.beginPath();
        ctx.arc(lerp(lx+8,cx-42,ph),lerp(y,cy,ph),3.5,0,7);ctx.fill();}
      ctx.fillStyle=act?COL.gold:'#2a3852';ctx.beginPath();ctx.arc(lx,y,6,0,7);ctx.fill();
      ctx.fillStyle=act?cssv('--ink2'):cssv('--ink3');ctx.font='10px Inter';ctx.textAlign='left';
      canvasLabel(ctx,c.l,lx+12,y+3,Math.max(34,cx-lx-62));});
    ctx.fillStyle=COL.gold;roundRect(ctx,cx-42,cy-22,84,44,10);ctx.fill();
    ctx.fillStyle=canvasTextColor(COL.gold);ctx.font='600 11px Inter';ctx.textAlign='center';
    canvasLabel(ctx,'Genie',cx,cy-2,72);canvasLabel(ctx,'Ontology',cx,cy+12,72);
    const ax=W-64, anyOn=Object.values(on).some(Boolean),
      aligned=[on.fiscal,on.metric,on.org].filter(Boolean).length===3;
    [['A',cy-58],['B',cy+58]].forEach(([l,y],idx)=>{
      ctx.strokeStyle=anyOn?'rgba(200,153,48,.7)':'rgba(107,126,156,.4)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(cx+42,cy);ctx.lineTo(ax-26,y);ctx.stroke();
      if(anyOn){const ph=((now-t0)/1000+idx*0.5)%1;ctx.fillStyle=COL.gold;ctx.beginPath();
        ctx.arc(lerp(cx+42,ax-26,ph),lerp(cy,y,ph),3.5,0,7);ctx.fill();}
      ctx.fillStyle=aligned?COL.green:COL.blue;ctx.beginPath();ctx.arc(ax,y,17,0,7);ctx.fill();
      const agentFill=aligned?COL.green:COL.blue;ctx.fillStyle=canvasTextColor(agentFill);ctx.font='600 13px Inter';ctx.textAlign='center';canvasLabel(ctx,l,ax,y+5,26);});
    raf=requestAnimationFrame(draw);}
  function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=240*devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
  window.addEventListener('resize',resize);onTeardown(()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);});
  resize();render();draw();
};

/* 10. AI/BI — theme designer ----------------------------------------- */
SIMS.aibi = (root)=>{
  const palettes={
    'Wanderbricks':['#15AFDD','#2375A8','#52A870','#C85070','#C89930'],
    'Lava':['#FF3621','#FF6A52','#FFAB00','#C89930','#7A1B10'],
    'Ocean':['#0EA5E9','#2563EB','#14B8A6','#6366F1','#0891B2']};
  const box = simShell(root,'Interactive simulation','Dashboard theme designer — 60-30-10, grid & colorblind test',`
    <div class="controls">
      <div class="ctl"><label>Palette</label><div class="seg" id="abiPal">${Object.keys(palettes).map((p,i)=>`<button data-p="${p}" class="${i===0?'on':''}">${p}</button>`).join('')}</div></div>
      <div class="ctl"><label>Grid columns</label><div class="seg" id="abiGrid"><button data-g="3">3</button><button data-g="4" class="on">4</button><button data-g="6">6</button></div></div>
      <div class="ctl"><label>Mode</label><div class="seg" id="abiDark"><button data-d="light" class="on">Light</button><button data-d="dark">Dark</button></div></div>
      <div class="ctl"><label>Colorblind sim</label><div class="seg" id="abiCb"><button data-c="none" class="on">None</button><button data-c="deut">Deuter</button><button data-c="prot">Protan</button><button data-c="trit">Tritan</button></div></div>
    </div>
    <div id="abiPreview" style="border-radius:12px;padding:16px;transition:.3s"></div>
    <div class="note">The 60-30-10 rule: 60% dominant background, 30% secondary, 10% accent for interactive elements. Palettes are tested for colorblind accessibility.</div>`);
  let pal='Wanderbricks',grid=4,dark=false,cb='none';
  function cbShift(hex){ // crude colorblindness approximation
    let n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;
    if(cb==='deut'){g=Math.round(g*0.6+r*0.4);}
    else if(cb==='prot'){r=Math.round(r*0.55+g*0.45);}
    else if(cb==='trit'){b=Math.round(b*0.6+g*0.4);}
    return `rgb(${r},${g},${b})`; }
  function render(){
    const cols=palettes[pal]; const bg=dark?'#0e1b29':'#EBEBEB',wbg=dark?'#1F354B':'#FCFCFD',
      txt=dark?'#EBEBEB':'#08141A';
    const widgets=Array.from({length:grid*2}).map((_,i)=>{
      const c=cbShift(cols[i%cols.length]); const h=20+Math.abs(Math.sin(i*1.3))*60;
      return `<div style="background:${wbg};border:1px solid rgba(127,127,127,.18);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:6px">
        <div style="font-size:10px;color:${txt};opacity:.7">Widget ${i+1}</div>
        <div style="display:flex;align-items:end;gap:3px;height:60px">${Array.from({length:6}).map((_,j)=>`<div style="flex:1;background:${c};height:${20+Math.abs(Math.sin(i+j))*70}%;border-radius:2px"></div>`).join('')}</div></div>`;
    }).join('');
    box.querySelector('#abiPreview').innerHTML=`
      <div style="background:${bg};border-radius:10px;padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-family:'Space Grotesk';font-weight:700;color:${txt}">Wanderbricks · Travel Analytics</div>
          <div style="background:${cbShift(cols[0])};color:#fff;font-size:11px;padding:5px 12px;border-radius:7px">Filter ▾</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(${grid},1fr);gap:10px">${widgets}</div>
      </div>`;
  }
  box.querySelector('#abiPal').onclick=e=>{if(e.target.dataset.p){pal=e.target.dataset.p;seg('#abiPal',e.target);render();}};
  box.querySelector('#abiGrid').onclick=e=>{if(e.target.dataset.g){grid=+e.target.dataset.g;seg('#abiGrid',e.target);render();}};
  box.querySelector('#abiDark').onclick=e=>{if(e.target.dataset.d){dark=e.target.dataset.d==='dark';seg('#abiDark',e.target);render();}};
  box.querySelector('#abiCb').onclick=e=>{if(e.target.dataset.c){cb=e.target.dataset.c;seg('#abiCb',e.target);render();}};
  function seg(sel,el){box.querySelector(sel).querySelectorAll('button').forEach(b=>b.classList.remove('on'));el.classList.add('on');}
  render();
};

/* 11. SecureConnect — scale recipients ------------------------------- */
SIMS.secureconnect = (root)=>{
  const box=simShell(root,'Interactive simulation','Scale recipients — your config count stays at one',`
    <div class="controls">
      <div class="ctl"><label>Recipients: <b id="scN" style="color:var(--ink)">3</b></label>
        <input type="range" id="scR" min="1" max="50" value="3"></div>
      <label class="chip on" id="scP">🔐 SecureConnect proxy</label>
    </div>
    <div class="readout">
      <div class="ro"><b id="scCfg" style="color:var(--good)">1</b><span>configs you maintain</span></div>
      <div class="ro"><b id="scWo">3</b><span>without SecureConnect</span></div>
      <div class="ro"><b id="scTime">—</b><span>coordination effort</span></div>
      <div class="ro"><b>mTLS</b><span>+ optional NCC private link</span></div>
    </div>
    <canvas id="scCanvas" class="flowcanvas" height="180" style="margin-top:14px"></canvas>
    <div class="note" id="scNote"></div>`);
  let proxy=true,n=3; const cv=box.querySelector('#scCanvas'),ctx=cv.getContext('2d');
  box.querySelector('#scR').oninput=function(){n=+this.value;box.querySelector('#scN').textContent=n;upd();};
  box.querySelector('#scP').onclick=function(){proxy=!proxy;this.classList.toggle('on');upd();
    toast(proxy?'One config for everyone':'Back to per-recipient allowlists');};
  function upd(){
    box.querySelector('#scCfg').textContent=proxy?'1':n;
    box.querySelector('#scCfg').style.color=proxy?COL.good:COL.bad;
    box.querySelector('#scWo').textContent=n;
    box.querySelector('#scTime').textContent=proxy?'minutes':(n<=5?'hours':n<=20?'days':'weeks');
    box.querySelector('#scNote').innerHTML=proxy
      ?'A Databricks-managed proxy routes every recipient through one governed door — serverless recipients need <b>zero</b> config.'
      :`Each of ${n} recipients needs IP allowlists exchanged by hand — error-prone, and it doesn't scale.`;
    draw();
  }
  function draw(){const W=cv.clientWidth,H=180;ctx.clearRect(0,0,W,H);const px=58,py=H/2;
    ctx.fillStyle=COL.cyan;roundRect(ctx,px-44,py-19,88,38,9);ctx.fill();
    ctx.fillStyle=canvasTextColor(COL.cyan);ctx.font='600 11px Inter';ctx.textAlign='center';canvasLabel(ctx,'Provider',px,py+4,78);
    const proxyX=W*0.46;
    if(proxy){ctx.fillStyle=COL.cyan;roundRect(ctx,proxyX-28,py-17,56,34,9);ctx.fill();
      ctx.fillStyle=canvasTextColor(COL.cyan);canvasLabel(ctx,'proxy',proxyX,py+4,48);
      ctx.strokeStyle='rgba(21,175,221,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+44,py);ctx.lineTo(proxyX-28,py);ctx.stroke();}
    const rx=W-46,show=Math.min(n,12);
    for(let i=0;i<show;i++){const ry=16+i*((H-32)/(show-1||1)),sx=proxy?proxyX+28:px+44;
      ctx.strokeStyle=proxy?'rgba(21,175,221,.45)':'rgba(255,84,112,.5)';ctx.lineWidth=1;
      if(!proxy)ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(sx,py);ctx.lineTo(rx-6,ry);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=proxy?COL.green:COL.bad;ctx.beginPath();ctx.arc(rx,ry,4,0,7);ctx.fill();}
    if(n>show){ctx.fillStyle=cssv('--ink3');ctx.font='10px Inter';ctx.textAlign='right';canvasLabel(ctx,'+'+(n-show)+' more',rx,H-3,64);}
  }
  function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=180*devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);upd();}
  window.addEventListener('resize',resize);onTeardown(()=>window.removeEventListener('resize',resize));resize();
};

/* 12. Marketplace — install flow ------------------------------------- */
SIMS.marketplace = (root)=>{
  const steps=[
    {t:'Browse',body:'Filter the Marketplace by the <b>Apps</b> category and pick a partner app — say, a fraud-analytics app from a launch partner.',cta:'Install ›'},
    {t:'Install',body:'Review the permissions the app declares, and authorize its resource bindings.<br><br><div id="mkPerms"></div>',cta:'Launch ›'},
    {t:'Launch',body:'The app deploys to <b>secure serverless compute</b> in your own account and gets a dedicated URL.<div class="meter" style="margin-top:16px"><i id="mkProg" style="width:0%"></i></div>',cta:'Open app ›'},
    {t:'Use',body:'✅ Running natively on <b>your</b> Unity Catalog data — zero data movement, sandboxed per app, egress governed.'}];
  const box=simShell(root,'Interactive simulation','Install a Marketplace app — four governed steps',`
    <div class="stepper" id="mkStep">${steps.map(s=>`<div class="step">${s.t}</div>`).join('')}</div>
    <div class="card" style="box-shadow:none;min-height:150px"><div id="mkBody" style="font-size:14px;color:var(--ink2)"></div></div>
    <div style="margin-top:14px;display:flex;gap:10px"><button class="btn" id="mkNext"></button><button class="btn ghost" id="mkReset">↺ Restart</button></div>`);
  let i=0;
  function paint(){
    box.querySelectorAll('#mkStep .step').forEach((s,idx)=>s.classList.toggle('on',idx<=i));
    box.querySelector('#mkBody').innerHTML=steps[i].body;
    if(i===1)box.querySelector('#mkPerms').innerHTML=['Read: catalog.sales.transactions','Use: SQL Warehouse','Serving: Foundation Model API','Egress: blocked by default'].map(p=>`<span class="chip" style="margin:3px;cursor:default">✔ ${p}</span>`).join('');
    if(i===2){const pr=box.querySelector('#mkProg');setTimeout(()=>pr.style.width='100%',60);}
    const btn=box.querySelector('#mkNext');
    if(steps[i].cta){btn.style.display='';btn.textContent=steps[i].cta;}else btn.style.display='none';
  }
  box.querySelector('#mkNext').onclick=()=>{if(i<steps.length-1){i++;paint();if(i===3)toast('App live on your data');}};
  box.querySelector('#mkReset').onclick=()=>{i=0;paint();};
  paint();
};

/* 13. Unity AI Gateway — budget + routing ---------------------------- */
SIMS.aigateway = (root)=>{
  const CAP=100000;
  const box=simShell(root,'Interactive simulation','Govern AI spend — route requests under a hard cap',`
    <div class="controls">
      <button class="btn" data-cost="120" data-smart="6">Simple task</button>
      <button class="btn" data-cost="900">Complex task</button>
      <button class="btn" data-cost="4500" data-smart="1200">Bulk batch</button>
      <label class="chip on" id="agSmart">⚡ Smart routing</label>
      <button class="btn ghost" id="agReset">↺ Reset</button>
    </div>
    <div class="readout">
      <div class="ro"><b id="agSpend">$0</b><span>of $100K budget</span></div>
      <div class="ro"><b id="agReq">0</b><span>requests served</span></div>
      <div class="ro"><b id="agBlock" style="color:var(--bad)">0</b><span>blocked at cap</span></div>
      <div class="ro"><b id="agSave" style="color:var(--good)">$0</b><span>saved by routing</span></div>
    </div>
    <div class="meter" style="margin-top:12px"><i id="agMeter" style="width:0%"></i></div>
    <div class="note" id="agNote">Send requests. Smart routing sends simple work to cheaper models; the hard cap halts spend the moment the budget is hit.</div>`);
  let spend=0,req=0,blocked=0,saved=0,smart=true;
  box.querySelector('#agSmart').onclick=function(){smart=!smart;this.classList.toggle('on');};
  box.querySelector('#agReset').onclick=()=>{spend=req=blocked=saved=0;box.querySelector('#agNote').innerHTML='Budget reset. Send requests again.';upd();};
  box.querySelectorAll('.btn[data-cost]').forEach(b=>b.onclick=()=>{
    let cost=+b.dataset.cost;
    if(smart&&b.dataset.smart){saved+=cost-(+b.dataset.smart);cost=+b.dataset.smart;}
    if(spend+cost>CAP){blocked++;box.querySelector('#agNote').innerHTML='⛔ <b>Budget cap reached</b> — further requests are halted automatically. Reset or raise the budget to continue.';upd();toast('Hard cap hit — request blocked');return;}
    spend+=cost;req++;upd();
  });
  function upd(){
    box.querySelector('#agSpend').textContent='$'+(spend/1000).toFixed(1)+'K';
    box.querySelector('#agReq').textContent=req; box.querySelector('#agBlock').textContent=blocked;
    box.querySelector('#agSave').textContent='$'+(saved/1000).toFixed(1)+'K';
    box.querySelector('#agMeter').style.width=Math.min(100,spend/CAP*100)+'%';
  }
  upd();
};

/* 14. Platform Security — zero-trust access decision ----------------- */
SIMS.security = (root)=>{
  const ctxList=[
    {k:'managed',l:'💻 Managed device'},{k:'network',l:'🌐 Trusted network'},
    {k:'mfa',l:'🔑 MFA verified'},{k:'sensitive',l:'⚠ Sensitive resource'}];
  const box=simShell(root,'Interactive simulation','Context-Based Ingress — a zero-trust access decision',`
    <div class="controls">${ctxList.map(c=>`<span class="chip" data-k="${c.k}">${c.l}</span>`).join('')}</div>
    <div class="simgrid">
      <div><div class="card" style="box-shadow:none"><h3 style="font-size:14px;margin-bottom:8px">Access request → Genie / dashboard / app</h3>
        <div id="secCtx" style="font-size:13px;color:var(--ink2);line-height:1.9"></div></div></div>
      <div><div class="card" id="secCard" style="box-shadow:none;text-align:center;padding:24px"><div id="secIcon" style="font-size:44px"></div>
        <div id="secVerdict" style="font-family:Space Grotesk;font-size:22px;margin-top:6px"></div>
        <div id="secWhy" style="font-size:12.5px;color:var(--ink3);margin-top:10px"></div></div></div>
    </div>`);
  const on={managed:false,network:false,mfa:false,sensitive:true};
  box.querySelectorAll('.chip[data-k]').forEach(c=>{if(on[c.dataset.k])c.classList.add('on');
    c.onclick=()=>{on[c.dataset.k]=!on[c.dataset.k];c.classList.toggle('on');render();};});
  function render(){
    const trust=(on.managed?1:0)+(on.network?1:0)+(on.mfa?1:0);
    let verdict,icon,why,col;
    if(on.sensitive && trust>=3){verdict='Allowed';icon='✅';col=COL.good;why='Sensitive resource — but full context is satisfied: managed device, trusted network, and MFA.';}
    else if(on.sensitive && trust===2){verdict='Step-up MFA';icon='🔐';col=COL.amber;why='Sensitive resource with partial context — require additional verification before granting.';}
    else if(on.sensitive){verdict='Denied';icon='⛔';col=COL.bad;why='Sensitive resource requested without enough trusted context. Zero-trust blocks it.';}
    else if(trust>=1){verdict='Allowed';icon='✅';col=COL.good;why='Non-sensitive resource with sufficient context — access granted.';}
    else {verdict='Step-up MFA';icon='🔐';col=COL.amber;why='No trusted signals — verify identity before granting even low-risk access.';}
    box.querySelector('#secCtx').innerHTML=ctxList.map(c=>`${on[c.k]?'✔':'✘'} ${c.l}`).join('<br>');
    box.querySelector('#secIcon').textContent=icon;
    const v=box.querySelector('#secVerdict');v.textContent=verdict;v.style.color=col;
    box.querySelector('#secWhy').textContent=why; box.querySelector('#secCard').style.borderColor=col;
  }
  render();
};

/* 15. Governed Vibe Coding — prompt → app ---------------------------- */
SIMS.vibecoding = (root)=>{
  const apps={
    'sales dashboard':{widgets:['KPI — Revenue','Trend — Pipeline','Table — Top deals'],data:'catalog.sales.opportunities'},
    'approvals tracker':{widgets:['Queue — Pending','Form — Approve / reject','Log — Audit trail'],data:'catalog.ops.requests'},
    'inventory alert app':{widgets:['Map — Warehouses','Alert — Low stock','Chart — Turnover'],data:'catalog.supply.inventory'}};
  const keys=Object.keys(apps);
  const box=simShell(root,'Interactive simulation','Describe an app — App Space guardrails do the rest',`
    <div class="controls">${keys.map((k,i)=>`<span class="chip ${i===0?'on':''}" data-a="${i}">“Build a ${k}”</span>`).join('')}</div>
    <div class="simgrid">
      <div><div class="card" style="box-shadow:none"><h3 style="font-size:14px;margin-bottom:8px">⚙ Genie App Builder plan</h3><div id="vcPlan" style="font-size:13px;color:var(--ink2)"></div></div>
        <div class="card" style="box-shadow:none;margin-top:10px;border-color:var(--green)"><h3 style="font-size:14px;margin-bottom:8px">🛡 App Space guardrails</h3><div id="vcGuard"></div></div></div>
      <div><div class="card" style="box-shadow:none"><h3 style="font-size:14px;margin-bottom:8px">▶ Live preview</h3><div id="vcPrev"></div></div></div>
    </div>`);
  function run(i){
    const a=apps[keys[i]];
    box.querySelector('#vcPlan').innerHTML=['Parse the request & discover relevant tables','Bind to <b>'+a.data+'</b> via Unity Catalog','Generate the UI on the AppKit TypeScript SDK','Deploy as a serverless micro app'].map((s,n)=>`<div style="margin:5px 0">${n+1}. ${s}</div>`).join('');
    box.querySelector('#vcGuard').innerHTML=['Data access inherited from the App Space','Cost cap & scale-to-zero applied','PII columns auto-masked','Governance reviewed once — not per app'].map(g=>`<div class="chip" style="margin:3px;cursor:default;border-color:var(--green)">✔ ${g}</div>`).join('');
    box.querySelector('#vcPrev').innerHTML='<div style="background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:12px">'+
      '<div style="font-family:Space Grotesk;font-weight:700;margin-bottom:8px;text-transform:capitalize">'+keys[i]+'</div>'+
      a.widgets.map(w=>`<div style="background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:11px;margin:6px 0;font-size:12.5px;color:var(--ink2)">▦ ${w}</div>`).join('')+'</div>';
  }
  box.querySelectorAll('.chip[data-a]').forEach(c=>c.onclick=()=>{box.querySelectorAll('.chip[data-a]').forEach(x=>x.classList.remove('on'));c.classList.add('on');run(+c.dataset.a);});
  run(0);
};

/* 16. AI-First Data Engineering — ai_* functions playground ---------- */
SIMS.aifirst = (root)=>{
  const fns={
    'ai_extract':{in:'"Contact Dana Lee at Acme Corp, London, by Friday."',out:[['person','Dana Lee'],['org','Acme Corp'],['location','London'],['due','Friday']]},
    'ai_classify':{in:'"The checkout page keeps crashing on mobile!"',out:[['category','Bug report'],['severity','High'],['product_area','Checkout']]},
    'ai_parse_document':{in:'📄 invoice_8841.pdf  (scanned image)',out:[['invoice_no','8841'],['total','$12,480.00'],['vendor','Globex'],['line_items','7']]},
    'ai_translate':{in:'"Where is the nearest station?"  → French',out:[['translation','Où est la gare la plus proche ?']]}};
  const keys=Object.keys(fns);
  const box=simShell(root,'Interactive simulation','Run AI directly in SQL — pick a function',`
    <div class="controls">${keys.map((k,i)=>`<span class="chip ${i===0?'on':''}" data-f="${i}">${k}()</span>`).join('')}</div>
    <div class="simgrid">
      <div><pre id="afSql" style="background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:14px;font-size:12.5px;color:var(--cyan);white-space:pre-wrap;min-height:120px"></pre></div>
      <div><div class="card" style="box-shadow:none"><h3 style="font-size:14px;margin-bottom:8px">Structured output</h3><div id="afOut" style="font-size:13px"></div></div></div>
    </div>
    <div class="note">Serverless batch inference auto-scales these across millions of rows — hours of work down to minutes, orchestrated by Lakeflow.</div>`);
  function run(i){
    const k=keys[i],f=fns[k];
    box.querySelector('#afSql').textContent=`SELECT ${k}(\n  ${f.in}\n) AS result;`;
    box.querySelector('#afOut').innerHTML='<table style="width:100%;border-collapse:collapse">'+
      f.out.map(r=>`<tr><td style="padding:6px;color:var(--ink3);border-bottom:1px solid var(--line)">${r[0]}</td><td style="padding:6px;border-bottom:1px solid var(--line);color:var(--ink)">${r[1]}</td></tr>`).join('')+'</table>';
  }
  box.querySelectorAll('.chip[data-f]').forEach(c=>c.onclick=()=>{box.querySelectorAll('.chip[data-f]').forEach(x=>x.classList.remove('on'));c.classList.add('on');run(+c.dataset.f);});
  run(0);
};

/* 17. Omnigent — meta-harness: combine / control / share ------------- */
SIMS.omnigent = (root)=>{
  const box=simShell(root,'Interactive simulation','The meta-harness — combine, control & share your agents',`
    <div class="controls"><div class="seg" id="omTab">
      <button data-t="combine" class="on">Combine</button><button data-t="control">Control</button><button data-t="share">Share</button>
    </div></div><div id="omPanel"></div>`);
  const panel=box.querySelector('#omPanel'); let tab='combine';
  const HARNESS=['Claude Code','Codex','Pi','Custom'];
  const sel={plan:'Claude Code',code:'Codex'};
  let spend=0,policy=true,sandbox=true,blocked=0;
  const hashStr=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;};
  box.querySelectorAll('#omTab button').forEach(b=>b.onclick=()=>{box.querySelectorAll('#omTab button').forEach(x=>x.classList.remove('on'));b.classList.add('on');tab=b.dataset.t;render();});
  function render(){
    if(tab==='combine'){
      panel.innerHTML=`<div class="simgrid">
        <div class="card" style="box-shadow:none">
          <h3 style="font-size:14px;margin-bottom:10px">Compose your session</h3>
          <div style="font-size:12px;color:var(--ink3);margin-bottom:6px">Planning agent</div>
          <div class="seg" id="omPlan">${HARNESS.map(h=>`<button data-h="${h}" class="${sel.plan===h?'on':''}">${h}</button>`).join('')}</div>
          <div style="font-size:12px;color:var(--ink3);margin:12px 0 6px">Code-gen agent</div>
          <div class="seg" id="omCode">${HARNESS.map(h=>`<button data-h="${h}" class="${sel.code===h?'on':''}">${h}</button>`).join('')}</div>
          <div class="note">Swap any harness with a <b>one-line change</b> — no rewrites. Messages & files in, text & tool-calls out: the interface is uniform.</div>
        </div>
        <div class="card" style="box-shadow:none">
          <h3 style="font-size:14px;margin-bottom:10px">Unified session</h3>
          <div class="omflow"><div class="omnode">📋 Plan<br><b>${sel.plan}</b></div><div class="omarrow">→</div><div class="omnode">⌨ Code<br><b>${sel.code}</b></div><div class="omarrow">→</div><div class="omnode done">✅ Result</div></div>
          <div class="note">Different LLMs for different tasks, one Omnigent session — all behind a single common API.</div>
        </div></div>`;
      panel.querySelectorAll('#omPlan button').forEach(b=>b.onclick=()=>{sel.plan=b.dataset.h;render();});
      panel.querySelectorAll('#omCode button').forEach(b=>b.onclick=()=>{sel.code=b.dataset.h;render();});
    } else if(tab==='control'){
      panel.innerHTML=`<div class="controls">
        <button class="btn" id="omRun">▶ Run agent step (+$18)</button>
        <label class="chip ${policy?'on':''}" id="omPolicy">⏸ Pause at $100</label>
        <label class="chip ${sandbox?'on':''}" id="omSandbox">🛡 OS sandbox</label>
        <button class="btn ghost" id="omReset">↺ Reset</button></div>
        <div class="readout">
          <div class="ro"><b id="omSpend">$0</b><span>session spend / $100</span></div>
          <div class="ro"><b id="omState" style="color:var(--good)">running</b><span>agent state</span></div>
          <div class="ro"><b id="omNet">intercepted</b><span>network requests</span></div>
          <div class="ro"><b id="omBlocked">0</b><span>policy stops</span></div></div>
        <div class="meter" style="margin-top:12px"><i id="omMeter" style="width:0%"></i></div>
        <div class="note" id="omNote">Stateful, contextual policies — not just prompts. Run steps and watch the cost policy enforce a hard pause.</div>`;
      const upd=()=>{panel.querySelector('#omSpend').textContent='$'+spend;panel.querySelector('#omMeter').style.width=Math.min(100,spend)+'%';
        panel.querySelector('#omBlocked').textContent=blocked;panel.querySelector('#omNet').textContent=sandbox?'intercepted':'open';
        const paused=policy&&spend>=100;const st=panel.querySelector('#omState');st.textContent=paused?'paused':'running';st.style.color=paused?COL.amber:COL.good;};
      panel.querySelector('#omRun').onclick=()=>{if(policy&&spend>=100){blocked++;panel.querySelector('#omNote').innerHTML='⏸ <b>Paused by cost policy</b> — the agent stopped at the $100 threshold. Reset or raise the budget.';upd();toast('Cost policy paused the agent');return;}spend+=18;if(policy&&spend>100)spend=100;upd();};
      panel.querySelector('#omPolicy').onclick=function(){policy=!policy;this.classList.toggle('on');upd();};
      panel.querySelector('#omSandbox').onclick=function(){sandbox=!sandbox;this.classList.toggle('on');upd();panel.querySelector('#omNote').innerHTML=sandbox?'OS-level sandbox on — outbound network requests are intercepted & transformed.':'Sandbox off — the agent would have open network access (not recommended).';};
      panel.querySelector('#omReset').onclick=()=>{spend=0;blocked=0;upd();};
      upd();
    } else {
      panel.innerHTML=`<div class="controls"><button class="btn" id="omShare">🔗 Share session</button></div>
        <div class="card" style="box-shadow:none">
          <div style="font-size:12px;color:var(--ink3)">Session URL</div>
          <div id="omUrl" style="font-family:monospace;font-size:13px;color:var(--cyan);margin:4px 0 12px">— not shared —</div>
          <div style="font-size:12px;color:var(--ink3);margin-bottom:6px">Participants</div>
          <div id="omPeeps" style="display:flex;gap:8px;flex-wrap:wrap"></div>
          <div id="omComments" style="margin-top:14px;display:flex;flex-direction:column;gap:8px"></div></div>
        <div class="note">Sessions are the collaboration space — teammates join by URL to review, comment on files and steer agents together in real time.</div>`;
      panel.querySelector('#omShare').onclick=()=>{
        panel.querySelector('#omUrl').textContent='omnigent.ai/s/dais26-'+(hashStr(sel.plan+sel.code)%9000+1000);
        const peeps=['🧑‍💻 You','👩‍🔬 Priya','🧑‍🎨 Marco','👨‍🔧 Sam'],pc=panel.querySelector('#omPeeps');pc.innerHTML='';
        peeps.forEach((p,i)=>setTimeout(()=>{const s=document.createElement('span');s.className='chip';s.style.cssText='cursor:default;opacity:0;transition:.3s';s.textContent=p;pc.appendChild(s);requestAnimationFrame(()=>s.style.opacity=1);},i*350));
        const comments=[['Priya','can we use Pi for planning here?'],['Marco','left a note on app.py line 42'],['Sam','approved — ship it ✅']],cc=panel.querySelector('#omComments');cc.innerHTML='';
        comments.forEach((c,i)=>setTimeout(()=>{const d=document.createElement('div');d.className='chip';d.style.cssText='align-self:flex-start;cursor:default;opacity:0;transition:.3s';d.innerHTML=`<b style="color:var(--lava2)">${c[0]}</b> &nbsp;${c[1]}`;cc.appendChild(d);requestAnimationFrame(()=>d.style.opacity=1);},800+i*700));
        toast('Live session shared');
      };
    }
  }
  render();
};

/* 18. Genie One — ask, govern, act ----------------------------------- */
SIMS.genieone = (root)=>{
  const Q={
    "How are we tracking to the Q3 sales target?":{a:'You\'re at <b>82%</b> of the $4.0M Q3 target with 3 weeks left — pacing slightly ahead of last quarter.',ax:['📅 Schedule a weekly tracker','📝 Draft an update for leadership','💬 Post summary to #sales']},
    "Which customers are at renewal risk?":{a:'<b>6 accounts</b> ($1.2M ARR) show declining usage and open support tickets — flagged as renewal risk.',ax:['📅 Schedule QBRs','📝 Draft save-play briefs','💬 Alert the CS team in Slack']},
    "Summarize this week's support escalations":{a:'<b>14 escalations</b>, down 20% week-over-week. Top theme: checkout latency on mobile (5 tickets).',ax:['📝 Draft an exec summary','📅 Schedule a postmortem','💬 Share to #support-leads']}};
  const keys=Object.keys(Q);
  const box=simShell(root,'Interactive simulation','Genie One — ask, get a governed answer, take action',`
    <div class="controls">${keys.map((k,i)=>`<span class="chip ${i===0?'on':''}" data-q="${i}">${k}</span>`).join('')}</div>
    <div class="card" style="box-shadow:none">
      <div style="font-size:12px;color:var(--ink3)">✨ Genie One · grounded in your data</div>
      <div id="g1Ans" style="font-size:15px;margin:8px 0 6px"></div>
      <div style="font-size:11px;color:var(--ink3)"><span class="pill ga">Unity Catalog governed</span> answer respects your row/column access</div>
      <div style="font-size:12px;color:var(--ink3);margin:14px 0 6px">Take action — no code:</div>
      <div id="g1Actions" style="display:flex;flex-wrap:wrap;gap:8px"></div>
      <div class="note" id="g1Note">Genie One turns insight into action across 50+ tools — Slack, Teams, Jira, email.</div>
    </div>`);
  function run(i){const q=Q[keys[i]];
    box.querySelector('#g1Ans').innerHTML=q.a;
    box.querySelector('#g1Actions').innerHTML=q.ax.map(a=>`<button class="chip" style="cursor:pointer">${a}</button>`).join('');
    box.querySelectorAll('#g1Actions button').forEach(b=>b.onclick=()=>{box.querySelector('#g1Note').innerHTML='✅ <b>'+b.textContent.replace(/^[^A-Za-z]+/,'')+'</b> — done, governed by Unity Catalog. Scheduled actions run autonomously and return for review.';toast('Action triggered');});
  }
  box.querySelectorAll('.chip[data-q]').forEach(c=>c.onclick=()=>{box.querySelectorAll('.chip[data-q]').forEach(x=>x.classList.remove('on'));c.classList.add('on');run(+c.dataset.q);});
  run(0);
};

/* 19. Genie Agents — conversational analytics ------------------------ */
SIMS.genieagents = (root)=>{
  const Q={
    "Top regions by revenue this quarter":{steps:['Parse → revenue by region, current quarter','Match curated instruction: revenue = net_revenue','Use trusted answer: regional_revenue() (verified SQL)'],
      sql:`SELECT region, SUM(net_revenue) rev\nFROM sales.orders\nWHERE quarter = current_quarter()\nGROUP BY region ORDER BY rev DESC;`,
      cols:['Region','Revenue'],rows:[['EMEA','$3.6M'],['AMER','$3.1M'],['APAC','$2.2M']],chart:[3.6,3.1,2.2],follow:['Compare to last quarter','Which products drove EMEA?']},
    "Why did APAC dip last month?":{steps:['Parse → APAC trend, month-over-month','Agentic reasoning: decompose by product','Ground in lakehouse + curated semantics'],
      sql:`SELECT product, mom_change\nFROM sales.apac_trend\nWHERE mom_change < 0 ORDER BY mom_change;`,
      cols:['Product','MoM'],rows:[['Hardware','-12%'],['Support','-7%'],['Cloud','-3%']],chart:[-12,-7,-3],follow:['Show segment breakdown','Is this seasonal?']}};
  const keys=Object.keys(Q); let gch=null;
  const box=simShell(root,'Interactive simulation','Genie Agents — ask in plain language, get a trusted answer',`
    <div class="controls">${keys.map((k,i)=>`<span class="chip ${i===0?'on':''}" data-q="${i}">${k}</span>`).join('')}</div>
    <div class="simgrid">
      <div><div class="card" style="box-shadow:none"><h3 style="font-size:14px;margin-bottom:8px">Agentic reasoning</h3><div id="gaSteps" style="font-size:12.5px;color:var(--ink2)"></div>
        <pre id="gaSql" style="background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:12px;font-size:12px;color:var(--cyan);white-space:pre-wrap;margin-top:10px"></pre>
        <div style="margin-top:8px"><span class="pill ga">trusted answer ✓</span> <span style="font-size:11px;color:var(--ink3)">verified SQL · Unity Catalog governed</span></div></div></div>
      <div><div class="card" style="box-shadow:none"><h3 style="font-size:14px;margin-bottom:8px">Answer</h3>
        <canvas id="gaChart" height="150"></canvas><div id="gaTable" style="margin-top:8px;font-size:12.5px"></div>
        <div style="margin-top:10px;font-size:12px;color:var(--ink3)">Follow-ups:</div><div id="gaFollow" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:5px"></div>
        <div style="margin-top:10px;font-size:12px">Helpful? <span class="chip" id="gaUp" style="cursor:pointer">👍</span> <span class="chip" id="gaDown" style="cursor:pointer">👎</span></div></div></div>
    </div>`);
  function run(i){const q=Q[keys[i]];const st=box.querySelector('#gaSteps');st.innerHTML='';
    q.steps.forEach((s,n)=>setTimeout(()=>{const d=document.createElement('div');d.style.cssText='margin:3px 0;opacity:0;transition:.3s';d.innerHTML=`✦ ${s}`;st.appendChild(d);requestAnimationFrame(()=>d.style.opacity=1);},n*350));
    box.querySelector('#gaSql').textContent=q.sql;
    box.querySelector('#gaTable').innerHTML='<table style="width:100%;border-collapse:collapse">'+q.rows.map(r=>`<tr><td style="padding:4px;border-bottom:1px solid var(--line)">${r[0]}</td><td style="padding:4px;border-bottom:1px solid var(--line);color:var(--ink)">${r[1]}</td></tr>`).join('')+'</table>';
    box.querySelector('#gaFollow').innerHTML=q.follow.map(f=>`<span class="chip" style="cursor:default;font-size:12px">${f}</span>`).join('');
    if(gch)gch.destroy();
    gch=new Chart(box.querySelector('#gaChart'),{type:'bar',data:{labels:q.rows.map(r=>r[0]),datasets:[{data:q.chart,backgroundColor:q.chart.map(v=>v<0?COL.bad:COL.lava),borderRadius:5}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
    onTeardown(()=>{if(gch)gch.destroy();});
  }
  box.querySelectorAll('.chip[data-q]').forEach(c=>c.onclick=()=>{box.querySelectorAll('.chip[data-q]').forEach(x=>x.classList.remove('on'));c.classList.add('on');run(+c.dataset.q);});
  box.addEventListener('click',e=>{if(e.target.id==='gaUp')toast('Thanks — feedback improves accuracy');if(e.target.id==='gaDown')toast('Noted — Genie will ask for clarification');});
  run(0);
};

/* 20. Genie ZeroOps — detect, assess, remediate, verify -------------- */
SIMS.geniezeroops = (root)=>{
  const issues=[
    {sev:'high',t:'orders_gold pipeline failed',cause:'upstream schema change — <code>amount</code> renamed to <code>amount_usd</code>',fix:'map amount_usd → amount in the bronze→silver transform',verify:'sandbox run on cloned data — 1.2M rows, 0 errors'},
    {sev:'med',t:'customer_dim freshness SLA breach',cause:'late-arriving CDC feed from the CRM connector',fix:'add watermark + retry trigger; backfill a 3h window',verify:'sandbox — freshness restored to under 15 minutes'},
    {sev:'high',t:'churn-v3 model drift alert',cause:'PSI 0.41 on the days_since_login feature',fix:'retrain a candidate on the last 90 days; re-evaluate',verify:'candidate AUC 0.89 ≥ baseline 0.86 — passes eval'}];
  const box=simShell(root,'Interactive simulation','Genie ZeroOps — detect, assess, remediate, verify',`
    <div class="simgrid">
      <div><div class="card" style="box-shadow:none"><h3 style="font-size:14px;margin-bottom:8px">📥 Issue inbox</h3><div id="zoInbox"></div></div></div>
      <div><div class="card" style="box-shadow:none" id="zoDetail"><div style="color:var(--ink3);font-size:13px">Select an issue — ZeroOps traces the root cause through lineage and proposes a verified fix.</div></div></div>
    </div>`);
  const inbox=box.querySelector('#zoInbox');
  inbox.innerHTML=issues.map((x,i)=>`<div class="chip zoi" data-i="${i}" style="display:flex;width:100%;justify-content:space-between;margin:5px 0;cursor:pointer"><span>${x.t}</span><span class="pill ${x.sev==='high'?'pp':'beta'}" style="${x.sev==='high'?'background:rgba(255,84,112,.16);color:var(--bad)':'background:rgba(255,171,0,.16);color:var(--amber)'}">${x.sev}</span></div>`).join('');
  inbox.querySelectorAll('.zoi').forEach(el=>el.onclick=()=>{
    const x=issues[+el.dataset.i],d=box.querySelector('#zoDetail');
    d.innerHTML=`<h3 style="font-size:14px;margin-bottom:10px">${x.t}</h3><div id="zoSteps" style="font-size:12.5px;color:var(--ink2)"></div>`;
    const sc=d.querySelector('#zoSteps');
    const lines=[`<b style="color:var(--good)">① Detect</b> — ✓ failure caught by continuous monitoring`,
      `<b style="color:var(--amber)">② Assess</b> — root cause via UC lineage: ${x.cause}`,
      `<b style="color:var(--cyan)">③ Remediate</b> — proposed fix: ${x.fix}`,
      `<b style="color:var(--good)">④ Verify</b> — ${x.verify}`];
    lines.forEach((l,n)=>setTimeout(()=>{const e=document.createElement('div');e.style.cssText='margin:8px 0;opacity:0;transition:.3s';e.innerHTML=l;sc.appendChild(e);requestAnimationFrame(()=>e.style.opacity=1);
      if(n===lines.length-1)setTimeout(()=>{const b=document.createElement('div');b.style.marginTop='12px';b.innerHTML='<button class="btn" id="zoApprove">✅ Approve & deploy</button> <button class="btn ghost" id="zoReject">Reject</button>';sc.appendChild(b);
        sc.querySelector('#zoApprove').onclick=()=>toast('Fix deployed — verified against cloned data');
        sc.querySelector('#zoReject').onclick=()=>toast('Rejected — ZeroOps will propose another fix');},400);},n*600));
  });
};

/* =====================================================================
   INTERACTIVE CARD CHARTS (remaining non-flagship: partners, free, clouds)
   ===================================================================== */
const CARDCHARTS = {};
CARDCHARTS.secureconnect=(el)=>{ const cv=mkCanvas(el,180);
  chart(cv,{type:'bar',data:{labels:['3 recipients','10','25','50'],
    datasets:[{label:'Manual IP allowlists',data:[3,10,25,50],backgroundColor:COL.ink3},
    {label:'SecureConnect configs',data:[1,1,1,1],backgroundColor:COL.cyan}]},
    options:{plugins:{legend:{position:'bottom'},title:{display:true,text:'Configs needed as recipients grow'}},scales:{y:{beginAtZero:true}}}}); };
CARDCHARTS.marketplace=(el)=>{ el.innerHTML='<div class="stepper"><div class="step on">Browse</div><div class="step on">Install</div><div class="step on">Launch</div><div class="step on">Use</div></div>'+
  '<div class="logogrid">'+['Capital One','The Trade Desk','Datavant','Slalom','Prometheux','Reflex','+14 more'].map(l=>`<span class="logo">${l}</span>`).join('')+'</div>'; };
CARDCHARTS.aigateway=(el)=>{ el.innerHTML='<div style="font-size:12px;color:var(--ink3);margin-bottom:6px">Monthly AI budget — hard cap halts requests</div><div class="meter"><i style="width:82%"></i></div><div class="note">$82K of $100K used · routing cheap tasks to smaller models</div>';
  const cv=mkCanvas(el,150);
  chart(cv,{type:'doughnut',data:{labels:['Frontier','Mid','Small/custom'],datasets:[{data:[30,45,25],backgroundColor:[COL.lava,COL.amber,COL.green],borderColor:cssv('--bg'),borderWidth:2}]},
    options:{cutout:'60%',plugins:{legend:{position:'bottom'},title:{display:true,text:'Smart routing mix'}}}}); };
CARDCHARTS.security=(el)=>{ el.innerHTML='<div class="logogrid">'+
  [['HITRUST','ga'],['ISMAP','ga'],['FedRAMP High','pp'],['KSA (CCC/DCC/ECC)','pp'],['GovCloud','ga'],['AIM Entra ID','ga'],['AIM Okta','beta']].map(([l,c])=>`<span class="logo">${l} <span class="pill ${c}">${c.toUpperCase()}</span></span>`).join('')+'</div>'; };
CARDCHARTS.vibecoding=(el)=>{ const cv=mkCanvas(el,180);
  chart(cv,{type:'line',data:{labels:['M0','M1','M2','M3','M4','M5','M6'],
    datasets:[{label:'Active apps',data:[100,118,140,158,176,192,205],borderColor:COL.green,backgroundColor:'rgba(82,168,112,.15)',fill:true,tension:.35},
    {label:'Weekly users (×)',data:[100,140,190,240,280,310,330],borderColor:COL.cyan,tension:.35}]},
    options:{plugins:{legend:{position:'bottom'},title:{display:true,text:'6-month growth (indexed to 100)'}}}}); };
CARDCHARTS.aifirst=(el)=>{ el.innerHTML='<div class="logogrid" style="margin-bottom:10px">'+['ai_extract','ai_classify','ai_translate','ai_parse_document','ai_query'].map(l=>`<span class="logo" style="color:var(--cyan)">${l}()</span>`).join('')+'</div>';
  const cv=mkCanvas(el,150);
  chart(cv,{type:'bar',data:{labels:['Bradesco coding','Batch processing'],datasets:[{label:'Before',data:[100,100],backgroundColor:COL.ink3},{label:'After',data:[50,12],backgroundColor:COL.blue}]},
    options:{indexAxis:'y',plugins:{legend:{position:'bottom'},title:{display:true,text:'Relative effort (before → after)'}}}}); };
CARDCHARTS.lakebasepartners=(el)=>{ el.innerHTML='<div style="font-family:Space Grotesk;font-size:28px;color:var(--ink)">60+ <span style="font-size:14px;color:var(--ink3)">launch partners</span></div><div class="logogrid" style="margin-top:10px">'+
  ['Accenture','Deloitte','EY','TCS','Fivetran','Confluent','Retool','Replit','ThoughtSpot','Qlik','Informatica','Atlan'].map(l=>`<span class="logo">${l}</span>`).join('')+'</div>'; };
CARDCHARTS.freeedition=(el)=>{ const cv=mkCanvas(el,170);
  chart(cv,{type:'bar',data:{labels:['Genie Code','Serverless GPUs','Lakebase','Agent Bricks','Lakeflow Designer'],
    datasets:[{data:[1,1,1,1,1],backgroundColor:[COL.lava,COL.amber,COL.cyan,COL.green,COL.blue]}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},title:{display:true,text:'5 new products now free'}},scales:{x:{display:false}}}}); };
CARDCHARTS.cloud=(el,c)=>{ el.innerHTML='<div class="logogrid">'+
  (c.title.includes('Azure')?['OneLake','ADME federation','GEODIS','TK Elevator','Lippert']:['Bedrock','AgentCore','Kiro','Mastercard','Talkdesk','nCino']).map(l=>`<span class="logo">${l}</span>`).join('')+'</div>'; };

/* small math helpers used by canvas sims */
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function canvasRgb(color){
  const c=String(color||'').trim();
  if(/^#[0-9a-f]{3}$/i.test(c)) return c.slice(1).split('').map(x=>parseInt(x+x,16));
  if(/^#[0-9a-f]{6}$/i.test(c)) return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
  const m=c.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)/i);
  return m?[+m[1],+m[2],+m[3]]:[255,255,255];
}
function canvasLum(color){return canvasRgb(color).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
function canvasTextColor(fill){
  const bg=canvasLum(fill),dark=canvasLum('#071f26');
  const onLight=1.05/(bg+.05),onDark=(Math.max(bg,dark)+.05)/(Math.min(bg,dark)+.05);
  return onLight>=onDark?'#fff':'#071f26';
}
function canvasLabel(ctx,text,x,y,maxWidth){ctx.fillText(text,x,y,Math.max(8,maxWidth));}
function lerp(a,b,t){return a+(b-a)*t;}
function qb(y1,y2,t,cx){const mid=(y1+y2)/2;return (1-t)*(1-t)*y1+2*(1-t)*t*mid+t*t*y2;}

/* =====================================================================
   THEME — light / dark toggle
   ===================================================================== */
const Theme = {
  apply(t){
    if(t==='light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('dais_theme_v2', t);
    document.getElementById('themeBtn').textContent = t==='light' ? '☀️' : '🌙';
    if(window.Chart){ Chart.defaults.color=cssv('--ink3'); Chart.defaults.borderColor=cssv('--line'); }
  },
  current(){ return localStorage.getItem('dais_theme_v2')==='dark' ? 'dark' : 'light'; },
  toggle(){ const next = this.current()==='light' ? 'dark' : 'light';
    this.apply(next); route(); toast(next==='light' ? '☀️ Tema claro' : '🌙 Tema oscuro'); }
};
document.getElementById('themeBtn').onclick = ()=>Theme.toggle();
Theme.apply(Theme.current());

/* about popover */
(function(){
  const btn=document.getElementById('aboutBtn'), pop=document.getElementById('aboutPop');
  btn.onclick=(e)=>{ e.stopPropagation(); const open=pop.classList.toggle('open'); btn.classList.toggle('on',open); };
  document.addEventListener('click',(e)=>{ if(!pop.contains(e.target) && e.target!==btn){ pop.classList.remove('open'); btn.classList.remove('on'); } });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ pop.classList.remove('open'); btn.classList.remove('on'); } });
})();

/* language switcher */
(function(){
  const sel=document.getElementById('langSel');
  if(sel){
    sel.value=LANG;
    sel.onchange=()=>applyLang(sel.value);
  }
  document.documentElement.lang=LANG;
  document.documentElement.dir=RTL[LANG]?'rtl':'ltr';
})();

/* boot */
route();
