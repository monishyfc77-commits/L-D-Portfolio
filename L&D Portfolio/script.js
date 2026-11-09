document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-button');
const nav=document.querySelector('.main-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav?.classList.toggle('is-open',open);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu?.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav?.classList.remove('is-open');menu.focus();}});
const filterButtons=document.querySelectorAll('[data-filter]');
filterButtons.forEach(b=>b.addEventListener('click',()=>{filterButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));let count=0;document.querySelectorAll('[data-category]').forEach(c=>{c.hidden=b.dataset.filter!=='all'&&b.dataset.filter!==c.dataset.category;if(!c.hidden)count++;});const s=document.getElementById('filter-status');if(s)s.textContent=`Showing ${count} independent ${count===1?'project':'projects'}.`; }));
const records=[{id:'EMP-DEMO-01',required:'Level 3',reviewed:'Level 2 · simulated',route:'Targeted practice',next:'Practise independent claim verification, then reassess with a fresh task.'},{id:'EMP-DEMO-02',required:'Level 3',reviewed:'Level 3 · simulated',route:'Requirement met',next:'Continue source checks. The proposed target is met in this fictional example.'},{id:'EMP-DEMO-03',required:'Level 3',reviewed:'Level 1 · simulated',route:'Targeted practice',next:'Begin guided source-checking practice, then reassess independently.'},{id:'EMP-DEMO-04',required:'Level 3',reviewed:'Level 4 · simulated',route:'Requirement met',next:'Continue source checks. Any coaching assignment needs a manager to review availability.'},{id:'EMP-DEMO-05',required:'Level 3',reviewed:'Not assessed',route:'Assessment first',next:'Collect claim-verification evidence before selecting level-specific learning.'}];
document.querySelectorAll('[data-record]').forEach(b=>b.addEventListener('click',()=>{const r=records[Number(b.dataset.record)];document.querySelectorAll('[data-record]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));for(const k of ['id','required','reviewed','route','next']){const el=document.getElementById('record-'+k);if(el)el.textContent=r[k];}}));
document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-answer]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const feedback=document.getElementById('practice-feedback');feedback.textContent=b.dataset.answer==='unsupported'?'Correct. The mock brief contains no attendance rule. Remove the assertion and seek the authorized policy owner’s confirmation before release.':'Check the source again. The complete mock brief is silent on attendance. The draft’s assertion is unsupported; a human owner must resolve any actual attendance rule.';}));
const agentExamples={faq:{heading:'Learning FAQ assistant',request:'“Is this session mandatory?”',response:'The supplied demo brief does not specify an attendance requirement. Confirm with the authorized learning owner before sending an invitation.',source:'Source: demo SME brief. Attendance policy: not supplied.',gate:'Human review: policy question remains unresolved.'},studio:{heading:'SME Studio',request:'“Turn the verification brief into a learning package.”',response:'Objective: identify unsupported claims in a fictional HR draft. Practice: compare draft claims with the mock source. Assessment: a different unseen draft reviewed against an SME-approved rubric.',source:'Source: AI-awareness source brief; draft learning design.',gate:'Human review: SME checks accuracy and alignment before release.'},followup:{heading:'Learning follow-up workflow',request:'“Prepare a reminder for a record with no confirmed recipient.”',response:'Draft held. Verify the recipient and address, check the event has not already been processed, then prepare one reminder for review. No message is sent by this portfolio example.',source:'Source: fictional completion record. Recipient: missing.',gate:'Human review: confirm recipient and approve release.'}};
document.querySelectorAll('[data-agent]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-agent]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const a=agentExamples[b.dataset.agent];for(const k of ['heading','request','response','source','gate']){const el=document.getElementById('agent-'+k);if(el)el.textContent=a[k];}}));

// Keep both reference-inspired visuals pausable, local and quiet when out of view.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-capability-wave], [data-hero-orbit], [data-content-motion]').forEach(visual=>{
  const motionButton=visual.querySelector('.wave-motion-toggle, .orbit-motion-toggle');
  const motionName=visual.dataset.motionName||(visual.hasAttribute('data-hero-orbit')?'circle':'workflow');
  let inView=!('IntersectionObserver' in window);
  const syncMotionPreference=()=>{
    motionButton.hidden=reducedMotion.matches;
    visual.classList.toggle('is-in-view',inView&&!reducedMotion.matches&&!document.hidden);
  };
  syncMotionPreference();
  reducedMotion.addEventListener?.('change',syncMotionPreference);
  document.addEventListener('visibilitychange',syncMotionPreference);
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){inView=entry.isIntersecting;syncMotionPreference();}
    },{threshold:.08});
    observer.observe(visual);
  }
  motionButton.addEventListener('click',()=>{
    const paused=visual.classList.toggle('is-paused');
    motionButton.setAttribute('aria-pressed',String(paused));
    motionButton.setAttribute('aria-label',`${paused?'Resume':'Pause'} ${motionName} animation`);
    motionButton.innerHTML=paused?'Resume motion <span aria-hidden="true">▶</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';
  });
});
// Track the current reading section without changing anchor or keyboard behaviour.
function followReadingPosition(links,sections){
  let queued=false;
  const update=()=>{
    queued=false;
    const offset=document.querySelector('.site-header').getBoundingClientRect().height+120;
    let current=sections[0];
    for(const section of sections)if(section.getBoundingClientRect().top<=offset)current=section;
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-8)current=sections[sections.length-1];
    links.forEach(link=>{
      const id=link.getAttribute('href').split('#')[1]||'home';
      if(id===current.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('hashchange',schedule);
  update();
}
if(document.querySelector('.hero')){
  const links=[...document.querySelectorAll('.main-nav a')];
  followReadingPosition(links,['home','about','ownership','approach','work','contact'].map(id=>document.getElementById(id)));
}
const caseLinks=[...document.querySelectorAll('.case-index a')];
if(caseLinks.length)followReadingPosition(caseLinks,[...document.querySelectorAll('.case-section')]);

// Fit each animated perimeter to its card, including filtering and text reflow.
document.querySelectorAll('.project-card, .six-stage').forEach(card=>{
  const fit=()=>{if(card.hidden)return;const rect=card.querySelector('.project-outline-loop');rect?.setAttribute('width',Math.max(0,card.clientWidth-2));rect?.setAttribute('height',Math.max(0,card.clientHeight-2));};
  if('ResizeObserver' in window)new ResizeObserver(fit).observe(card);
  window.addEventListener('resize',fit);fit();
});

// Six branches follow measured inner card edges; a shared feed keeps motion coherent.
const sixFlow=document.querySelector('.six-workflow');
if(sixFlow){
 const svg=sixFlow.querySelector('.six-connectors'),hub=sixFlow.querySelector('.wave-hub');
 const cards=[...sixFlow.querySelectorAll('.six-stage')];
 const draw=()=>{
  const field=sixFlow.getBoundingClientRect(),h=hub.getBoundingClientRect();
  const mobile=matchMedia('(max-width:600px)').matches;
  const x=h.left+h.width/2-field.left,y=h.bottom-field.top;
  svg.setAttribute('viewBox',`0 0 ${field.width} ${field.height}`);
  svg.style.width=`${field.width}px`;svg.style.height=`${field.height}px`;
  const spine=mobile?28:x;
  const ends=cards.map((c,i)=>{const r=c.getBoundingClientRect();return{x:(mobile||i%2?r.left:r.right)-field.left,y:r.top+r.height/2-field.top};});
  const last=ends.at(-1).y;
  const d=mobile?`M${x} ${y} V${y+12} Q${x} ${y+24} ${x-12} ${y+24} H${spine+12} Q${spine} ${y+24} ${spine} ${y+36} V${last}`:`M${x} ${y} V${last}`;
  svg.querySelectorAll('.six-feed').forEach(p=>p.setAttribute('d',d));
  ends.forEach((e,i)=>{
   const r=cards[i].getBoundingClientRect(),edge=(mobile||i%2?r.left+.5:r.right-.5)-field.left;
   const prefix=mobile?`M${x} ${y} V${y+12} Q${x} ${y+24} ${x-12} ${y+24} H${spine+12} Q${spine} ${y+24} ${spine} ${y+36} V${e.y}`:`M${x} ${y} V${e.y}`;
   const delay=mobile?i*.42:Math.floor(i/2)*.65;
   cards[i].style.setProperty('--signal-delay',`${delay}s`);
   svg.querySelectorAll(`[data-six-branch="${i}"]`).forEach(p=>{
    const flow=p.classList.contains('six-flow');
    p.setAttribute('d',flow?`${prefix} H${edge}`:`M${spine} ${e.y} H${edge}`);
    if(flow){p.setAttribute('pathLength','100');p.style.strokeDasharray='10 100';p.style.animationDelay=`${delay}s`;}
   });
  });
 };
 let frame;const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);};
 if('ResizeObserver'in window)new ResizeObserver(schedule).observe(sixFlow);
 window.addEventListener('resize',schedule);document.fonts?.ready.then(schedule);schedule();
}
