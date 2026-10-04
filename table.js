(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const top=$('.top');const onS=()=>top&&top.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',onS,{passive:true});onS();
const tb=$('tbody'),rows=$$('tbody tr'),ths=$$('th[data-k]'),sel=$$('.seg.sort button'),fil=$$('.seg.filter button'),live=$('#live');
let key=null,dir=1;
function num(r,k){const v=r.dataset[k];return v===''||v===undefined?null:+v}
function sort(k,d){key=k;dir=d;
 const s=rows.slice().sort((a,b)=>{if(!k)return a.dataset.o-b.dataset.o;if(k!=='m'){const t=a.dataset.t.localeCompare(b.dataset.t);if(t)return t}const x=num(a,k),y=num(b,k);if(x===null&&y===null)return a.dataset.o-b.dataset.o;if(x===null)return 1;if(y===null)return -1;return (x-y)*d||a.dataset.o-b.dataset.o});
 s.forEach(r=>tb.appendChild(r));
 ths.forEach(t=>{if(t.dataset.k===k)t.setAttribute('aria-sort',d>0?'ascending':'descending');else t.removeAttribute('aria-sort')});
 sel.forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.k||null)===k&&(!k||+b.dataset.d===d))));
 if(live)live.textContent=k?('Seřazeno: '+({p:'cena',m:'plocha',pm:'cena za m²'})[k]+(d>0?' vzestupně':' sestupně')):'Výchozí pořadí'}
ths.forEach(t=>$('button',t).addEventListener('click',()=>sort(t.dataset.k,key===t.dataset.k?-dir:1)));
sel.forEach(b=>b.addEventListener('click',()=>sort(b.dataset.k||null,+b.dataset.d||1)));
fil.forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.f;fil.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 rows.forEach(r=>r.classList.toggle('hide',!(f==='all'||r.dataset.t===f||(f==='conv'&&r.dataset.c==='1'))))}));
})();
