(function(){
  var root=document.documentElement;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------------------------------------------------------------------------------*/
  var T=[
    {id:'neon',name:'Neon',sw:'#38e1ff'},
    {id:'aurora',name:'Aurora',sw:'#34e3a4'},
    {id:'ember',name:'Ember',sw:'#ff9f5a'},
    {id:'frost',name:'Frost',sw:'#0a7ea4'},
  ];
  var cur=0,box=document.getElementById('themes'),nm=document.getElementById('tname'),btns=[];
  function apply(i,save){
    cur=i;root.setAttribute('data-theme',T[i].id);nm.textContent=T[i].name;
    btns.forEach(function(b,k){b.setAttribute('aria-pressed',k===i)});
    if(save){try{localStorage.setItem('yc4-theme',T[i].id)}catch(e){}}
    window.dispatchEvent(new Event('themechange'));
  }
  T.forEach(function(t,i){
    var b=document.createElement('button');b.type='button';b.style.setProperty('--sw',t.sw);
    b.innerHTML='<i></i>'+t.name;b.onclick=function(){apply(i,true)};
    box.appendChild(b);btns.push(b);
  });
  var start=0,saved=null;
  try{saved=localStorage.getItem('yc4-theme')}catch(e){}
  if(saved){T.forEach(function(t,i){if(t.id===saved)start=i})}
  else if(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches){start=3}
  apply(start,false);
  document.getElementById('cycle').onclick=function(){apply((cur+1)%T.length,true)};
  document.addEventListener('keydown',function(e){
    if(e.key.toLowerCase()!=='t'||e.ctrlKey||e.metaKey||e.altKey)return;
    var el=document.activeElement;if(el&&/INPUT|TEXTAREA|SELECT/.test(el.tagName))return;
    apply((cur+1)%T.length,true);
  });
  document.getElementById('yr').textContent=new Date().getFullYear();

  /*------------------------------------------------------------------------------------------------------------------------------------------*/
  var bg=document.querySelector('.bg'),raf=0,px=0,py=0;
  window.addEventListener('pointermove',function(e){
    px=e.clientX;py=e.clientY;if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;bg.style.setProperty('--mx',px+'px');bg.style.setProperty('--my',py+'px')});
  },{passive:true});

  /*------------------------------------------------------------------------------------------------------------------------------------------*/
  (function(){
    var cv=document.getElementById('sky'),ctx=cv.getContext('2d');
    var techs=['React','Node.js','JavaScript','TypeScript','HTML','CSS','Git','GitHub','React Native','Redux','Java','Linux','UX/UI'];
    var W=0,H=0,stars=[],mx=-9999,my=-9999,col={fg:'#e8eefc',a1:'#38e1ff',a2:'#8a7bff'},tick=0;
    function colors(){var s=getComputedStyle(root);col.fg=s.getPropertyValue('--fg').trim()||col.fg;col.a1=s.getPropertyValue('--a1').trim()||col.a1;col.a2=s.getPropertyValue('--a2').trim()||col.a2}
    function build(){
      var d=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
      cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);
      var n=Math.max(45,Math.min(120,Math.round(W*H/11000)));stars=[];
      for(var i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:.6+Math.random()*1.3,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,ph:Math.random()*6.28,sp:.01+Math.random()*.03,t:i<techs.length?techs[i]:null});
    }
    function draw(){
      tick++;if(tick%20===1)colors();
      ctx.clearRect(0,0,W,H);ctx.font='500 12px '+getComputedStyle(root).getPropertyValue('--mono');ctx.textBaseline='middle';
      var i,j,a,b,dx,dy,d;
      for(i=0;i<stars.length;i++){
        a=stars[i];
        if(!calm){a.x+=a.vx;a.y+=a.vy;a.ph+=a.sp;
          if(a.x<-80)a.x=W+80;else if(a.x>W+80)a.x=-80;
          if(a.y<-20)a.y=H+20;else if(a.y>H+20)a.y=-20}
        for(j=i+1;j<stars.length;j++){
          b=stars[j];dx=a.x-b.x;dy=a.y-b.y;d=dx*dx+dy*dy;
          if(d<12100){ctx.globalAlpha=(1-d/12100)*.15;ctx.strokeStyle=col.a1;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
        }
        dx=a.x-mx;dy=a.y-my;d=Math.sqrt(dx*dx+dy*dy);
        var near=d<170?1-d/170:0;
        if(near>0){ctx.globalAlpha=near*.5;ctx.strokeStyle=col.a2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mx,my);ctx.stroke()}
        var tw=.5+.5*Math.sin(a.ph);
        ctx.fillStyle=a.t?col.a1:col.fg;
        ctx.globalAlpha=Math.min(1,(a.t?.9:.22+tw*.45)+near);
        ctx.beginPath();ctx.arc(a.x,a.y,a.t?2.2+near*1.5:a.r+near,0,6.28);ctx.fill();
        if(a.t){ctx.fillStyle=near>.05?col.a2:col.fg;ctx.globalAlpha=Math.min(1,.3+tw*.12+near*.7);ctx.fillText(a.t,a.x+9,a.y)}
      }
      ctx.globalAlpha=1;
      if(!calm)requestAnimationFrame(draw);
    }
    addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
    addEventListener('pointerleave',function(){mx=my=-9999});
    var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){build();if(calm)draw()},150)});
    if(calm)addEventListener('themechange',function(){setTimeout(function(){colors();draw()},60)});
    build();colors();draw();
  })();

  /* -------------------------------------------------------------------------------------------------------------   */
  (function(){
    var box=document.getElementById('carousel');
    var I=[
      ['Linux', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" alt="Linux" />'],
      ['Debian', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg" alt="Debian" />'],
      ['Windows', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" alt="Windows" />'],
      ['HTML', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" />'],
      ['CSS', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" />'],
      ['JavaScript', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />'],
      ['Git', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" />'],
      ['GitHub', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />'],
      ['TypeScript', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" />'],
      ['React', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />'],
      ['Next.js', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" />'],
      ['Tailwind', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" />'],
      ['Node.js', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />'],
      ['Express', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" />'],
      ['Python', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" />'],
      ['Rust', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" alt="Rust" />'],
      ['Java', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />'],
      ['MySQL', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" />'],
      ['Docker', '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" />'],
    ];
    function tiles(dup){return I.map(function(t){return '<div class="tile'+(dup?' dup':'')+'"'+(dup?' aria-hidden="true"':'')+'>'+t[1]+'<span>'+t[0]+'</span></div>'}).join('')}
    box.innerHTML='<div class="track">'+tiles(false)+tiles(true)+'</div>';
  })();
  
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------ */
  var meters=[].slice.call(document.querySelectorAll('.meter'));
  var reveals=[].slice.call(document.querySelectorAll('.glass, .job, section h2, .lead, .cert-item, .project-card, .certificates-wrapper'));

  if('IntersectionObserver' in window){
    var mo=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          mo.unobserve(e.target);
        }
      })
    },{threshold:.1, rootMargin:'0px 0px -50px 0px'});
    
    meters.forEach(function(m){mo.observe(m)});
    reveals.forEach(function(el){
      el.classList.add('reveal-item');
      mo.observe(el);
    });

    var links=[].slice.call(document.querySelectorAll('.nav ul a'));
    var so=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting) links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})
      })
    },{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('main section[id]').forEach(function(s){so.observe(s)});
  }else{
    meters.forEach(function(m){m.classList.add('in')});
    reveals.forEach(function(el){el.classList.add('in')});
  }

  /* -------------------------------------------------------------------------------------------------------------------------------------- */
  var lines=[
    ['whoami','Yago Cayo, desenvolvedor de software'],
    ['cat stack.txt','React · React Native · Node.js · TypeScript'],
    ['git log --oneline -1','De suporte e infraestrutura para o código'],
    ['status','cursando ADS e pós em Engenharia de Software']
  ];
  var out=document.getElementById('out');
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  if(calm){
    out.innerHTML=lines.map(function(l){return '<div><span class="p">$</span> '+esc(l[0])+'</div><span class="o">'+esc(l[1])+'</span>'}).join('');
  }else{
    var n=0;
    document.querySelectorAll('.hero h1 span').forEach(function(s){
      var t=s.dataset.t;s.textContent='';
      t.split('').forEach(function(c){var x=document.createElement('span');x.className='ch';x.style.setProperty('--i',n++);x.textContent=c;s.appendChild(x)});
    });
    var html='',li=0;
    (function next(){
      if(li>=lines.length){out.innerHTML=html+'<div><span class="p">$</span> <span class="cur"></span></div>';return}
      var cmd=lines[li][0],c=0;
      (function type(){
        out.innerHTML=html+'<div><span class="p">$</span> '+esc(cmd.slice(0,++c))+'<span class="cur"></span></div>';
        if(c<cmd.length)return setTimeout(type,38);
        setTimeout(function(){html+='<div><span class="p">$</span> '+esc(cmd)+'</div><span class="o">'+esc(lines[li][1])+'</span>';li++;next()},260);
      })();
    })();
  }
})();