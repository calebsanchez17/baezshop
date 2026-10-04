(async()=>{
  const { $,esc,api,productCard }=window.DC;
  let settings;
  try{settings=await window.DC.loadBase();}catch(e){window.DC.toast(e.message);return;}

  async function renderProducts(){
    try{
      settings=await api('/api/public/settings');
      window.DC.settings=settings; window.DC.applyAppearance(settings);
      const products=await api('/api/public/products');
      const featured=products.filter(p=>p.featured&&p.stock_status!=='out').slice(0,4);
      const grid=$('#featuredGrid');
      grid.innerHTML=(featured.length?featured:products.slice(0,4)).map(p=>productCard(p,settings.pen_per_usd)).join('')||'<div class="empty">Todavía no hay productos visibles.</div>';
      const hero=featured[0]||products.find(p=>p.stock_status!=='out');
      if(hero)$('#heroProduct').innerHTML=`<img src="${esc(hero.image_url)}" alt="${esc(hero.name)}"><div><strong>${esc(hero.name)}</strong><span>${esc(hero.subtitle||window.DC.categoryName(hero.category))}</span><span class="hero-price">S/ ${Number(hero.price_pen).toFixed(2)}</span></div>`;
    }catch(e){$('#featuredGrid').innerHTML=`<div class="empty">${esc(e.message)}</div>`;}
  }

  function channelAction(s,extraClass=''){
    const label=esc(s.button_text||'Visitar canal');
    if(s.url)return `<a class="btn btn-primary ${extraClass}" target="_blank" rel="noopener" href="${esc(s.url)}">${label}</a>`;
    return `<span class="btn btn-outline ${extraClass} disabled-link" aria-disabled="true">Enlace por configurar</span>`;
  }

  function socialCard(s){
    const media=s.image_url?`<img src="${esc(s.image_url)}" alt="${esc(s.name)}">`:'<div class="social-fallback"></div>';
    return `<article class="social-card ${s.is_live?'is-live':''}">${media}${s.is_live?'<span class="live-pill">EN VIVO</span>':''}<div class="social-card-content"><div class="social-platform">${esc(s.platform||'CANAL')}</div><h3>${esc(s.name)}</h3><p>${esc(s.handle||'Canal oficial')}</p>${channelAction(s)}</div></article>`;
  }

  function liveCard(s){
    const media=s.image_url?`<div class="live-now-media"><img src="${esc(s.image_url)}" alt="${esc(s.name)}"></div>`:'<div class="live-now-media live-now-fallback"><span>LIVE</span></div>';
    return `<article class="live-now-card">${media}<div class="live-now-content"><div class="live-status"><span class="live-status-dot"></span> TRANSMISIÓN ACTIVA</div><div class="live-meta">${esc(s.platform||'CANAL OFICIAL')}</div><h3>${esc(s.name)}</h3><p>${esc(s.handle||'El canal está transmitiendo en este momento.')}</p><div class="live-actions">${channelAction(s,'live-watch')}</div></div><div class="live-now-glow"></div></article>`;
  }

  async function renderSocials(){
    const el=$('#socialGrid'),liveEl=$('#liveNow');
    try{
      const rows=await api('/api/public/social-channels');
      const live=rows.filter(s=>s.is_live);
      if(live.length){
        liveEl.classList.remove('hidden');
        liveEl.innerHTML=`<div class="live-now-heading"><span class="live-status-dot"></span><span>Ahora en vivo</span><small>${live.length===1?'1 transmisión activa':`${live.length} transmisiones activas`}</small></div><div class="live-now-grid">${live.map(liveCard).join('')}</div>`;
      }else{
        liveEl.classList.add('hidden');
        liveEl.innerHTML='';
      }
      if(!rows.length){
        el.innerHTML='<div class="social-placeholder">Agrega Instagram, TikTok, YouTube, Twitch, Facebook o WhatsApp desde el panel administrativo.</div>';
        return;
      }
      el.innerHTML=rows.map(socialCard).join('');
    }catch(e){
      liveEl.classList.add('hidden');
      el.innerHTML=`<div class="social-placeholder">${esc(e.message)}</div>`;
    }
  }

  try{
    const faqs=await api('/api/public/faqs'),el=$('#faqList');
    el.innerHTML=faqs.map(f=>`<article class="faq-item"><button class="faq-q" type="button"><span>${esc(f.question)}</span><span>+</span></button><div class="faq-a">${esc(f.answer)}</div></article>`).join('')||'<div class="empty">No hay preguntas frecuentes configuradas.</div>';
    el.querySelectorAll('.faq-q').forEach(b=>b.onclick=()=>{const item=b.closest('.faq-item');item.classList.toggle('open');b.lastElementChild.textContent=item.classList.contains('open')?'−':'+';});
  }catch{}

  await Promise.all([renderProducts(),renderSocials()]);
  const secs=Math.max(5,Number(settings.auto_refresh_seconds)||12);
  setInterval(()=>{renderSocials();renderProducts();},secs*1000);
})();
