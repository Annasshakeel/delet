const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const devices = [
  {id:'gw-01',name:'Core Router',ip:'10.0.0.1',type:'Router',icon:'◇',latency:8,cpu:32,status:'online',description:'Primary gateway routing traffic between network segments.'},
  {id:'sw-01',name:'Access Switch 01',ip:'10.0.1.2',type:'Switch',icon:'▤',latency:12,cpu:41,status:'online',description:'Distribution switch serving office floor one.'},
  {id:'sw-02',name:'Access Switch 02',ip:'10.0.1.3',type:'Switch',icon:'▤',latency:86,cpu:91,status:'warning',description:'Elevated CPU utilization detected. Review connected clients and interface errors.'},
  {id:'fw-01',name:'Edge Firewall',ip:'10.0.0.254',type:'Firewall',icon:'⬡',latency:14,cpu:27,status:'online',description:'Perimeter firewall and security policy enforcement point.'},
  {id:'ap-01',name:'Wireless AP 01',ip:'10.0.2.10',type:'Access Point',icon:'⌁',latency:19,cpu:38,status:'online',description:'Wireless access point covering the main office.'},
  {id:'ap-02',name:'Wireless AP 02',ip:'10.0.2.11',type:'Access Point',icon:'⌁',latency:null,cpu:null,status:'offline',description:'No heartbeat received. Check power, cabling and upstream switch port.'},
  {id:'srv-01',name:'Application Server',ip:'10.0.3.10',type:'Server',icon:'▥',latency:21,cpu:56,status:'online',description:'Hosts internal applications and business services.'},
  {id:'srv-02',name:'Database Server',ip:'10.0.3.11',type:'Server',icon:'▥',latency:29,cpu:48,status:'online',description:'Primary relational database server.'}
];
let incidents = [
  {id:1,title:'Device unreachable',device:'AP-02',ip:'10.0.2.11',severity:'critical',time:'12 minutes ago',ack:false},
  {id:2,title:'High CPU utilization',device:'SW-02',ip:'10.0.1.3',severity:'warning',time:'38 minutes ago',ack:false}
];
let activity = [
  {icon:'⌁',title:'Network monitoring service initialized',detail:'All 8 devices loaded into simulation',time:'Just now'},
  {icon:'↻',title:'Scheduled health check completed',detail:'7 online · 1 offline · 1 warning',time:'2 min ago'},
  {icon:'⚑',title:'Critical incident detected',detail:'AP-02 failed to respond to heartbeat',time:'12 min ago'},
  {icon:'⌁',title:'CPU threshold exceeded',detail:'SW-02 reached 91% CPU utilization',time:'38 min ago'}
];

const timeNow = () => new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;$('#toastContainer').append(el);setTimeout(()=>el.remove(),3500)}
function logEvent(title,detail,icon='⌁'){activity.unshift({icon,title,detail,time:'Just now'});activity=activity.slice(0,12);renderActivity()}
function renderActivity(){$('#activityList').innerHTML=activity.map(a=>`<div class="activity-row"><span class="activity-mark">${a.icon}</span><div><strong>${escapeHTML(a.title)}</strong><small>${escapeHTML(a.detail)}</small></div><span class="activity-time">${escapeHTML(a.time)}</span></div>`).join('')}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderDevices(){
 const query=$('#deviceSearch').value.toLowerCase(), filter=$('#statusFilter').value;
 const filtered=devices.filter(d=>(filter==='all'||d.status===filter)&&`${d.name} ${d.ip} ${d.type}`.toLowerCase().includes(query));
 $('#deviceTable').innerHTML=filtered.map(d=>`<tr><td><div class="device-name"><span class="device-type-icon">${d.icon}</span><div><strong>${d.name}</strong><small>${d.id.toUpperCase()}</small></div></div></td><td class="ip-cell">${d.ip}</td><td>${d.type}</td><td class="mono">${d.latency===null?'—':d.latency+' ms'}</td><td><div class="load-cell"><span class="mono">${d.cpu===null?'—':d.cpu+'%'}</span>${d.cpu===null?'':`<span class="load-bar"><i style="width:${d.cpu}%;background:${d.cpu>80?'var(--orange)':'var(--cyan)'}"></i></span>`}</div></td><td><span class="status-pill ${d.status}">${d.status}</span></td><td><button class="row-action" data-device="${d.id}" aria-label="Inspect ${d.name}">···</button></td></tr>`).join('');
 $('#deviceResultCount').textContent=`Showing ${filtered.length} of ${devices.length} devices`;
 $('#connected').textContent=devices.filter(d=>d.status!=='offline').length;
 $('#deviceNavCount').textContent=devices.length;
 $('#activeIncidents').textContent=incidents.filter(i=>!i.ack).length;
 $('#incidentNavCount').textContent=incidents.filter(i=>!i.ack).length;
}
function renderIncidents(){
 const open=incidents.filter(i=>!i.ack);
 $('#incidentList').innerHTML=open.length?open.map(i=>`<div class="incident-item"><span class="incident-icon ${i.severity}">${i.severity==='critical'?'!':'⌁'}</span><div class="incident-info"><strong>${i.title}</strong><span>${i.device} · ${i.ip}</span><small>${i.time}</small></div><span class="severity ${i.severity}-text">${i.severity.toUpperCase()}</span></div>`).join(''):'<div class="empty-state" style="padding:28px 5px;color:#8aa0b7;text-align:center">✓ No open incidents. Network is clear.</div>';
 renderDevices();
}
function updateTopology(){ $$('.topo-node').forEach(n=>{const d=devices.find(x=>x.id===n.dataset.device);n.classList.toggle('offline',d.status==='offline');n.classList.toggle('warning',d.status==='warning')}) }
function openDevice(id){
 const d=devices.find(x=>x.id===id);if(!d)return;
 $('#modalDeviceName').textContent=d.name;
 $('#modalBody').innerHTML=`<div class="modal-grid"><div class="modal-stat"><span>IP ADDRESS</span><strong>${d.ip}</strong></div><div class="modal-stat"><span>DEVICE STATUS</span><strong style="color:${d.status==='online'?'var(--green)':d.status==='warning'?'var(--orange)':'var(--red)'}">${d.status.toUpperCase()}</strong></div><div class="modal-stat"><span>LATENCY</span><strong>${d.latency===null?'No response':d.latency+' ms'}</strong></div><div class="modal-stat"><span>CPU UTILIZATION</span><strong>${d.cpu===null?'—':d.cpu+'%'}</strong></div></div><p class="modal-description">${d.description}<br><br><span style="font-family:var(--mono);color:#6f849c">ASSET ID: ${d.id.toUpperCase()} · TYPE: ${d.type.toUpperCase()}</span></p>`;
 $('#modalPing').dataset.device=id;$('#deviceModal').classList.add('open');$('#deviceModal').setAttribute('aria-hidden','false');
}
function closeModal(){$('#deviceModal').classList.remove('open');$('#deviceModal').setAttribute('aria-hidden','true')}
function randomBetween(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function runPing(id){
 const d=devices.find(x=>x.id===id);if(!d)return;
 if(d.status==='offline'){toast(`Ping failed: ${d.ip} — request timed out`);logEvent('Ping test failed',`${d.name} did not respond`,'!');return}
 const ms=randomBetween(7,35);toast(`Ping successful: ${d.ip} — ${ms} ms`);logEvent('Ping test completed',`${d.name} responded in ${ms} ms`,'↗');
}
function runScan(){
 const btn=$('#scanBtn');btn.disabled=true;btn.innerHTML='<span>◌</span> Scanning network...';toast('Network discovery scan started');logEvent('Network scan started','Scanning 8 registered endpoints','↻');
 setTimeout(()=>{
  devices.forEach(d=>{if(d.status!=='offline'){d.latency=Math.max(5,d.latency+randomBetween(-4,5));if(d.id==='sw-02')d.cpu=randomBetween(86,94)}});
  renderDevices();updateTopology();btn.disabled=false;btn.innerHTML='<span>⌁</span> Run network scan';
  toast('Scan complete: 8 devices checked, 7 responding');logEvent('Network scan completed','7 responding · 1 unreachable','✓');
 },1500);
}
function drawChart(){
 const canvas=$('#trafficChart'),rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
 canvas.width=Math.max(1,rect.width*dpr);canvas.height=Math.max(1,rect.height*dpr);
 const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const w=rect.width,h=rect.height;
 const count=Number($('#rangeSelect').value),inbound=Array.from({length:count},(_,i)=>410+Math.sin(i*.8)*150+Math.cos(i*.27)*100+randomBetween(-40,40)),outbound=inbound.map(v=>v*.48+randomBetween(-35,35));
 const max=1200,pad=5;
 ctx.strokeStyle='rgba(111,139,170,.13)';ctx.lineWidth=1;
 for(let i=0;i<5;i++){let y=pad+(h-pad*2)*i/4;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 function plot(data,color,fill){ctx.beginPath();data.forEach((v,i)=>{let x=i/(data.length-1)*w,y=h-pad-v/max*(h-pad*2);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();let grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,fill);grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fill();ctx.beginPath();data.forEach((v,i)=>{let x=i/(data.length-1)*w,y=h-pad-v/max*(h-pad*2);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke()}
 plot(outbound,'#9b83ff','rgba(155,131,255,.13)');plot(inbound,'#39d6e8','rgba(57,214,232,.16)');
 $('#currentTraffic').innerHTML=`${Math.max(...inbound)} <small>Mbps</small>`;
}
function exportReport(){
 const rows=[['Device','IP Address','Type','Latency','CPU','Status'],...devices.map(d=>[d.name,d.ip,d.type,d.latency===null?'N/A':`${d.latency} ms`,d.cpu===null?'N/A':`${d.cpu}%`,d.status])];
 const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='netvision-device-report.csv';a.click();URL.revokeObjectURL(url);toast('Device report exported as CSV');logEvent('Report exported','Device inventory downloaded as CSV','↧');
}
function init(){
 $('#dateLabel').textContent=new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}).toUpperCase();
 $('#sidebarTime').textContent=timeNow();
 const bars=$('#availabilityBars');for(let i=0;i<17;i++){const e=document.createElement('i');e.style.height=`${randomBetween(5,16)}px`;bars.append(e)}
 renderDevices();renderIncidents();renderActivity();updateTopology();drawChart();
 $('#deviceSearch').addEventListener('input',renderDevices);$('#statusFilter').addEventListener('change',renderDevices);
 $('#deviceTable').addEventListener('click',e=>{const b=e.target.closest('[data-device]');if(b)openDevice(b.dataset.device)});
 $$('.topo-node').forEach(n=>n.addEventListener('click',()=>openDevice(n.dataset.device)));
 $('#scanBtn').addEventListener('click',runScan);$('#exportBtn').addEventListener('click',exportReport);
 $('#rangeSelect').addEventListener('change',drawChart);window.addEventListener('resize',drawChart);
 $('#ackAllBtn').addEventListener('click',()=>{const n=incidents.filter(i=>!i.ack).length;if(!n){toast('There are no open incidents to acknowledge');return}incidents.forEach(i=>i.ack=true);renderIncidents();toast(`${n} incident${n>1?'s':''} acknowledged`);logEvent('Incidents acknowledged',`${n} incident records marked as reviewed`,'✓')});
 $('#allIncidentsBtn').addEventListener('click',()=>toast(`${incidents.length} incident records · ${incidents.filter(i=>!i.ack).length} open`));
 $('#clearActivityBtn').addEventListener('click',()=>{activity=[];renderActivity();toast('Activity log cleared')});
 $('#notificationBtn').addEventListener('click',()=>toast(`${incidents.filter(i=>!i.ack).length} unacknowledged incident(s)`));
 $('#focusTopology').addEventListener('click',()=>{$('#topology').scrollIntoView({behavior:'smooth'});toast('Select any topology node to inspect it')});
 $('#closeModal').addEventListener('click',closeModal);$('#modalCloseBtn').addEventListener('click',closeModal);
 $('#deviceModal').addEventListener('click',e=>{if(e.target.id==='deviceModal')closeModal()});
 $('#modalPing').addEventListener('click',e=>runPing(e.currentTarget.dataset.device));
 $('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
 $$('.nav-link').forEach(a=>a.addEventListener('click',()=>{$$('.nav-link').forEach(x=>x.classList.remove('active'));a.classList.add('active');$('#sidebar').classList.remove('open')}));
 setInterval(()=>{$('#sidebarTime').textContent=timeNow()},30000);
}
document.addEventListener('DOMContentLoaded',init);
