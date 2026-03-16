/* ── CURSOR ── */
(function() {
  const cur = document.getElementById('cur');
  const ring = document.getElementById('curRing');
  if (!cur || !ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });
  (function anim(){
    rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(anim);
  })();
})();

/* ── NAV SCROLL ── */
window.addEventListener('scroll',()=>{
  const nav = document.querySelector('nav');
  if(nav) nav.style.boxShadow = window.scrollY>60 ? '0 2px 0 #1a1208' : 'none';
});

/* ── ACTIVE NAV LINK ── */
(function(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href').split('/').pop();
    if(href === path) a.classList.add('active');
  });
})();

/* ── FILTER TABS ── */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const parent = btn.closest('.filter-section') || document;
      parent.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const tiles = (btn.closest('.filter-section')||document).querySelectorAll('[data-category]');
      tiles.forEach(tile=>{
        if(filter==='all' || tile.dataset.category===filter){
          tile.style.display='';
        } else {
          tile.style.display='none';
        }
      });
    });
  });
}

/* ── NEWSLETTER ── */
function initNewsletter() {
  document.querySelectorAll('.nl-form').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if(!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#d4501a';
        return;
      }
      btn.textContent = 'Subscribed! ☕';
      btn.style.background = '#2a4a28';
      input.value = '';
      input.placeholder = 'Welcome to the crew!';
      setTimeout(()=>{
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        input.placeholder = 'your@email.com';
      }, 3000);
    });
  });
}

/* ── SIP ANIMATION ── */
function initSip() {
  const cup = document.getElementById('bigCup');
  if(!cup) return;
  let sipping = false;
  function playSip(){
    try{
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      const buf=ctx.createBuffer(1,ctx.sampleRate*.35,ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.5);
      const src=ctx.createBufferSource(); src.buffer=buf;
      const bp=ctx.createBiquadFilter(); bp.type='bandpass';
      bp.frequency.setValueAtTime(900,ctx.currentTime);
      bp.frequency.exponentialRampToValueAtTime(200,ctx.currentTime+.3);
      bp.Q.value=1.5;
      const g=ctx.createGain();
      g.gain.setValueAtTime(.55,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.35);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start();
      setTimeout(()=>{
        const osc=ctx.createOscillator(), g2=ctx.createGain();
        osc.type='sine';
        osc.frequency.setValueAtTime(120,ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+.12);
        g2.gain.setValueAtTime(.3,ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12);
        osc.connect(g2); g2.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime+.12);
      },200);
    }catch(e){}
  }
  cup.style.cursor='none';
  cup.addEventListener('click',()=>{
    if(sipping) return;
    sipping=true; playSip();
    cup.style.animation='none';
    cup.style.transform='translateY(-30px) rotate(-28deg) translateX(20px)';
    const msgs=["*slurrrp* ☕","ahhh that's good ☕","mmmm 🤌","the good stuff 😌","*happy sip* ✨"];
    const t=document.createElement('div');
    t.textContent=msgs[Math.floor(Math.random()*msgs.length)];
    t.style.cssText='position:absolute;top:8%;left:50%;transform:translateX(-50%);background:var(--yellow);border:2px solid var(--ink);padding:.3rem .85rem;font-size:.72rem;font-weight:700;white-space:nowrap;z-index:10;font-family:Syne,sans-serif;pointer-events:none;';
    cup.parentElement.style.position='relative';
    cup.parentElement.appendChild(t);
    setTimeout(()=>{cup.style.transform='';cup.style.animation='cupBounce 4s ease-in-out infinite';sipping=false;},1100);
    setTimeout(()=>t.remove(),1800);
  });
}

/* ── LOAD DATA FROM GLOBALS (no fetch needed for GitHub Pages) ── */
function loadData(file) {
  if(file.includes('posts')) return Promise.resolve(typeof SPILL_POSTS !== 'undefined' ? SPILL_POSTS : null);
  if(file.includes('beans')) return Promise.resolve(typeof SPILL_BEANS !== 'undefined' ? SPILL_BEANS : null);
  if(file.includes('gear'))  return Promise.resolve(typeof SPILL_GEAR  !== 'undefined' ? SPILL_GEAR  : null);
  return Promise.resolve(null);
}

/* ── RENDER POST TILES ── */
function renderPostTile(post) {
  return `
  <div class="post-tile" data-category="${post.category}">
    <a href="post.html?slug=${post.slug}" style="text-decoration:none;color:inherit;display:block;">
      <div class="pt-img" style="aspect-ratio:16/9;background:var(--bg3);display:flex;align-items:center;justify-content:center;margin-bottom:1.1rem;overflow:hidden;">
        ${post.image ? `<img src="${post.image}" alt="${post.title}" style="width:100%;height:100%;object-fit:cover;">` : `<svg width="60" height="40" viewBox="0 0 60 40" fill="none"><ellipse cx="30" cy="25" rx="14" ry="10" fill="rgba(212,80,26,.12)"/><path d="M22 22 Q30 17 38 22 Q33 28 30 26Z" fill="rgba(245,240,232,.4)"/></svg>`}
      </div>
      <p class="pt-tag" style="font-size:.54rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--rust);margin-bottom:.4rem;">${post.category}</p>
      <p class="pt-title" style="font-size:1rem;font-weight:800;line-height:1.15;letter-spacing:-.01em;margin-bottom:.5rem;">${post.title}</p>
      <p class="pt-excerpt" style="font-size:.65rem;color:var(--mid);line-height:1.65;margin-bottom:.75rem;">${post.excerpt}</p>
      <div style="font-family:'Syne Mono',monospace;font-size:.54rem;color:var(--mid);display:flex;justify-content:space-between;">
        <span>${post.date}</span><span>${post.readTime}</span>
      </div>
    </a>
  </div>`;
}

/* ── INIT ON LOAD ── */
document.addEventListener('DOMContentLoaded',()=>{
  initFilters();
  initNewsletter();
  initSip();
});