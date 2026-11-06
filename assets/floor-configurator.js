/* Çetin Parke / interactive floor selector
   Pure client-side visualization: no prices, product availability or misleading stock claims.
   Drawing occurs only on setup, resize, or user option changes. */
(()=>{
'use strict';
const root=document.getElementById('floor-atelier');
if(!root)return;
const canvas=root.querySelector('#at-canvas'), ctx=canvas&&canvas.getContext('2d',{alpha:true});
if(!canvas||!ctx)return;
const toneButtons=[...root.querySelectorAll('[data-at-tone]')];
const patternButtons=[...root.querySelectorAll('[data-at-pattern]')];
const widthField=root.querySelector('#at-width');
const lengthField=root.querySelector('#at-length');
const areaLabel=root.querySelector('#at-area');
const configLabel=root.querySelector('#at-config-name');
const configArea=root.querySelector('#at-config-area');
const quote=root.querySelector('#at-quote');
const state={tone:'natural',pattern:'herringbone',width:4,length:5};
const tones={
 natural:{name:'Doğal Meşe',base:[192,147,97],light:[226,185,128],dark:[126,86,53]},
 light:{name:'Açık Meşe',base:[221,199,159],light:[240,222,187],dark:[176,146,107]},
 walnut:{name:'Ceviz Tonu',base:[105,69,48],light:[154,106,69],dark:[61,36,28]}
};
const patterns={
 straight:{name:'Düz Döşeme'},
 herringbone:{name:'Balıksırtı'},
 wide:{name:'Geniş Tahta'}
};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
let renderRequested=false;
let sizeW=0,sizeH=0,dpr=1;
function color(rgb,delta=0){return 'rgb('+rgb.map(n=>clamp(Math.round(n+delta),0,255)).join(',')+')'}
function rgba(rgb,a){return 'rgba('+rgb.join(',')+','+a+')'}
function hash(n){let x=Math.sin(n*91.372+12.173)*43758.5453123;return x-Math.floor(x)}
function schedule(){if(!renderRequested){renderRequested=true;requestAnimationFrame(()=>{renderRequested=false;draw()})}}
function fit(){
 const box=canvas.getBoundingClientRect();
 const w=Math.max(1,Math.round(box.width)),h=Math.max(1,Math.round(box.height));
 const scale=Math.min(devicePixelRatio||1,1.65);
 if(w!==sizeW||h!==sizeH||scale!==dpr){
  sizeW=w;sizeH=h;dpr=scale;
  canvas.width=Math.round(w*dpr);
  canvas.height=Math.round(h*dpr);
 }
 schedule();
}
function fillPoly(points,fill,stroke){
 ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
 for(let k=1;k<points.length;k++)ctx.lineTo(points[k][0],points[k][1]);
 ctx.closePath();ctx.fillStyle=fill;ctx.fill();
 if(stroke){ctx.lineWidth=Math.max(.6,sizeW/1300);ctx.strokeStyle=stroke;ctx.stroke()}
}
function drawPlank(points,id,orientation='horizontal'){
 const pal=tones[state.tone];
 const jitter=(hash(id)-.5)*25;
 const grad=ctx.createLinearGradient(points[0][0],points[0][1],points[2][0],points[2][1]);
 grad.addColorStop(0,color(pal.base,jitter+12));
 grad.addColorStop(.27,color(pal.light,jitter-10));
 grad.addColorStop(.68,color(pal.base,jitter));
 grad.addColorStop(1,color(pal.dark,jitter+11));
 fillPoly(points,grad,rgba(pal.dark,.35));
 // Natural-looking, deterministic grain highlights follow the plank's length.
 const a=points[0],b=points[1],c=points[2],d=points[3];
 ctx.save();ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);ctx.clip();
 for(let k=1;k<=4;k++){
  const t=k/5;
  let p1,p2;
  if(orientation==='vertical'){
   p1=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
   p2=[d[0]+(c[0]-d[0])*t,d[1]+(c[1]-d[1])*t];
  }else{
   p1=[a[0]+(d[0]-a[0])*t,a[1]+(d[1]-a[1])*t];
   p2=[b[0]+(c[0]-b[0])*t,b[1]+(c[1]-b[1])*t];
  }
  ctx.beginPath();ctx.moveTo(...p1);ctx.lineTo(...p2);
  ctx.strokeStyle=k%2?rgba(pal.dark,.10):rgba(pal.light,.23);
  ctx.lineWidth=Math.max(.4,sizeW/2100);ctx.stroke();
 }
 ctx.restore();
}
function drawRegular(W,H,top,wide){
 // Perspective-aware staggered plank grid.
 const rows=wide?11:19,cols=wide?4:8;
 const screenY=t=>top+(H-top)*Math.pow(t,1.6);
 const xs=(u,t)=>W*(.16+(u*.68))*(1-t)+W*u*t;
 for(let row=0;row<rows;row++){
  const t0=row/rows,t1=(row+1)/rows;
  const y0=screenY(t0),y1=screenY(t1);
  const offset=row%2?-.5:0;
  for(let c=-1;c<cols+1;c++){
   const u0=clamp((c+offset)/cols,0,1),u1=clamp((c+offset+1)/cols,0,1);
   if(u1-u0<.001)continue;
   const p=[[xs(u0,t0),y0],[xs(u1,t0),y0],[xs(u1,t1),y1],[xs(u0,t1),y1]];
   drawPlank(p,row*29+c+2,'horizontal');
  }
 }
}
function drawHerringbone(W,H,top){
 // Chevron-style woven wood boards, rendered as individual parallelograms.
 // This is a material concept pattern, not an installation specification.
 const rows=21,cols=9;
 const screenY=t=>top+(H-top)*Math.pow(t,1.5);
 const xs=(u,t)=>W*(.14+u*.72)*(1-t)+W*u*t;
 for(let row=0;row<rows;row++){
  const t0=row/rows,t1=(row+1)/rows;
  const y0=screenY(t0),y1=screenY(t1);
  for(let col=-1;col<=cols;col++){
   const x0=col/cols,x1=(col+1)/cols,mid=(x0+x1)*.5;
   const lean=(row+col)%2===0?-.22:.22;
   const topA=clamp(x0+lean/cols,0,1),topB=clamp(x1+lean/cols,0,1);
   const botA=clamp(x0-lean/cols,0,1),botB=clamp(x1-lean/cols,0,1);
   if(topB-topA<.005||botB-botA<.005)continue;
   const p=[[xs(topA,t0),y0],[xs(topB,t0),y0],[xs(botB,t1),y1],[xs(botA,t1),y1]];
   drawPlank(p,row*21+col,'vertical');
   // Secondary join forms directional V rhythm.
   const xa=xs(mid,t0),xb=xs(clamp(mid+(lean/cols),0,1),t1);
   ctx.beginPath();ctx.moveTo(xa,y0);ctx.lineTo(xb,y1);
   ctx.strokeStyle=rgba(tones[state.tone].dark,.27);ctx.lineWidth=Math.max(.7,W/1600);ctx.stroke();
  }
 }
}
function draw(){
 if(!sizeW||!sizeH)return;
 const W=sizeW,H=sizeH;
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.clearRect(0,0,W,H);
 const top=H*.575;
 // Dark foundation along the far wall keeps the hand-rendered floor anchored in the room.
 const threshold=ctx.createLinearGradient(0,top,0,H);
 threshold.addColorStop(0,'rgba(12,15,10,.24)');
 threshold.addColorStop(.12,'rgba(8,12,8,.02)');
 threshold.addColorStop(.8,'rgba(0,0,0,0)');
 threshold.addColorStop(1,'rgba(0,0,0,.13)');
 const pal=tones[state.tone];
 ctx.save();
 ctx.beginPath();ctx.moveTo(0,top);ctx.lineTo(W,top);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.clip();
 ctx.fillStyle=color(pal.base);ctx.fillRect(0,top,W,H-top);
 if(state.pattern==='herringbone')drawHerringbone(W,H,top);
 else drawRegular(W,H,top,state.pattern==='wide');
 ctx.fillStyle=threshold;ctx.fillRect(0,top,W,H-top);
 // Window-light reflection across the new floor.
 const sun=ctx.createLinearGradient(W*.7,top,W*.40,H);
 sun.addColorStop(0,'rgba(255,240,202,.35)');
 sun.addColorStop(.45,'rgba(255,236,193,.10)');
 sun.addColorStop(1,'rgba(0,0,0,0)');
 ctx.globalCompositeOperation='screen';ctx.fillStyle=sun;ctx.fillRect(0,top,W,H-top);
 ctx.globalCompositeOperation='source-over';
 ctx.restore();
 // Brass thin material boundary.
 ctx.fillStyle='rgba(30,25,17,.28)';ctx.fillRect(0,top,W,Math.max(1,H*.002));
}
function dimensions(){
 const n=(val,fallback)=>{const v=Number(val);return Number.isFinite(v)&&v>0?clamp(v,2,15):fallback};
 state.width=n(widthField.value,4);
 state.length=n(lengthField.value,5);
 const area=state.width*state.length;
 const fmt=new Intl.NumberFormat('tr-TR',{minimumFractionDigits:1,maximumFractionDigits:1});
 const areaText=fmt.format(area)+' m²';
 areaLabel.textContent=areaText;
 configArea.textContent=areaText;
 const finish=tones[state.tone].name,pattern=patterns[state.pattern].name;
 configLabel.textContent=finish+' / '+pattern;
 const query='Merhaba Çetin Parke. Web sitenizdeki Parke Tasarla alanında bir konsept seçtim. Görünüm: '+finish+'. Döşeme: '+pattern+'. Oda: '+fmt.format(state.width)+' m × '+fmt.format(state.length)+' m (yaklaşık '+areaText+'). Bu görünüme benzer gerçek ürünler, uygunluk ve fiyat hakkında bilgi almak istiyorum.';
 quote.href='https://wa.me/905434576364?text='+encodeURIComponent(query);
}
function choose(buttons,attribute,value,key,values){
 if(!(value in values))return;
 state[key]=value;
 buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.getAttribute(attribute)===value)));
 dimensions();
 schedule();
}
toneButtons.forEach(b=>b.addEventListener('click',()=>choose(toneButtons,'data-at-tone',b.getAttribute('data-at-tone'),'tone',tones)));
patternButtons.forEach(b=>b.addEventListener('click',()=>choose(patternButtons,'data-at-pattern',b.getAttribute('data-at-pattern'),'pattern',patterns)));
for(const field of [widthField,lengthField]){
 field.addEventListener('input',dimensions);
 field.addEventListener('change',()=>{const min=Number(field.min)||2,max=Number(field.max)||15;let value=Number(field.value);if(!Number.isFinite(value))value=4;field.value=String(clamp(value,min,max));dimensions()});
}
window.addEventListener('resize',fit,{passive:true});
if('ResizeObserver' in window)new ResizeObserver(fit).observe(canvas);
dimensions();fit();
})();
