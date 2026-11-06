/* Çetin Parke: photographic floor choices, matched-room previews. */
(()=>{
 'use strict';
 const root=document.getElementById('tasarla');
 if(!root)return;
 const assets={"natural":{"herringbone":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125751_ed2d04dd-7b07-4742-adac-114ebab24972.png","straight":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125752_0c6c9075-4a4d-42ea-8fa5-9e66b72fbac2.png","wide":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125751_d72d2f63-aae7-477d-a323-817c23546f65.png"},"light":{"herringbone":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125752_983aa2a7-2707-47fb-ae2a-ed0d97a19560.png","straight":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125755_02f6f97a-c3f7-4164-afba-c2bad14c74b5.png","wide":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125753_badd22c7-69b3-4f3a-abf6-1f8fb1a87e99.png"},"walnut":{"herringbone":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125816_eed6c0fc-868c-468b-bd69-0ecf55acd5cf.png","straight":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125816_48a61e78-036d-496f-b991-04e689434c2d.png","wide":"https://d8j0ntlcm91z4.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/hf_20261106_125817_b3e2cb25-67f5-4aac-a0f2-2049e7ff5d41.png"}};
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
