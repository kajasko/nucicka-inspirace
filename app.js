(()=>{const lb=document.getElementById('lb'),img=lb.querySelector('img'),cap=lb.querySelector('figcaption');let s=0,i=0;
function show(){const p=G[s][i];img.src=p.f;lb.classList.toggle('plan',p.p);cap.textContent=(p.p?'Půdorys · ':'')+(i+1)+' / '+G[s].length;
 [i-1,i+1].forEach(k=>{if(G[s][k]){const im=new Image();im.src=G[s][k].f}})}
function open(a,b){s=a;i=b;lb.hidden=false;document.body.style.overflow='hidden';show();history.pushState({lb:1},'')}
function close(){if(lb.hidden)return;lb.hidden=true;document.body.style.overflow='';img.src=''}
function go(d){i=(i+d+G[s].length)%G[s].length;show()}
document.querySelectorAll('.ph').forEach(b=>b.addEventListener('click',()=>open(+b.dataset.s,+b.dataset.i)));
lb.querySelector('.x').onclick=()=>history.back();lb.querySelector('.pv').onclick=e=>{e.stopPropagation();go(-1)};lb.querySelector('.nx').onclick=e=>{e.stopPropagation();go(1)};
lb.addEventListener('click',e=>{if(e.target===lb)history.back()});
addEventListener('popstate',close);
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')history.back();if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1)});
let x0=null,y0=0;lb.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
lb.addEventListener('touchmove',e=>{if(x0===null)return;img.style.transform='translateX('+(e.touches[0].clientX-x0)+'px)'},{passive:true});
lb.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;img.style.transform='';
 if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))go(dx<0?1:-1);else if(dy>120)history.back();x0=null});
})();
