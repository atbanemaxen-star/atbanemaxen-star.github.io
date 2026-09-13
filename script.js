const body=document.body;
const preloader=document.getElementById('preloader');
const loadPct=document.getElementById('loadPct');
const loadBar=document.getElementById('loadBar');
let loaderProgress=0;
const loader=setInterval(()=>{
  loaderProgress=Math.min(100,loaderProgress+Math.ceil((100-loaderProgress)*.13));
  loadPct.textContent=String(loaderProgress).padStart(3,'0')+'%';
  loadBar.style.width=loaderProgress+'%';
  if(loaderProgress>=100){clearInterval(loader);setTimeout(()=>{preloader.classList.add('done');body.classList.remove('is-loading')},350)}
},35);

const cursor=document.getElementById('cursor');const ring=document.getElementById('cursorRing');let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
(function loop(){rx+=(mx-rx)*.17;ry+=(my-ry)*.17;cursor.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
function bindCursor(){document.querySelectorAll('.interactive,[data-cursor]').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.classList.add('active');body.classList.add('cursor-hover');cursor.querySelector('span').textContent=el.dataset.cursor||''});el.addEventListener('mouseleave',()=>{ring.classList.remove('active');body.classList.remove('cursor-hover');cursor.querySelector('span').textContent=''})})}bindCursor();

const sections=[...document.querySelectorAll('.sequence')],nodes=[...document.querySelectorAll('.tl-node')],progress=document.getElementById('timelineProgress'),timecode=document.getElementById('timecode');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function sectionProgress(el){const r=el.getBoundingClientRect();return clamp((innerHeight-r.top)/(innerHeight+r.height),0,1)}
function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;const global=max?scrollY/max:0;progress.style.width=(global*100)+'%';
  const total=Math.round(global*2760),mm=String(Math.floor(total/60)).padStart(2,'0'),ss=String(total%60).padStart(2,'0');timecode.textContent=`00:${mm}:${ss}`;
  const mid=scrollY+innerHeight*.4;let active=sections.reduce((best,s)=>{const d=Math.abs(s.offsetTop+s.offsetHeight*.35-mid);return d<best.d?{s,d}:best},{s:sections[0],d:1e9}).s;nodes.forEach(n=>n.classList.toggle('active',n.dataset.target===active.id));
  const intro=document.getElementById('intro');const ir=intro.getBoundingClientRect();const ip=clamp(-ir.top/innerHeight,0,1);const maxen=intro.querySelector('.maxen-word');maxen.style.transform=`scale(${1.02+ip*.24}) skewX(${ip*2}deg) rotate(${ip*.5}deg)`;
  const design=document.getElementById('design');if(design){const p=sectionProgress(design);design.querySelectorAll('.design-card').forEach((card,i)=>{const base=((i%3)-1)*8;const depth=(i%4)*10;const drift=(p-.5)*(i%2?-65:65);const rot=(i%2?-1:1)*(3+(i%4));card.style.transform=`translate3d(0,${drift+base}px,${120+depth}px) rotate(${rot}deg)`})}
  const web=document.getElementById('web');if(web){const p=sectionProgress(web);web.querySelector('.web-bg-word').style.transform=`translate3d(0,${(p-.5)*120}px,0)`;web.querySelector('.browser-shell').style.transform=`perspective(1200px) rotateX(${(p-.5)*3}deg) rotateY(${(p-.5)*4}deg) translateY(${(p-.5)*18}px)`}
  const motion=document.getElementById('motion');if(motion){const p=sectionProgress(motion);motion.querySelector('.motion-type-1').style.transform=`translate3d(${(p-.5)*180}px,${(p-.5)*-60}px,0) rotate(${(p-.5)*4}deg)`;motion.querySelector('.motion-type-2').style.transform=`translate3d(${(p-.5)*-240}px,${(p-.5)*70}px,0) rotate(${(p-.5)*-3}deg)`;motion.querySelector('.motion-type-3').style.transform=`translate3d(${(p-.5)*150}px,${(p-.5)*-40}px,0)`;motion.querySelector('.motion-orbit').style.transform=`rotate(${p*35}deg) scale(${.92+p*.15})`}
}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);updateScroll();
nodes.forEach(n=>n.addEventListener('click',()=>document.getElementById(n.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'})));

const videos=[...document.querySelectorAll('.project-video')];const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.15});videos.forEach(v=>io.observe(v));

const reelCard=document.querySelector('.reel-card'),reelVideo=document.getElementById('reelVideo'),reelPlay=document.getElementById('showreelPlay');
reelPlay?.addEventListener('click',()=>{const playing=!reelCard.classList.contains('playing');reelCard.classList.toggle('playing',playing);if(playing){reelVideo.currentTime=0;reelVideo.muted=false;reelVideo.play().catch(()=>{});reelPlay.innerHTML='<span>06</span>METTRE EN<br><em>PAUSE</em> <b>×</b>'}else{reelVideo.pause();reelPlay.innerHTML='<span>06</span>LANCER LE<br><em>SHOWREEL</em> <b>↗</b>'}});
reelVideo?.addEventListener('ended',()=>{reelCard.classList.remove('playing');reelPlay.innerHTML='<span>06</span>LANCER LE<br><em>SHOWREEL</em> <b>↗</b>';reelVideo.muted=true});

const lightbox=document.getElementById('lightbox'),lightboxImage=document.getElementById('lightboxImage'),lightboxTitle=document.getElementById('lightboxTitle');
document.querySelectorAll('.design-card').forEach(card=>card.addEventListener('click',()=>{const img=card.querySelector('img');lightboxImage.src=img.src;lightboxImage.alt=img.alt;lightboxTitle.textContent=card.dataset.title||'PROJET';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');body.classList.add('is-loading')}));
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImage.src='';body.classList.remove('is-loading')}
document.getElementById('lightboxClose').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});

const soundToggle=document.getElementById('soundToggle');let soundOn=false;soundToggle.addEventListener('click',()=>{soundOn=!soundOn;soundToggle.querySelector('span').textContent=soundOn?'ON':'OFF';reelVideo.muted=!soundOn});

const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});revealObserver.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.design-card,.web-page,.video-stage,.video-second,.about-copy,.contact-main,.motion-caption').forEach(el=>revealObserver.observe(el));
