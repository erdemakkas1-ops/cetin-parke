"use client";
import {useEffect,useRef,useState} from "react";
const SOURCE="https://d2ol7oe51mr4n9.cloudfront.net/user_3IjjaE9cBh5rjRvE9kXvd8ehG8t/75874eb9-c080-4f2d-bc84-1e929de60f26.png";
const contact="https://wa.me/905434576364?text=Merhaba%2C%20%C3%87etin%20Parke%20%C3%BCr%C3%BCnleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";
const clamp=(n:number)=>Math.min(1,Math.max(0,n));
function Scene({kind,eyebrow,title,copy,index}:{kind:string,eyebrow:string,title:string,copy:string,index:number}){
 const ref=useRef<HTMLElement>(null);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{let id=0;const tick=()=>{cancelAnimationFrame(id);id=requestAnimationFrame(()=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();setProgress(clamp(-r.top/Math.max(1,r.height-innerHeight)));});};tick();addEventListener("scroll",tick,{passive:true});addEventListener("resize",tick);return()=>{removeEventListener("scroll",tick);removeEventListener("resize",tick);cancelAnimationFrame(id)}},[]);
 return <section className={"scene scene-"+kind} ref={ref} aria-label={title}>
  <div className="sticky-scene" style={{"--p":progress} as React.CSSProperties}>
   <div className="scene-photo" style={{backgroundImage:"url("+SOURCE+")",transform:"scale("+(1+progress*(kind==="hero"?.21:.15))+") translate3d(0,"+(-progress*1.5)+"%,0)"}}/>
   <div className="scene-tint" style={{opacity:kind==="floor"?progress*.46:.18+progress*.18}}/>
   {kind==="floor"&&<div className="floor-light" style={{opacity:progress*.55,transform:"translateY("+(100-progress*100)+"%)"}}/>}
   <div className="scene-content" style={{opacity:Math.min(1,Math.max(.1,(progress<.7?1:(1-progress)/.3)))}}>
    <span className="eyebrow"><span className="line"/> {eyebrow}</span>
    <h2>{title}</h2><p>{copy}</p>
    {index===0&&<a className="outline" href="#koleksiyon">Koleksiyonu keşfet <span>↓</span></a>}
   </div>
   <div className="scene-count">0{index+1} <span>/</span> 03</div>
   <div className="progress-rail"><span style={{transform:"scaleY("+progress+")"}}/></div>
   <div className="progress-label">SCROLL <b>{String(Math.round(progress*100)).padStart(3,"0")}%</b></div>
  </div>
 </section>
}
const goods=[["01","Parke","Zeminden başlayan bir dönüşüm.","floor"],["02","İç Kapılar","Mekânınızın karakterini tamamlayan detaylar.","door"],["03","Banyo Dolapları","İşlevsellik ve zarafetin dengesi.","bath"],["04","Duşakabin","Banyonuza modern bir dokunuş.","shower"]];
export default function Home(){const [menu,setMenu]=useState(false);return <main>
 <header className="nav"><a className="brand" href="#baslangic">ÇETİN<span>PARKE</span><i>®</i></a><nav className={menu?"navlinks opened":"navlinks"}><a href="#hikaye" onClick={()=>setMenu(false)}>Hikâyemiz</a><a href="#koleksiyon" onClick={()=>setMenu(false)}>Ürünler</a><a href="#iletisim" onClick={()=>setMenu(false)}>İletişim</a></nav><a className="nav-contact" href={contact} target="_blank" rel="noreferrer">Teklif Al <span>↗</span></a><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Menüyü aç">☰</button></header>
 <div id="baslangic" className="intro"><span className="intro-index">SAKARYA / PAMUKOVA</span><h1>MEKÂNLARIN<br/><em>RUHUNU</em><br/>DEĞİŞTİRİYORUZ.</h1><p>Her detayda estetik. Her adımda kalite.</p><span className="scroll-hint">AŞAĞI KAYDIR <span>↓</span></span></div>
 <div id="hikaye"><Scene index={0} kind="hero" eyebrow="01 / MİMARİ DENEYİM" title="Her mekân bir hikâye anlatır." copy="Doğal dokular, özenli seçimler ve zamansız yaşam alanları."/></div>
 <Scene index={1} kind="floor" eyebrow="02 / ZEMİNİN DÖNÜŞÜMÜ" title="Güzellik zeminden başlar." copy="Yaşam alanınıza sıcaklık katan parke seçeneklerini keşfedin."/>
 <Scene index={2} kind="final" eyebrow="03 / SON DOKUNUŞ" title="Hayal ettiğiniz yaşam alanı." copy="Parkeden kapıya, banyodan duşakabine bütüncül çözümler."/>
 <section className="collection" id="koleksiyon"><div className="section-head"><span className="eyebrow dark"><span className="line"/> KOLEKSİYONUMUZ</span><h2>Detaylarda<br/><em>fark yaratıyoruz.</em></h2><p>Yaşam alanlarını tamamlayan ürün gruplarımız.</p></div><div className="products">{goods.map(([no,name,description,kind])=><a key={no} className={"product product-"+kind} href={contact} target="_blank" rel="noreferrer"><div className="product-art"><span className="product-overlay">{no}</span></div><div className="product-bottom"><div><span>{no} / ÇETİN PARKE</span><h3>{name}</h3><p>{description}</p></div><b>↗</b></div></a>)}</div></section>
 <section className="statement"><span className="eyebrow"><span className="line"/> ÇETİN PARKE</span><h2>YALNIZCA BİR MEKÂN DEĞİL.<br/><em>YAŞAM HİSSİ TASARLIYORUZ.</em></h2><a href={contact} target="_blank" rel="noreferrer" className="light-button">Projeniz için görüşelim ↗</a></section>
 <footer id="iletisim"><div><span className="eyebrow"><span className="line"/> BİZE ULAŞIN</span><h2>Birlikte<br/><em>başlayalım.</em></h2><a href={contact} target="_blank" rel="noreferrer" className="footer-cta">WhatsApp ile iletişim ↗</a></div><div className="footer-info"><p><strong>Çetin Parke</strong><br/>Akhisar, Türkoçağı Caddesi No:56<br/>Pamukova / Sakarya</p><p>0543 457 63 64</p><a href="https://www.instagram.com/cetin.parke/" target="_blank" rel="noreferrer">Instagram ↗</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ÇETİN PARKE</span><span>MEKÂNLARA DEĞER KATIYORUZ.</span></div></footer>
 </main>}
