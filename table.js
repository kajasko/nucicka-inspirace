(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const top=$('.top');const onS=()=>top&&top.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',onS,{passive:true});onS();
const tb=$('tbody'),rows=$$('tbody tr'),ths=$$('th[data-k]');let key=null,dir=1;
const num=(r,k)=>{const v=r.dataset[k];return v===''||v===undefined?null:+v};
function sort(k,d){key=k;dir=d;
 rows.slice().sort((a,b)=>{if(k!=='m'){const t=a.dataset.t.localeCompare(b.dataset.t);if(t)return t}
  const x=num(a,k),y=num(b,k);if(x===null&&y===null)return a.dataset.o-b.dataset.o;if(x===null)return 1;if(y===null)return -1;return (x-y)*d||a.dataset.o-b.dataset.o}).forEach(r=>tb.appendChild(r));
 ths.forEach(t=>t.dataset.k===k?t.setAttribute('aria-sort',d>0?'ascending':'descending'):t.removeAttribute('aria-sort'))}
ths.forEach(t=>$('button',t).addEventListener('click',()=>sort(t.dataset.k,key===t.dataset.k?-dir:1)));
})();
