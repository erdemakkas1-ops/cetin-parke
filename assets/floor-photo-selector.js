/* Çetin Parke: photographic floor choices, matched-room previews. */
(()=>{
 'use strict';
 const root=document.getElementById('tasarla');
 if(!root)return;
 const assets={"natural":{"herringbone":"assets/finishes/natural-herringbone.webp","straight":"assets/finishes/natural-straight.webp","wide":"assets/finishes/natural-wide.webp"},"light":{"herringbone":"assets/finishes/light-herringbone.webp","straight":"assets/finishes/light-straight.webp","wide":"assets/finishes/light-wide.webp"},"walnut":{"herringbone":"assets/finishes/walnut-herringbone.webp","straight":"assets/finishes/walnut-straight.webp","wide":"assets/finishes/walnut-wide.webp"}};
 const tones={natural:'Doğal Meşe',light:'Açık Meşe',walnut:'Ceviz Tonu'};
 const patterns={herringbone:'Balıksırtı',straight:'Düz Döşeme',wide:'Geniş Tahta'};
 const toneButtons=[...root.querySelectorAll('[data-at-tone]')];
 const patternButtons=[...root.querySelectorAll('[data-at-pattern]')];
 const widthField=document.getElementById('at-width'),lengthField=document.getElementById('at-length');
 const areaOut=document.getElementById('at-area'),areaSummary=document.getElementById('at-config-area');
 const nameOut=document.getElementById('at-config-name');
 const quote=document.getElementById('at-quote');
 const primary=document.getElementById('at-photo'),secondary=document.getElementById('at-photo-next');
 const busy=document.getElementById('at-loading');
 const state={tone:'natural',pattern:'herringbone'};
 let revision=0,activeUrl=primary?.src||'';
 const number=n=>new Intl.NumberFormat('tr-TR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(n);
 const safeValue=(field,fallback)=>{
   const n=Number(String(field.value).replace(',','.'));
   return Number.isFinite(n)&&n>=.5&&n<=100?n:fallback;
 };
 function updateQuote(){
   const width=safeValue(widthField,4),length=safeValue(lengthField,5);
   const area=width*length;
   const finish=tones[state.tone],pattern=patterns[state.pattern];
   const areaText=number(area)+' m²';
   areaOut.textContent=areaText;
   areaSummary.textContent=areaText;
   nameOut.textContent=finish+' / '+pattern;
   const msg='Merhaba Çetin Parke. Sitenizdeki Parke Tasarla bölümünde '+finish+' ve '+pattern+' görünümünü seçtim. Odamın yaklaşık ölçüleri '+number(width)+' m × '+number(length)+' m ('+areaText+'). Bu seçime uygun gerçek parke alternatifleri ve teklif hakkında bilgi almak istiyorum.';
   quote.href='https://wa.me/905434576364?text='+encodeURIComponent(msg);
 }
 function updatePicture(){
   const url=assets[state.tone][state.pattern];
   if(!primary||!secondary)return;
   const ticket=++revision;
   if(url===activeUrl){
      secondary.classList.remove('visible');
      root.classList.remove('at-loading-image');
      if(busy)busy.textContent='';
      return;
   }
   root.classList.add('at-loading-image');
   if(busy)busy.textContent='Görsel hazırlanıyor…';
   const prefetch=new Image();
   prefetch.decoding='async';
   prefetch.onload=()=>{
      if(ticket!==revision)return;
      secondary.src=url;
      secondary.classList.add('visible');
      root.classList.remove('at-loading-image');
      if(busy)busy.textContent='Görünüm güncellendi';
      window.setTimeout(()=>{
       if(ticket!==revision)return;
       primary.src=url;
       activeUrl=url;
       secondary.classList.remove('visible');
      },320);
   };
   prefetch.onerror=()=>{
      if(ticket!==revision)return;
      root.classList.remove('at-loading-image');
      if(busy)busy.textContent='Görsel yüklenemedi; mevcut görünüm korunuyor.';
   };
   prefetch.src=url;
 }
 function choose(key,value){
   if(key==='tone'&&Object.hasOwn(tones,value)){state.tone=value; toneButtons.forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.atTone===value)))}
   if(key==='pattern'&&Object.hasOwn(patterns,value)){state.pattern=value;patternButtons.forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.atPattern===value)))}
   updateQuote();updatePicture();
 }
 toneButtons.forEach(button=>button.addEventListener('click',()=>choose('tone',button.dataset.atTone)));
 patternButtons.forEach(button=>button.addEventListener('click',()=>choose('pattern',button.dataset.atPattern)));
 for(const field of [widthField,lengthField]){
  field.addEventListener('input',updateQuote);
  field.addEventListener('change',()=>{
   const n=safeValue(field,field===widthField?4:5);
   field.value=String(Math.min(15,Math.max(2,n)));
   updateQuote();
  });
 }
 updateQuote();
})();
