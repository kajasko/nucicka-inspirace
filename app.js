(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// Scroll only the horizontal strip that contains el (never the page). Element.scrollIntoView() in Safari also scrolled the document, yanking the page back while the user scrolled.
function hscroll(el){const c=el.closest('.thumbs');if(!c)return;const l=el.offsetLeft-c.offsetLeft,r=l+el.offsetWidth;if(l<c.scrollLeft+8||r>c.scrollLeft+c.clientWidth-8)c.scrollTo({left:Math.max(0,l-(c.clientWidth-el.offsetWidth)/2),behavior:'smooth'})}
// sticky bar shadow
const top=$('.top');const onS=()=>top&&top.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',onS,{passive:true});onS();
// image fade-in (blur-up placeholder is the button background)
// one big photo per flat; thumbnails swap it
function setMain(v,b){const m=v.querySelector('.main'),im=m.querySelector('img'),th=[...v.querySelectorAll('.thumbs .ph')],k=th.indexOf(b),plan=b.dataset.plan==='1';
 th.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));m.dataset.i=k;
 m.querySelector('.count').textContent=(k+1)+' / '+th.length;m.querySelector('.badge').hidden=!plan;m.classList.toggle('plan',plan);
 const alt=b.getAttribute('aria-label').replace(/^Zobrazit: /,'');m.setAttribute('aria-label','Otevřít na celou obrazovku: '+alt);
 const pre=new Image();pre.src=b.dataset.m;im.classList.add('swap');
 const go=()=>{im.removeAttribute('srcset');im.src=b.dataset.m;im.srcset=b.dataset.s+' 440w, '+b.dataset.m+' '+b.dataset.mw+'w, '+b.dataset.full+' '+b.dataset.fw+'w';im.alt=alt;m.style.backgroundImage='none';requestAnimationFrame(()=>im.classList.remove('swap'))};
 if(pre.complete)go();else{pre.onload=go;pre.onerror=go}
 hscroll(b)}
// ---------- flat menu (Byty ▾) ----------
// Never use scrollIntoView here: in Safari it also moved the document and fought the user's scroll.
const fb=$('.fm-btn'),fp=$('#flatmenu'),fk=$('.fm-back');
if(fb&&fp){const items=$$('.fm-it',fp),dot=$('.fm-dot',fb),cur=$('.fm-cur',fb),mq=matchMedia('(max-width:767px)');let y0=0;
 const isOpen=()=>fb.getAttribute('aria-expanded')==='true';
 const place=()=>{if(mq.matches){fp.style.left='';fp.style.right='';fp.style.top='';return}const r=fb.getBoundingClientRect(),w=fp.offsetWidth,l=Math.max(12,Math.min(r.left,innerWidth-w-12));fp.style.left=l+'px';fp.style.right='auto';fp.style.top=(r.bottom+10)+'px'};
 function openM(){fp.hidden=false;fk.hidden=false;fb.setAttribute('aria-expanded','true');place();y0=scrollY;fp.scrollTop=0;
  const a=$('.fm-it[aria-current="true"]',fp)||items[0];a&&a.focus({preventScroll:true})}
 function closeM(focus){if(!isOpen())return;fp.hidden=true;fk.hidden=true;fb.setAttribute('aria-expanded','false');if(focus)fb.focus({preventScroll:true})}
 fb.addEventListener('click',()=>isOpen()?closeM(false):openM());
 $('.fm-x',fp).addEventListener('click',()=>closeM(true));
 fk.addEventListener('click',()=>closeM(false));
 document.addEventListener('pointerdown',e=>{if(isOpen()&&!fp.contains(e.target)&&!fb.contains(e.target))closeM(false)});
 document.addEventListener('keydown',e=>{if(!isOpen())return;
  if(e.key==='Escape'){e.preventDefault();closeM(true)}
  else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const k=items.indexOf(document.activeElement),n=e.key==='ArrowDown'?(k+1)%items.length:(k-1+items.length)%items.length;items[n].focus({preventScroll:true})}
  else if(e.key==='Tab'){const f=[$('.fm-x',fp),...items].filter(x=>x.offsetParent!==null),a=f[0],z=f[f.length-1];
   if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus({preventScroll:true})}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus({preventScroll:true})}}});
 addEventListener('scroll',()=>{if(isOpen()&&Math.abs(scrollY-y0)>24)closeM(false)},{passive:true});
 addEventListener('resize',()=>{if(isOpen())place()},{passive:true});
 fp.addEventListener('click',e=>{const a=e.target.closest('.fm-it');if(!a)return;const t=document.getElementById(a.getAttribute('href').slice(1));if(!t)return;e.preventDefault();
  closeM(false);const hh=(top?top.offsetHeight:60)+12,y=t.getBoundingClientRect().top+scrollY-hh;
  const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;scrollTo({top:Math.max(0,y),behavior:rm?'auto':'smooth'});
  history.replaceState(null,'','#'+t.id);const h=$('h3',t);if(h){h.tabIndex=-1;h.focus({preventScroll:true})}});
 // current flat shown in the button (no scrolling of anything)
 if('IntersectionObserver'in window){const map=new Map(items.map(a=>[a.getAttribute('href').slice(1),a]));
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;const a=map.get(e.target.id);if(!a)return;
   items.forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','true');
   dot.textContent=$('.n',a).textContent;dot.style.background=getComputedStyle(a).getPropertyValue('--c');cur.textContent=$('.fm-nm',a).textContent;
   fb.setAttribute('aria-label','Byty – seznam bytů, právě: '+cur.textContent)})},{rootMargin:'-45% 0px -50% 0px'});
  $$('.flat').forEach(s=>io.observe(s));
  const hero=$('.hero');if(hero)new IntersectionObserver(es=>{if(es[0].isIntersecting){items.forEach(x=>x.removeAttribute('aria-current'));dot.textContent='';dot.style.background='';cur.textContent='';fb.removeAttribute('aria-label')}},{rootMargin:'-45% 0px -50% 0px'}).observe(hero)}
}

// ---------- lightbox ----------
const lb=$('#lb');if(!lb)return;
const img=$('.lb-img',lb),nm=$('.lb-name',lb),meta=$('.lb-meta',lb),dots=$('.lb-dots',lb),stage=$('.lb-stage',lb),track=$('.lb-track',lb);
let list=[],i=0,flat='',opener=null,cache={},token=0;
function pre(k){const b=list[k];if(!b)return;const u=b.dataset.full;if(!cache[u]){const p=new Image();p.decoding='async';p.src=u;cache[u]=p}}
function show(dir){const b=list[i],plan=b.dataset.plan==='1',u=b.dataset.full,my=++token;
 lb.classList.toggle('plan',plan);
 meta.textContent=(i+1)+' / '+list.length+(plan?' · půdorys':'');
 dots.innerHTML=list.length<=40?list.map((_,k)=>'<i class="'+(k===i?'on':'')+'"></i>').join(''):'';
 img.alt=b.getAttribute('aria-label').replace(/^Zobrazit: /,'');
 pre(i);const p=cache[u];const swap=()=>{if(my!==token)return;img.src=u;img.style.transform='';img.classList.remove('out');lb.classList.remove('loading')};
 img.classList.add('out');if(dir)img.style.transform='translateX('+(dir*-24)+'px)';
 const go=()=>setTimeout(swap,dir===0?0:120);
 if(p.complete&&p.naturalWidth)go();else{lb.classList.add('loading');p.addEventListener('load',go,{once:true});p.addEventListener('error',go,{once:true})}
 pre(i+1);pre(i-1);pre(i+2)}
function open(m){const v=m.closest('.viewer');list=$$('.thumbs .ph',v);i=+(m.dataset.i||0);const b=m;flat=b.closest('.flat').dataset.name;opener=b;nm.textContent=flat;
 img.removeAttribute('src');lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';
 show(0);$('.lb-close',lb).focus({preventScroll:true});history.pushState({lb:1},'')}
function close(fromPop){if(!lb.classList.contains('open'))return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';const v=opener&&opener.closest('.viewer');if(v&&list[i])setMain(v,list[i]);
 if(opener)opener.focus({preventScroll:true});if(!fromPop&&history.state&&history.state.lb)history.back()}
function step(d){if(list.length<2)return;i=(i+d+list.length)%list.length;show(d)}
document.addEventListener('click',e=>{const t=e.target.closest('.thumbs .ph');if(t){e.preventDefault();setMain(t.closest('.viewer'),t);return}const m=e.target.closest('.main');if(m){e.preventDefault();open(m)}});
$('.lb-close',lb).addEventListener('click',()=>close());
$('.lb-prev',lb).addEventListener('click',e=>{e.stopPropagation();step(-1)});
$('.lb-next',lb).addEventListener('click',e=>{e.stopPropagation();step(1)});
// tap outside the image closes
stage.addEventListener('click',e=>{if(moved)return;if(e.target===img){return}close()});
addEventListener('popstate',()=>close(true));
document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;
 if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='ArrowRight'){e.preventDefault();step(1)}else if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}
 else if(e.key==='Tab'){const f=$$('button',lb).filter(x=>x.offsetParent!==null);const a=f[0],z=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
// swipe with live drag feedback
let x0=null,y0=0,dx=0,moved=false;
stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;x0=e.clientX;y0=e.clientY;dx=0;moved=false;img.style.transition='none'});
stage.addEventListener('pointermove',e=>{if(x0===null)return;dx=e.clientX-x0;if(Math.abs(dx)>8)moved=true;img.style.transform='translateX('+dx+'px)';img.style.opacity=String(1-Math.min(Math.abs(dx)/600,.5))});
const end=e=>{if(x0===null)return;const dy=e.clientY-y0;img.style.transition='';img.style.opacity='';x0=null;
 if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);else if(dy>110&&Math.abs(dy)>Math.abs(dx)*1.5)close();else img.style.transform='';
 setTimeout(()=>moved=false,50)};
stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
})();
