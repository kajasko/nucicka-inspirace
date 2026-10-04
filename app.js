(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// sticky bar shadow
const top=$('.top');const onS=()=>top&&top.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',onS,{passive:true});onS();
// image fade-in (blur-up placeholder is the button background)
$$('.ph img').forEach(im=>{const ok=()=>im.classList.add('ld');if(im.complete&&im.naturalWidth)ok();else im.addEventListener('load',ok,{once:true})});
// active chip while scrolling
const chips=$$('.chips-nav a[href^="#"]');
if(chips.length&&'IntersectionObserver'in window){const map=new Map(chips.map(a=>[a.getAttribute('href').slice(1),a]));
 const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){chips.forEach(c=>c.classList.remove('on'));const a=map.get(e.target.id);if(a){a.classList.add('on');a.scrollIntoView({block:'nearest',inline:'nearest'})}}})},{rootMargin:'-45% 0px -50% 0px'});
 $$('.flat').forEach(s=>io.observe(s))}

// ---------- lightbox ----------
const lb=$('#lb');if(!lb)return;
const img=$('.lb-img',lb),nm=$('.lb-name',lb),meta=$('.lb-meta',lb),dots=$('.lb-dots',lb),stage=$('.lb-stage',lb),track=$('.lb-track',lb);
let list=[],i=0,flat='',opener=null,cache={},token=0;
function pre(k){const b=list[k];if(!b)return;const u=b.dataset.full;if(!cache[u]){const p=new Image();p.decoding='async';p.src=u;cache[u]=p}}
function show(dir){const b=list[i],plan=b.closest('li').classList.contains('plan'),u=b.dataset.full,my=++token;
 lb.classList.toggle('plan',plan);
 meta.textContent=(i+1)+' / '+list.length+(plan?' · půdorys':'');
 dots.innerHTML=list.length<=40?list.map((_,k)=>'<i class="'+(k===i?'on':'')+'"></i>').join(''):'';
 img.alt=b.querySelector('img').alt;
 pre(i);const p=cache[u];const swap=()=>{if(my!==token)return;img.src=u;img.style.transform='';img.classList.remove('out');lb.classList.remove('loading')};
 img.classList.add('out');if(dir)img.style.transform='translateX('+(dir*-24)+'px)';
 const go=()=>setTimeout(swap,dir===0?0:120);
 if(p.complete&&p.naturalWidth)go();else{lb.classList.add('loading');p.addEventListener('load',go,{once:true});p.addEventListener('error',go,{once:true})}
 pre(i+1);pre(i-1);pre(i+2)}
function open(b){list=$$('.ph',b.closest('.grid'));i=list.indexOf(b);flat=b.closest('.flat').dataset.name;opener=b;nm.textContent=flat;
 img.removeAttribute('src');lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';
 show(0);$('.lb-close',lb).focus({preventScroll:true});history.pushState({lb:1},'')}
function close(fromPop){if(!lb.classList.contains('open'))return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';
 if(opener)opener.focus({preventScroll:true});if(!fromPop&&history.state&&history.state.lb)history.back()}
function step(d){if(list.length<2)return;i=(i+d+list.length)%list.length;show(d)}
document.addEventListener('click',e=>{const b=e.target.closest('.ph');if(b){e.preventDefault();open(b)}});
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
