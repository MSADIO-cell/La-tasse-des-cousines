(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const nav = [['index.html','Accueil'],['salon.html','Le salon'],['vitrine.html','Pâtisseries'],['boissons.html','Boissons'],['formules.html','Formules'],['recettes.html','Carnet gourmand'],['avis.html','Avis'],['contact.html','Contact']];
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `<header class="site-header"><div class="nav-shell"><a class="brand" href="index.html" aria-label="La Tasse des Cousines, accueil"><span class="brand-mark">T</span><span><span class="brand-name">La Tasse des Cousines</span><span class="brand-sub">Maison de thé · Nantes</span></span></a><nav class="main-nav" id="main-nav" aria-label="Navigation principale">${nav.map(([href,label])=>`<a href="${href}" ${page===href?'aria-current="page"':''}>${label}</a>`).join('')}<a class="nav-cta" href="contact.html">Nous trouver ↗</a></nav><button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="main-nav" type="button">Menu ☰</button></div></header>`;
    const toggle=document.getElementById('menu-toggle'), menu=document.getElementById('main-nav');
    toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Fermer ×':'Menu ☰';});
  }
  const footer=document.getElementById('site-footer');
  if(footer) footer.innerHTML=`<footer class="site-footer"><div class="wrap"><div class="footer-grid"><div><div class="footer-brand">La Tasse des Cousines</div><p>Un salon de thé imaginé comme une maison ouverte : recettes de famille, boissons parfumées et plaisir de se retrouver.</p></div><div><h3>Explorer</h3><p><a href="salon.html">Notre salon</a><br><a href="vitrine.html">La vitrine gourmande</a><br><a href="boissons.html">Les boissons du monde</a><br><a href="recettes.html">Le carnet gourmand</a></p></div><div><h3>Informations</h3><p><a href="contact.html">Contact & réservation</a><br><a href="avis.html">Les avis</a><br><a href="mentions-legales.html">Mentions légales</a><br><a href="confidentialite.html">Confidentialité</a></p></div></div><div class="footer-bottom">© 2026 La Tasse des Cousines · Projet pédagogique fictif — coordonnées et établissement non réels.</div></div></footer>`;

  // Cart: functional in-browser demo, no payment or order transmission.
  const trayStorageKey = 'la-tasse-des-cousines-tray';
  const tray = new Map();
  let trayStorageAvailable = true;
  let storedTray = null;
  try {
    storedTray = sessionStorage.getItem(trayStorageKey);
  } catch (error) {
    trayStorageAvailable = false;
    console.error('Le plateau ne peut pas être conservé entre les pages dans cette session.', error);
  }
  if (storedTray) {
    try {
      const storedItems = JSON.parse(storedTray);
      if (Array.isArray(storedItems)) {
        storedItems.forEach(item => {
          if (item && typeof item.name === 'string' && Number.isFinite(item.price) && Number.isInteger(item.qty) && item.qty > 0) {
            tray.set(item.name, { name: item.name, price: item.price, qty: item.qty });
          }
        });
      } else {
        console.error('Le contenu enregistré du plateau est invalide.');
      }
    } catch (error) {
      console.error('Impossible de lire le plateau enregistré.', error);
    }
  }
  const fmt = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n);
  const root=document.getElementById('tray-root');
  if(root){root.innerHTML=`<button class="tray-fab" id="tray-toggle" type="button" aria-expanded="false">Mon plateau · <span id="tray-count">0</span></button><section class="tray-panel" id="tray-panel" hidden aria-label="Mon plateau gourmand"><h3>Mon plateau gourmand</h3><div id="tray-items"><p>Votre plateau est vide pour le moment.</p></div><div class="tray-total"><span>Total indicatif</span><strong id="tray-total">0,00 €</strong></div><button class="button button-outline" id="tray-clear" type="button">Vider le plateau</button><a class="button button-gold" href="contact.html">Préparer ma demande ↗</a><p style="font-size:10px;margin:12px 0 0">Aucune commande ni aucun paiement n’est envoyé depuis cette démonstration.</p></section>`;}
  function add(name,price){const item=tray.get(name)||{name,price,qty:0};item.qty++;tray.set(name,item);render();}
  function render(){const items=[...tray.values()];if(trayStorageAvailable){try{sessionStorage.setItem(trayStorageKey,JSON.stringify(items));}catch(error){trayStorageAvailable=false;console.error('Le plateau ne peut pas être conservé entre les pages dans cette session.',error);}}if(root){document.getElementById('tray-count').textContent=items.reduce((n,x)=>n+x.qty,0);document.getElementById('tray-total').textContent=fmt(items.reduce((n,x)=>n+x.qty*x.price,0));document.getElementById('tray-items').innerHTML=items.length?items.map(x=>`<div class="tray-row"><span>${x.name} × ${x.qty}</span><span>${fmt(x.qty*x.price)} <button type="button" data-remove="${x.name}" aria-label="Retirer ${x.name}">×</button></span></div>`).join(''):'<p>Votre plateau est vide pour le moment.</p>';}const summary=document.getElementById('contact-tray-summary');if(summary){summary.innerHTML=items.length?`<strong class="text-primary">Articles dans votre plateau</strong><ul class="mt-3 space-y-2">${items.map(x=>`<li>${x.name} × ${x.qty} <span class="float-right">${fmt(x.qty*x.price)}</span></li>`).join('')}</ul><p class="mt-3 border-t pt-3 font-semibold text-primary">Total indicatif <span class="float-right">${fmt(items.reduce((n,x)=>n+x.qty*x.price,0))}</span></p>`:'<p class="m-0">Aucun article n’a encore été ajouté au plateau.</p>';}const traySummaryField=document.getElementById('reservation-tray-summary');if(traySummaryField){const total=items.reduce((n,x)=>n+x.qty*x.price,0);traySummaryField.value=items.length?`${items.map(x=>`${x.name} × ${x.qty} (${fmt(x.qty*x.price)})`).join(', ')} — Total indicatif : ${fmt(total)}`:'';}}
  document.querySelectorAll('.add-to-tray').forEach(b=>b.addEventListener('click',()=>add(b.dataset.name,Number(b.dataset.price))));
  const trayToggle=document.getElementById('tray-toggle');if(trayToggle)trayToggle.addEventListener('click',()=>{const panel=document.getElementById('tray-panel');panel.hidden=!panel.hidden;trayToggle.setAttribute('aria-expanded',String(!panel.hidden));});
  if(root){root.addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(b){tray.delete(b.dataset.remove);render();}});document.getElementById('tray-clear').addEventListener('click',()=>{tray.clear();render();});}
  render();
  // Interactive goûter builder
  const selections={drink:{name:'Thé à la menthe',price:3.2},sweet:{name:'Corne de gazelle',price:2.2}};
  document.querySelectorAll('[data-choice-group]').forEach(group=>group.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{group.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selections[group.dataset.choiceGroup]={name:btn.dataset.name,price:Number(btn.dataset.price)};updateDuo();})));
  function updateDuo(){const sum=selections.drink.price+selections.sweet.price;const summary=document.getElementById('duo-summary'),price=document.getElementById('duo-price');if(summary)summary.innerHTML=`${selections.drink.name} <span>+</span> ${selections.sweet.name}`;if(price)price.textContent=fmt(sum);}
  const duo=document.getElementById('add-duo');if(duo)duo.addEventListener('click',()=>{add(selections.drink.name,selections.drink.price);add(selections.sweet.name,selections.sweet.price);const f=document.getElementById('builder-feedback');if(f)f.textContent='Votre duo a été ajouté au plateau gourmand.';});
  // Legacy pages use generated cards; reveal them immediately for a no-JS-friendly layout.
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  const form=document.getElementById('reservation-form');
  if(form)form.addEventListener('submit',async e=>{
    e.preventDefault();
    const feedback=document.getElementById('form-feedback');
    const endpoint=(form.dataset.endpoint||'').trim();
    if(!endpoint){
      if(feedback){feedback.classList.remove('hidden');feedback.textContent='Merci ! Le formulaire fonctionne en mode démonstration : aucune demande n’a été transmise. Pour un envoi réel, configurez l’attribut data-endpoint du formulaire.';feedback.setAttribute('role','status');}
      return;
    }
    if(feedback){feedback.classList.remove('hidden');feedback.textContent='Envoi de votre demande…';feedback.setAttribute('role','status');}
    const submitButton=form.querySelector('[type="submit"]');
    if(submitButton)submitButton.disabled=true;
    try{
      const response=await fetch(endpoint,{method:'POST',body:new FormData(form)});
      if(!response.ok)throw new Error(`Le service a répondu avec le statut ${response.status}.`);
      if(feedback)feedback.textContent='Votre demande a bien été envoyée. Merci !';
    }catch(error){
      console.error('Échec de l’envoi de la demande au service configuré.',error);
      if(feedback)feedback.textContent='L’envoi a échoué. Vérifiez votre connexion ou réessayez plus tard.';
    }finally{
      if(submitButton)submitButton.disabled=false;
    }
  });
  // Legacy image helper fallback: keep layout intact when a source photo is absent.
  document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.style.opacity='.15';img.alt=img.alt||'Image non disponible';},{once:true}));
})();
