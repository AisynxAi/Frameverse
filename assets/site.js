(function(){
const html=document.documentElement,body=document.body,$=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const PAGE=body.dataset.page||'home';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,hasG=!!(window.gsap&&window.ScrollTrigger),motion=hasG&&!reduced;
html.classList.add(motion?'has-motion':'no-motion');
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const pad=n=>String(n).padStart(2,'0');
const E='expo.out';
if(hasG)gsap.registerPlugin(ScrollTrigger);

/* ---------- split text into chars ---------- */
$$('[data-split]').forEach(el=>{const walk=n=>{[...n.childNodes].forEach(ch=>{if(ch.nodeType===3){const f=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.append(' ');return}const wd=document.createElement('span');wd.className='wd';[...w].forEach(c=>{const s=document.createElement('span');s.className='c';s.textContent=c;wd.append(s)});f.append(wd)});ch.replaceWith(f)}else if(ch.nodeType===1&&ch.tagName!=='BR')walk(ch)})};walk(el)});

/* ---------- header / nav ---------- */
const burger=$('.burger');let lenis=null;
if(burger){burger.addEventListener('click',()=>{const o=html.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');$('.mnav').setAttribute('aria-hidden',!o);lenis&&(o?lenis.stop():lenis.start())});
 $$('.mnav a').forEach(a=>a.addEventListener('click',()=>{html.classList.remove('menu-open');burger.setAttribute('aria-expanded',false);lenis&&lenis.start()}))}

/* ---------- luxury smooth scroll ---------- */
if(motion&&window.Lenis){lenis=new Lenis({lerp:.075,smoothWheel:true,wheelMultiplier:.9,touchMultiplier:1.4});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
const scrollToT=(t)=>{if(lenis)lenis.scrollTo(t,{duration:1.8,easing:x=>1-Math.pow(1-x,4)});else if(t===0)scrollTo({top:0,behavior:'smooth'});else t.scrollIntoView({behavior:'smooth'})};
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=id==='#top'?0:document.querySelector(id);if(t===null)return;e.preventDefault();scrollToT(t)}));

/* ---------- page transitions ---------- */
const wipe=$('.page-wipe');
$$('a[href$=".html"],a[href*=".html#"]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||!motion||!wipe)return;const href=a.getAttribute('href');e.preventDefault();
 gsap.set(wipe,{display:'grid',yPercent:100});gsap.to(wipe,{yPercent:0,duration:.7,ease:'expo.inOut',onComplete:()=>{location.href=href}})}));
addEventListener('pageshow',e=>{if(e.persisted&&wipe)gsap.set(wipe,{display:'none'})});

/* ---------- cursor / spotlight / tilt ---------- */
if(fine){body.classList.add('cur-on');const ring=$('.cur-ring'),dot=$('.cur-dot'),lbl=ring.querySelector('span');let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
 addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px)`});
 (function l(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(l)})();
 document.addEventListener('mouseover',e=>{const c=e.target.closest('[data-cursor]'),l=e.target.closest('a,button,input,textarea,label');const lab=c&&!l?c:null;ring.classList.toggle('lab',!!lab);if(lab)lbl.textContent=lab.dataset.cursor;ring.classList.toggle('link',!lab&&!!l);dot.style.opacity=lab?0:1});
 $$('.stc,.pc,#ctacard,#svcmedia,.srow-media,.tcard,.ctab').forEach(el=>el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')}));
 if(!reduced)$$('[data-tilt]').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1000px) rotateY(${x*7}deg) rotateX(${-y*7}deg)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
}

/* ---------- FAQ + philosophy accordions ---------- */
$$('.qa button').forEach(b=>b.addEventListener('click',()=>{const q=b.parentElement,o=!q.classList.contains('open');$$('.qa',q.parentElement).forEach(x=>{x.classList.remove('open');x.querySelector('button').setAttribute('aria-expanded','false')});if(o){q.classList.add('open');b.setAttribute('aria-expanded','true')}setTimeout(()=>hasG&&ScrollTrigger.refresh(),550)}));
$$('.phil button').forEach(b=>b.addEventListener('click',()=>{const p=b.parentElement,o=p.classList.toggle('open');b.setAttribute('aria-expanded',o);setTimeout(()=>hasG&&ScrollTrigger.refresh(),550)}));

/* ---------- form ---------- */
const form=$('#form');
if(form){const mail=$('#f-e'),mf=$('#mailf'),re=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 form.addEventListener('submit',e=>{e.preventDefault();const ok=re.test(mail.value.trim());mf.classList.toggle('bad',!ok);if(!ok){mail.focus();return}form.classList.add('sent');const b=form.querySelector('.send');b.disabled=true;b.style.opacity=.6});
 mail.addEventListener('input',()=>{if(mf.classList.contains('bad'))mf.classList.toggle('bad',!re.test(mail.value.trim()))});
 $('#f-m').addEventListener('input',e=>{e.target.style.height='auto';e.target.style.height=e.target.scrollHeight+'px'})}

/* ---------- footer wordmark fit ---------- */
const fm=$('#ftrmark');
function fitMark(){if(!fm)return;fm.style.fontSize='100px';const k=fm.children,w=k[k.length-1].getBoundingClientRect().right-k[0].getBoundingClientRect().left;const cs=getComputedStyle(fm);fm.style.fontSize=(100*(fm.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight))*.98/w)+'px'}
fitMark();addEventListener('resize',fitMark);document.fonts&&document.fonts.ready.then(()=>{fitMark();hasG&&ScrollTrigger.refresh()});

/* ---------- generic slider helper (track of cards, arrows, drag) ---------- */
function slider(track,prev,next,onChange){const items=[...track.children];let i=0;
 const per=()=>{const w=items[0].getBoundingClientRect().width;return Math.max(1,Math.round(track.parentElement.clientWidth/(w+1)))};
 const max=()=>Math.max(0,items.length-per());
 const go=(n,anim=true)=>{i=Math.max(0,Math.min(max(),n));const gap=parseFloat(getComputedStyle(track).columnGap)||0;const x=-(items[0].getBoundingClientRect().width+gap)*i;
  if(window.gsap)gsap.to(track,{x,duration:anim?1:0,ease:E});else track.style.transform=`translateX(${x}px)`;
  if(prev)prev.disabled=i===0;if(next)next.disabled=i>=max();onChange&&onChange(i,max())};
 prev&&prev.addEventListener('click',()=>go(i-1));next&&next.addEventListener('click',()=>go(i+1));
 let d=null;track.addEventListener('pointerdown',e=>{d={x:e.clientX,b:window.gsap?gsap.getProperty(track,'x'):0}});
 addEventListener('pointermove',e=>{if(!d)return;if(window.gsap)gsap.set(track,{x:d.b+(e.clientX-d.x)})});
 addEventListener('pointerup',e=>{if(!d)return;const dx=e.clientX-d.x;d=null;go(Math.abs(dx)>60?i+(dx<0?1:-1):i)});
 addEventListener('resize',()=>go(i,false));go(0,false);return{go,get i(){return i}}}

/* ---------- gallery helper (clip wipe between stacked .sl) ---------- */
function gallery(root,prev,next,counter){const sl=$$('.sl',root);let i=0,busy=false;
 const H='inset(0% 0% 0% 100%)',S='inset(0% 0% 0% 0%)';
 sl.forEach((s,j)=>{s.style.clipPath=j?H:S;s.style.zIndex=j?0:1});
 const show=(n,dir)=>{if(busy)return;const p=i;i=(n+sl.length)%sl.length;if(p===i)return;
  sl.forEach((s,j)=>s.style.zIndex=j===i?2:j===p?1:0);
  if(window.gsap&&!reduced){busy=true;gsap.fromTo(sl[i],{clipPath:dir>0?H:'inset(0% 100% 0% 0%)'},{clipPath:S,duration:.9,ease:'expo.inOut',onComplete:()=>{sl[p].style.clipPath=H;busy=false}});gsap.fromTo(sl[i].querySelector('img'),{scale:1.25},{scale:1,duration:1.3,ease:E})}
  else{sl[i].style.clipPath=S;sl[p].style.clipPath=H}
  if(counter)counter.textContent=`${pad(i+1)} / ${pad(sl.length)}`};
 prev&&prev.addEventListener('click',()=>show(i-1,-1));next&&next.addEventListener('click',()=>show(i+1,1));if(counter)counter.textContent=`01 / ${pad(sl.length)}`;return show}

/* ================= PAGE: HOME (non-motion parts) ================= */
let svcST=null,setSvc=null,sCur=0;
if(PAGE==='home'){
 const sSlides=$$('#svcmedia .sl'),sItems=$$('.svc-item'),sDots=$$('#svcdots button');
 setSvc=function(i,dir=1){if(i===sCur)return;const prev=sCur;sCur=i;sDots.forEach((d,j)=>d.classList.toggle('on',j===i));
  if(window.gsap&&!reduced){gsap.set(sSlides[i],{zIndex:2});gsap.set(sSlides[prev],{zIndex:1});
   gsap.fromTo(sSlides[i],{clipPath:dir>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0%)',duration:1,ease:'expo.inOut'});
   gsap.fromTo(sSlides[i].querySelector('img'),{scale:1.35},{scale:1.12,duration:1.4,ease:E});
   gsap.to(sItems[prev],{autoAlpha:0,y:-24*dir,duration:.4,ease:'power2.in'});
   gsap.fromTo(sItems[i],{autoAlpha:0,y:32*dir},{autoAlpha:1,y:0,duration:.8,delay:.2,ease:E});
   gsap.fromTo(sItems[i].querySelectorAll('.ch'),{yPercent:110,opacity:0},{yPercent:0,opacity:1,stagger:.018,duration:.8,delay:.2,ease:E});
   gsap.fromTo(sItems[i].querySelectorAll('.svc-tags span'),{y:16,opacity:0},{y:0,opacity:1,stagger:.05,duration:.6,delay:.4,ease:E})}
  else{sSlides.forEach((s,j)=>s.style.clipPath=j===i?'inset(0 0 0 0)':'inset(0 0 0 100%)');sItems.forEach((it,j)=>{it.style.visibility=j===i?'visible':'hidden';it.style.opacity=j===i?1:0})}};
 sItems.forEach((it,j)=>{if(j){it.style.visibility='hidden';it.style.opacity=0}});
 sDots.forEach((d,j)=>d.addEventListener('click',()=>{if(svcST){const y=svcST.start+(svcST.end-svcST.start)*((j+.5)/sDots.length);lenis?lenis.scrollTo(y,{duration:1.4}):scrollTo(0,y)}else setSvc(j,j>sCur?1:-1)}));
 const wks=$$('.wk'),wkn=$('#wkn'),sc=$('.wk-scroller');
 sc&&sc.addEventListener('scroll',()=>{if(innerWidth>=1024)return;const p=sc.scrollLeft/Math.max(1,sc.scrollWidth-sc.clientWidth);$('#wbar').style.transform=`scaleX(${p})`;wkn.textContent=pad(Math.min(wks.length,Math.round(p*(wks.length-1))+1))},{passive:true});
}

/* ================= PAGE: SERVICES (non-motion parts) ================= */
if(PAGE==='services'){
 /* testimonials */
 const T=JSON.parse($('#tdata').textContent);let ti=0;const tc=$$('.tcard'),dots=$$('.tdots button');
 const renderT=(n,dir=1)=>{ti=(n+T.length)%T.length;const set=T[ti];
  const apply=()=>{tc.forEach((c,k)=>{const d=set.cards[k];c.querySelector('.q').textContent=d.q;c.querySelector('.by img').src=d.img;c.querySelector('.by b').textContent=d.name;c.querySelector('.by span').textContent=d.role});
   $('.tmeta .who b').textContent=set.video.name;$('.tmeta .who span').textContent=set.video.role;$('.tmeta .tm').textContent=set.video.time;dots.forEach((d,k)=>d.classList.toggle('on',k===ti))};
  if(window.gsap&&!reduced){gsap.to(tc,{opacity:0,x:-40*dir,duration:.35,stagger:.05,ease:'power2.in',onComplete:()=>{apply();gsap.fromTo(tc,{opacity:0,x:50*dir},{opacity:1,x:0,duration:.8,stagger:.08,ease:E})}});gsap.fromTo('.tvid img',{scale:1.15},{scale:1,duration:1.2,ease:E})}else apply()};
 $('#tprev').addEventListener('click',()=>renderT(ti-1,-1));$('#tnext').addEventListener('click',()=>renderT(ti+1,1));dots.forEach((d,k)=>d.addEventListener('click',()=>renderT(k,k>ti?1:-1)));
 /* fake player */
 const tv=$('.tvid'),bar=$('.tbar i'),knob=$('.tbar b');let playing=false,prog=.3,raf=null,last=0;
 const setP=p=>{prog=Math.max(0,Math.min(1,p));bar.style.width=prog*100+'%';knob.style.left=prog*100+'%';const s=Math.round(prog*154);$('.tmeta .tm').textContent=`${pad(Math.floor(s/60))}:${pad(s%60)}`};
 const loop=t=>{if(!playing)return;if(last)setP(prog+(t-last)/154000);last=t;if(prog>=1){toggle(false);setP(0)}raf=requestAnimationFrame(loop)};
 const toggle=on=>{playing=on;tv.classList.toggle('playing',on);last=0;$$('[data-pi]').forEach(b=>b.innerHTML=on?'<svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor"><rect x="1" y="1" width="5" height="16"/><rect x="10" y="1" width="5" height="16"/></svg>':'<svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor"><path d="M1 1v16l14-8z"/></svg>');if(on)raf=requestAnimationFrame(loop)};
 $$('[data-pi]').forEach(b=>b.addEventListener('click',()=>toggle(!playing)));
 $('.tbar').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();setP((e.clientX-r.left)/r.width)});setP(.3);
 /* blog pager */
 const B=JSON.parse($('#bdata').textContent),bc=$$('.bcard'),pb=$$('.pager [data-p]');let bp=0;
 const renderB=(n)=>{if(n<0||n>2||n===bp)return;const dir=n>bp?1:-1;bp=n;
  const apply=()=>{bc.forEach((c,k)=>{const d=B[bp*3+k];c.querySelector('img').src=d.img;c.querySelector('.bmeta').textContent=d.meta;c.querySelector('h3').textContent=d.t});pb.forEach((b,k)=>b.classList.toggle('on',k===bp));$('#bprev').disabled=bp===0;$('#bnext').disabled=bp===2};
  if(window.gsap&&!reduced){gsap.to(bc,{opacity:0,y:30,rotateX:-12,duration:.35,stagger:.06,ease:'power2.in',onComplete:()=>{apply();gsap.fromTo(bc,{opacity:0,y:-30,rotateX:12},{opacity:1,y:0,rotateX:0,duration:.8,stagger:.08,ease:E})}})}else apply()};
 pb.forEach((b,k)=>b.addEventListener('click',()=>renderB(k)));$('#bprev').addEventListener('click',()=>renderB(bp-1));$('#bnext').addEventListener('click',()=>renderB(bp+1));
}

/* ================= PAGE: WORKS ================= */
if(PAGE==='works'){
 $$('.wp').forEach(w=>gallery($('.wp-media',w),$('[data-prev]',w),$('[data-next]',w),$('.cnt',w)));
 $$('.wfilter button').forEach(b=>b.addEventListener('click',()=>{$$('.wfilter button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;
  const show=$$('.wp').filter(w=>f==='all'||w.dataset.cat===f);
  if(window.gsap&&!reduced){gsap.to('.wp',{opacity:0,y:20,duration:.25,onComplete:()=>{$$('.wp').forEach(w=>w.classList.toggle('hide',!show.includes(w)));gsap.fromTo(show,{opacity:0,y:40,scale:.96},{opacity:1,y:0,scale:1,duration:.8,stagger:.08,ease:E});ScrollTrigger.refresh()}})}
  else $$('.wp').forEach(w=>w.classList.toggle('hide',!show.includes(w)))}));
}

/* ================= PAGE: ABOUT ================= */
let cfSet=null;
if(PAGE==='about'){
 /* coverflow */
 const cf=$('#cflow'),cards=$$('.cfc',cf),N=cards.length;let ci=Math.floor(N/2),drag=null;
 cfSet=(anim=true)=>{const w=cards[0].offsetWidth;cards.forEach((c,k)=>{let o=k-ci;if(o>N/2)o-=N;if(o<-N/2)o+=N;const a=Math.abs(o);
  const x=o===0?0:Math.sign(o)*(w*.62+ (a-1)*w*.5);const s=o===0?1:Math.max(.5,.78-(a-1)*.08);const ry=o===0?0:-Math.sign(o)*Math.min(38,22+a*6);const z=-a*120;
  const p={x:x-w/2,y:-c.offsetHeight/2,scale:s,rotationY:ry,z,zIndex:20-a,'--dim':a>3?1:a*.12,opacity:a>3?0:1};
  window.gsap?gsap.to(c,{...p,duration:anim?1:0,ease:E}):(c.style.transform=`translate(${p.x}px,${p.y}px) scale(${s}) rotateY(${ry}deg)`,c.style.zIndex=p.zIndex)});
  $('#cfn').textContent=`${pad(ci+1)} / ${pad(N)}`};
 const step=d=>{ci=(ci+d+N)%N;cfSet()};
 cards.forEach((c,k)=>c.addEventListener('click',()=>{if(drag&&drag.moved)return;ci=k;cfSet()}));
 cf.addEventListener('pointerdown',e=>{drag={x:e.clientX,moved:false}});
 addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>70){step(dx<0?1:-1);drag.x=e.clientX;drag.moved=true}});
 addEventListener('pointerup',()=>setTimeout(()=>drag=null,0));
 $('#cfprev').addEventListener('click',()=>step(-1));$('#cfnext').addEventListener('click',()=>step(1));
 addEventListener('resize',()=>cfSet(false));cfSet(false);
 let auto=setInterval(()=>step(1),3800);cf.addEventListener('mouseenter',()=>clearInterval(auto));cf.addEventListener('mouseleave',()=>{clearInterval(auto);auto=setInterval(()=>step(1),3800)});
 /* team slider */
 const tt=$('#tmtrack');slider(tt,$('#tmprev'),$('#tmnext'));
}

/* ---------- no-motion fallback ---------- */
if(!motion){$$('[data-count]').forEach(e=>e.textContent=e.dataset.count);const pr=$('#prail');if(pr)pr.style.transform='scaleX(1)';$$('.pc').forEach(p=>p.classList.add('on'));if(wipe)wipe.style.display='none';return}

/* ======================================================================
   MOTION
   ====================================================================== */
gsap.set('[data-h]',{opacity:0,y:36});

/* entry: loader on first home visit, quick wipe elsewhere */
let firstVisit=true;try{firstVisit=!sessionStorage.getItem('fv-seen');sessionStorage.setItem('fv-seen','1')}catch(e){}
const intro=gsap.timeline();
if(PAGE==='home'&&firstVisit&&$('.loader')){
 lenis&&lenis.stop();const n=$('.ld-n'),c={v:0};
 intro.to(c,{v:100,duration:1.6,ease:'power2.inOut',onUpdate:()=>n.textContent=Math.round(c.v)})
  .to('.loader .ld-bar',{scaleX:1,duration:1.6,ease:'power2.inOut'},0)
  .to('.loader .ld i:first-child',{x:-50,duration:.6,ease:'power3.in'},'-=.2').to('.loader .ld i:last-child',{x:50,duration:.6,ease:'power3.in'},'<')
  .to('.loader .ld-n',{scale:.6,opacity:0,duration:.5},'<')
  .to('.loader',{clipPath:'circle(0% at 50% 50%)',duration:1.1,ease:'expo.inOut'},'-=.2').set('.loader',{display:'none'})
  .add(()=>lenis&&lenis.start(),'-=.5');
 if(wipe)gsap.set(wipe,{display:'none'});
}else{
 $('.loader')&&gsap.set('.loader',{display:'none'});
 if(wipe)intro.to(wipe,{yPercent:-100,duration:.9,ease:'expo.inOut'}).set(wipe,{display:'none'});
}
intro.fromTo('.hdr',{yPercent:-160},{yPercent:0,duration:1.1,ease:E,clearProps:'transform,translate'},'-=.4');

/* generic reveals */
$$('.ln>span').forEach(s=>{if(s.closest('.hero'))return;gsap.to(s,{y:0,duration:1.3,ease:E,scrollTrigger:{trigger:s.parentElement,start:'top 90%'}})});
ScrollTrigger.batch('[data-r]',{start:'top 92%',onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:1.1,stagger:.08,ease:E})});
$$('.eb-logo .dash,.eb-line span').forEach(d=>gsap.from(d,{scaleX:0,duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:d,start:'top 92%'}}));
$$('[data-count]').forEach(e=>{if(e.closest('.hero'))return;const o={v:0};ScrollTrigger.create({trigger:e,start:'top 92%',once:true,onEnter:()=>gsap.to(o,{v:+e.dataset.count,duration:2,ease:'power3.out',onUpdate:()=>e.textContent=Math.round(o.v)})})});
/* split headings (non-hero) */
$$('[data-split]').forEach(el=>{if(el.dataset.split==='hero')return;gsap.to(el.querySelectorAll('.c'),{y:0,duration:1.1,stagger:.022,ease:E,scrollTrigger:{trigger:el,start:'top 90%'}})});

/* FAQ */
if($('.faq-top')){gsap.from('.faq-top .vr',{scaleY:0,duration:1.1,ease:'expo.inOut',scrollTrigger:{trigger:'.faq-top',start:'top 88%'}});
 gsap.fromTo('.qa',{x:-60,opacity:0},{x:0,opacity:1,stagger:.1,duration:1.2,ease:E,scrollTrigger:{trigger:'#faq',start:'top 88%'}})}
/* CTA banner */
$$('.ctab').forEach(c=>{const tl=gsap.timeline({scrollTrigger:{trigger:c,start:'top 88%'}});
 tl.fromTo(c,{clipPath:'inset(0 50% 0 50% round 24px)'},{clipPath:'inset(0 0% 0 0% round 24px)',duration:1.4,ease:'expo.inOut'})
   .from(c.querySelector('.k.tl'),{x:-30,y:-30,opacity:0,duration:1,ease:E},'-=.6').from(c.querySelector('.k.br'),{x:30,y:30,opacity:0,duration:1,ease:E},'<')
   .from(c.querySelector('.ctab-cam img'),{scale:1.4,opacity:0,duration:1.6,ease:E},'-=1.2');
 gsap.to(c.querySelector('.ctab-cam'),{yPercent:-8,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'bottom top',scrub:true}})});
/* contact block (home + contact page) */
if($('#ctcard')){gsap.fromTo('#ctcard',{y:60,opacity:0},{y:0,opacity:1,duration:1.4,ease:E,scrollTrigger:{trigger:'#ctcard',start:'top 90%'}});
 gsap.fromTo('.orbit .o1',{strokeDasharray:'0 3000'},{strokeDasharray:'3000 0',duration:2.4,ease:'power2.inOut',scrollTrigger:{trigger:'.ct-side',start:'top 80%'}});
 gsap.from('.orbit',{scale:.8,opacity:0,rotate:-20,duration:1.8,ease:E,scrollTrigger:{trigger:'.ct-side',start:'top 80%'}});
 gsap.from('.ct-side .dsh',{scaleX:0,duration:1.2,ease:'expo.inOut',scrollTrigger:{trigger:'.ct-side',start:'top 75%'}});
 gsap.from('.soc a',{y:24,opacity:0,rotate:-12,stagger:.07,duration:.9,ease:E,scrollTrigger:{trigger:'.soc',start:'top 94%'}})}
/* footer */
if(fm)gsap.from('#ftrmark>span',{yPercent:100,stagger:.06,duration:1.4,ease:E,scrollTrigger:{trigger:'#ftrmark',start:'top 96%'}});

const mm=gsap.matchMedia();

/* ================= HOME motion ================= */
if(PAGE==='home'){
 intro.fromTo('.big1 .c',{yPercent:120,rotate:8},{yPercent:0,rotate:0,duration:1.4,stagger:.05,ease:E},'-=.9')
  .fromTo('.big1 .dsh',{scaleX:0},{scaleX:1,duration:1.2,ease:E},'-=1.2')
  .fromTo('.big2',{clipPath:'inset(0 50% 0 50%)',opacity:0},{clipPath:'inset(0 0% 0 0%)',opacity:1,duration:1.6,ease:'expo.inOut'},'-=1.3')
  .fromTo('#cam',{yPercent:30,opacity:0,scale:.85},{yPercent:0,opacity:1,scale:1,duration:1.6,ease:E},'-=1.4')
  .to('.hero [data-h]',{opacity:1,y:0,duration:1.1,stagger:.1,ease:E},'-=1.1')
  .add(()=>$$('.hero [data-count]').forEach(e=>{const o={v:0};gsap.to(o,{v:+e.dataset.count,duration:2,ease:'power3.out',onUpdate:()=>e.textContent=Math.round(o.v)})}),'-=1');
 if(fine){const q1=gsap.quickTo('#big1','x',{duration:1.2,ease:'power3'}),q2=gsap.quickTo('#big2','x',{duration:1.2,ease:'power3'}),qc=gsap.quickTo('.cam img','x',{duration:1.2,ease:'power3'});
  $('.hero').addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5;q1(x*-36);q2(x*28);qc(x*14)})}
 mm.add('(min-width:1024px)',()=>{gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}})
  .to('.big1',{yPercent:-60,scale:1.08,opacity:.2,ease:'none'},0).to('.big2',{yPercent:-20,scale:1.15,opacity:0,ease:'none'},0)
  .to('#cam',{yPercent:-12,scale:1.25,ease:'none'},0).to('.hero-left',{x:-120,opacity:0,ease:'none'},0).to('.hero-stats',{x:120,opacity:0,ease:'none'},0)});
 gsap.fromTo('.about-img',{clipPath:'inset(0 0 0 100%)'},{clipPath:'inset(0 0 0 0%)',duration:1.8,ease:'expo.inOut',scrollTrigger:{trigger:'.about',start:'top 70%'}});
 gsap.fromTo('#aboutimg',{scale:1.3},{scale:1,duration:2.4,ease:E,scrollTrigger:{trigger:'.about',start:'top 70%'}});
 gsap.to('#aboutimg',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.about',start:'top bottom',end:'bottom top',scrub:true}});
 gsap.from('.about .cnr.tl',{x:-50,y:-50,opacity:0,duration:1.4,ease:E,scrollTrigger:{trigger:'.about',start:'top 65%'}});
 gsap.from('.about .cnr.br',{x:50,y:50,opacity:0,duration:1.4,ease:E,scrollTrigger:{trigger:'.about',start:'top 65%'}});
 const sItems=$$('.svc-item'),sDots=$$('#svcdots button'),pcs=$$('.pc'),track=$('#wtrack'),wks=$$('.wk'),wkn=$('#wkn');
 mm.add('(min-width:1024px)',()=>{
  svcST=ScrollTrigger.create({trigger:'#svcpin',start:'top top',end:()=>'+='+innerHeight*2.4,pin:true,scrub:true,anticipatePin:1,
   onUpdate:s=>{const k=Math.min(sItems.length-1,Math.floor(s.progress*sItems.length*.9999));if(k!==sCur)setSvc(k,k>sCur?1:-1);const local=(s.progress*sItems.length)%1;sDots.forEach((d,j)=>gsap.set(d.querySelector('i'),{scaleX:j<k?1:j===k?Math.max(.15,local):0}))}});
  gsap.set(pcs,{opacity:0,filter:'blur(16px)',scale:1.12,y:30});gsap.set($$('.pc .ic i'),{scale:2.2});
  const pt=gsap.timeline({scrollTrigger:{trigger:'#procpin',start:'top top',end:()=>'+='+innerHeight*1.8,pin:true,scrub:1,anticipatePin:1}});
  pt.to('#procimg',{scale:1.12,yPercent:-6,ease:'none',duration:4},0).to('#pdot',{opacity:1,duration:.1},0);
  pcs.forEach((p,i)=>{const t=i*.95+.1;pt.to('#prail',{scaleX:(i+.5)/4,ease:'none',duration:.95},t-.1).to('#pdot',{left:((i+.5)/4*100)+'%',ease:'none',duration:.95},t-.1)
   .to(p,{opacity:1,filter:'blur(0px)',scale:1,y:0,ease:'power3.out',duration:.7},t+.2).to(p.querySelectorAll('.ic i'),{scale:1,ease:'back.out(3)',duration:.5},t+.45)
   .fromTo(p.querySelector('.fl'),{opacity:0},{opacity:1,duration:.15,yoyo:true,repeat:1},t+.55).call(()=>pcs.forEach((x,j)=>x.classList.toggle('on',j===i)),null,t+.6)});
  pt.to('#prail',{scaleX:1,ease:'none',duration:.4}).to('#pdot',{left:'100%',ease:'none',duration:.4},'<');
  const dist=()=>track.scrollWidth-innerWidth;
  const ht=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'#wkpin',start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,invalidateOnRefresh:true,anticipatePin:1,
   onUpdate:s=>{gsap.set('#wbar',{scaleX:s.progress});wkn.textContent=pad(Math.min(wks.length,Math.round(s.progress*(wks.length-1))+1))}}});
  wks.forEach(w=>{gsap.fromTo(w.querySelector('img'),{xPercent:-5},{xPercent:5,ease:'none',scrollTrigger:{trigger:w,containerAnimation:ht,start:'left right',end:'right left',scrub:true}});
   gsap.fromTo(w,{rotate:3,y:40,opacity:.4},{rotate:0,y:0,opacity:1,ease:'none',scrollTrigger:{trigger:w,containerAnimation:ht,start:'left 100%',end:'left 60%',scrub:true}})});
  return()=>{svcST=null;gsap.set(pcs,{clearProps:'all'})}});
 mm.add('(max-width:1023px)',()=>{const t=setInterval(()=>setSvc((sCur+1)%sItems.length,1),4200);
  pcs.forEach(p=>gsap.fromTo(p,{opacity:0,filter:'blur(12px)',scale:1.08},{opacity:1,filter:'blur(0px)',scale:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:p,start:'top 88%',onEnter:()=>p.classList.add('on')}}));
  return()=>clearInterval(t)});
 gsap.from('#svcmedia',{rotationY:-14,x:-60,opacity:0,duration:1.6,ease:E,scrollTrigger:{trigger:'#svcmedia',start:'top 88%'}});
 gsap.from('.cl-band .gl',{scaleX:0,duration:1.8,ease:'expo.inOut',stagger:.15,scrollTrigger:{trigger:'.cl-band',start:'top 90%'}});
 gsap.from('.cl-mq',{x:i=>i?-120:120,opacity:0,duration:1.6,ease:E,stagger:.1,scrollTrigger:{trigger:'.cl-band',start:'top 90%'}});
 gsap.fromTo('#ctacard',{scale:.9,opacity:0,y:60},{scale:1,opacity:1,y:0,duration:1.5,ease:E,scrollTrigger:{trigger:'#ctacard',start:'top 90%'}});
 gsap.fromTo('#ctaimg',{scale:1.22},{scale:1,ease:'none',scrollTrigger:{trigger:'#ctacard',start:'top bottom',end:'bottom top',scrub:true}});
}

/* ================= PAGE HERO (services / contact) ================= */
if($('.phero')){
 intro.to('.phero [data-split="hero"] .c',{y:0,duration:1.2,stagger:.025,ease:E},'-=.6')
  .fromTo('.phero-img',{clipPath:'inset(0 0 0 100%)'},{clipPath:'inset(0 0 0 0%)',duration:1.6,ease:'expo.inOut'},'<')
  .fromTo('.phero-img img',{scale:1.3},{scale:1,duration:2.2,ease:E},'<')
  .to('.phero [data-h]',{opacity:1,y:0,duration:1,stagger:.1,ease:E},'-=1.4');
 gsap.to('.phero-img img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.phero',start:'top top',end:'bottom top',scrub:true}});
 gsap.to('.phero .inner',{yPercent:-30,opacity:0,ease:'none',scrollTrigger:{trigger:'.phero',start:'top top',end:'bottom top',scrub:true}});
}

/* ================= SERVICES motion ================= */
if(PAGE==='services'){
 $$('.srow').forEach((r,i)=>{const m=r.querySelector('.srow-media'),tl=gsap.timeline({scrollTrigger:{trigger:r,start:'top 78%'}});
  tl.fromTo(m,{clipPath:'inset(10% 100% 10% 0% round 32px)',rotationY:-12},{clipPath:'inset(0% 0% 0% 0% round 32px)',rotationY:0,duration:1.5,ease:'expo.inOut'})
    .fromTo(m.querySelector('img'),{scale:1.35},{scale:1,duration:2,ease:E},'<')
    .from(m.querySelector('.svc-play'),{scale:0,rotate:-90,duration:.9,ease:'back.out(2)'},'-=1')
    .from(r.querySelectorAll('.svc-tags span'),{y:24,opacity:0,scale:.8,stagger:.07,duration:.7,ease:'back.out(2)'},'-=1');
  gsap.fromTo(m.querySelector('img'),{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:r,start:'top bottom',end:'bottom top',scrub:true}})});
 gsap.from('.tvid',{x:-80,opacity:0,rotationY:10,duration:1.4,ease:E,scrollTrigger:{trigger:'.testi-grid',start:'top 85%'}});
 gsap.from('.tcard',{x:80,opacity:0,stagger:.12,duration:1.2,ease:E,scrollTrigger:{trigger:'.testi-grid',start:'top 85%'}});
 gsap.from('.tcard .stars svg',{scale:0,rotate:-90,stagger:.04,duration:.6,ease:'back.out(3)',scrollTrigger:{trigger:'.testi-grid',start:'top 75%'}});
 gsap.from('.bcard',{y:80,opacity:0,rotateX:-14,transformOrigin:'50% 0',stagger:.12,duration:1.3,ease:E,scrollTrigger:{trigger:'.blog-grid',start:'top 88%'}});
}

/* ================= WORKS motion ================= */
if(PAGE==='works'){
 const wc=$$('.wc'),ang=[20,10,0,-10,-20],zz=[-40,-110,-150,-110,-40];
 const rest=i=>({rotationY:ang[i],z:zz[i],y:0,opacity:1,scale:1});
 gsap.set(wc,{rotationY:0,z:-600,y:120,opacity:0,scale:.7});
 intro.to('.whero [data-split="hero"] .c',{y:0,duration:1.3,stagger:.06,ease:E},'-=.6');
 wc.forEach((c,i)=>intro.to(c,{...rest(i),duration:1.5,ease:E},`-=${i?1.38:1}`));
 intro.to('.whero [data-h]',{opacity:1,y:0,duration:1,ease:E},'-=1');
 if(fine){const row=$('.wrow');const qr=gsap.quickTo(row,'rotationY',{duration:1.2,ease:'power3'}),qx=gsap.quickTo(row,'rotationX',{duration:1.2,ease:'power3'});
  $('.whero').addEventListener('mousemove',e=>{qr((e.clientX/innerWidth-.5)*10);qx(-(e.clientY/innerHeight-.5)*6)});
  wc.forEach((c,i)=>{c.addEventListener('mouseenter',()=>gsap.to(c,{rotationY:0,z:60,scale:1.06,duration:.7,ease:E}));c.addEventListener('mouseleave',()=>gsap.to(c,{...rest(i),duration:.9,ease:E}))})}
 mm.add('(min-width:768px)',()=>{gsap.timeline({scrollTrigger:{trigger:'.whero',start:'top top',end:'bottom top',scrub:true}})
  .to('.whero .display',{scale:1.25,opacity:0,filter:'blur(10px)',ease:'none'},0)
  .to(wc,{x:(i)=>(i-2)*90,y:(i)=>Math.abs(i-2)*-30,ease:'none'},0)});
 gsap.from('.wfilter button',{y:20,opacity:0,stagger:.06,duration:.8,ease:E,scrollTrigger:{trigger:'.wfilter',start:'top 92%'}});
 $$('.wp').forEach((w,i)=>{gsap.fromTo(w,{y:100,opacity:0,rotate:i%2?2:-2},{y:0,opacity:1,rotate:0,duration:1.4,ease:E,scrollTrigger:{trigger:w,start:'top 92%'}});
  gsap.fromTo($('.wp-media',w),{clipPath:'inset(0 0 100% 0 round 22px)'},{clipPath:'inset(0 0 0% 0 round 22px)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:w,start:'top 88%'}})});
}

/* ================= ABOUT motion ================= */
if(PAGE==='about'){
 const fl=$('.film svg path.band');const L=fl?fl.getTotalLength():0;
 if(fl){$$('.film svg path').forEach(p=>{if(p.classList.contains('holes'))return;gsap.set(p,{strokeDasharray:L,strokeDashoffset:L})});
  intro.to('.film svg path:not(.holes)',{strokeDashoffset:0,duration:2.2,ease:'expo.inOut'},'-=.6').fromTo('.film svg path.holes',{opacity:0},{opacity:1,duration:.8},'-=.8')}
 intro.to('.ahero [data-split="hero"] .c',{y:0,duration:1.2,stagger:.02,ease:E},'-=2')
  .to('.ahero [data-h]',{opacity:1,y:0,duration:1,stagger:.12,ease:E},'-=1');
 gsap.to('.film',{rotate:-8,ease:'sine.inOut',duration:7,yoyo:true,repeat:-1});
 gsap.to('.film',{yPercent:-30,scale:1.15,ease:'none',scrollTrigger:{trigger:'.ahero',start:'top top',end:'bottom top',scrub:true}});
 gsap.to('.ahero .inner',{yPercent:-40,opacity:0,ease:'none',scrollTrigger:{trigger:'.ahero',start:'top top',end:'bottom top',scrub:true}});
 /* coverflow entrance: fan out from the centre */
 const cards=$$('.cfc');gsap.set(cards,{opacity:0});
 ScrollTrigger.create({trigger:'#cflow',start:'top 80%',once:true,onEnter:()=>{gsap.fromTo(cards,{x:i=>-cards[0].offsetWidth/2,y:i=>-cards[0].offsetHeight/2,rotationY:0,scale:.6,z:-400,opacity:0},{opacity:1,scale:.6,duration:.4,onComplete:()=>cfSet(true)})}});
 gsap.from('.ab-grid .vr',{scaleY:0,duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:'.ab-grid',start:'top 80%'}});
 gsap.from('.ab-stats>div',{y:40,opacity:0,stagger:.1,duration:1,ease:E,scrollTrigger:{trigger:'.ab-stats',start:'top 85%'}});
 gsap.from('.lg',{y:30,opacity:0,stagger:.08,duration:1,ease:E,scrollTrigger:{trigger:'.logos',start:'top 92%'}});
 gsap.from('.vmc',{y:80,opacity:0,rotateX:-10,transformOrigin:'50% 100%',stagger:.15,duration:1.3,ease:E,scrollTrigger:{trigger:'.vm',start:'top 85%'}});
 gsap.from('.phil',{y:40,opacity:0,duration:1.1,ease:E,scrollTrigger:{trigger:'.phil',start:'top 94%'}});
 $$('.vmc .bg img').forEach(im=>gsap.fromTo(im,{yPercent:-6,scale:1.1},{yPercent:6,scale:1.1,ease:'none',scrollTrigger:{trigger:im.closest('.vmc'),start:'top bottom',end:'bottom top',scrub:true}}));
 gsap.from('.tmc',{x:160,opacity:0,rotate:3,stagger:.12,duration:1.3,ease:E,scrollTrigger:{trigger:'.tm-view',start:'top 88%'}});
}

/* ================= CONTACT motion ================= */
if(PAGE==='contact'){gsap.from('.ci',{y:30,opacity:0,stagger:.1,duration:1,ease:E,scrollTrigger:{trigger:'.ct-info',start:'top 95%'}})}

/* jump to hash after pins exist */
addEventListener('load',()=>{ScrollTrigger.refresh();if(location.hash&&location.hash.length>1){const t=document.querySelector(location.hash);if(t)setTimeout(()=>scrollToT(t),400)}});
})();
