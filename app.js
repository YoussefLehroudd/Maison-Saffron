'use strict';
const dishes=[
 {id:1,name:'Burrata & tomates anciennes',category:'Entrées',price:88,desc:'Burrata crémeuse, tomates de saison, basilic frais et huile d’olive.',tag:'Coup de cœur',emoji:'🥗',image:'photo-1608897013039-887f21d8c804'},
 {id:2,name:'Salade du jardin',category:'Entrées',price:68,desc:'Mesclun, avocat, concombre, grenade et vinaigrette maison.',tag:'Végétarien',emoji:'🥬',image:'photo-1512621776951-a57141f2eefd'},
 {id:3,name:'Velouté de saison',category:'Entrées',price:62,desc:'Légumes du marché, crème légère et croûtons dorés.',tag:'',emoji:'🍵',image:'photo-1547592180-85f173990554'},
 {id:4,name:'Poulet rôti aux herbes',category:'Plats',price:135,desc:'Poulet tendre et doré, pommes grenailles et jus aux herbes.',tag:'Signature',emoji:'🍗',image:'photo-1532550907401-a500c9a57435'},
 {id:5,name:'Pasta à la truffe',category:'Plats',price:148,desc:'Tagliatelles fraîches, champignons et crème parfumée à la truffe.',tag:'Le plus aimé',emoji:'🍝',image:'photo-1473093295043-cdd812d0e601'},
 {id:6,name:'Filet de saumon grillé',category:'Plats',price:165,desc:'Saumon grillé, purée onctueuse et légumes de saison.',tag:'',emoji:'🐟',image:'photo-1467003909585-2f8a72700288'},
 {id:7,name:'Burger Maison',category:'Plats',price:112,desc:'Pain brioché, steak, cheddar, salade croquante et frites maison.',tag:'Populaire',emoji:'🍔',image:'photo-1568901346375-23c9450c58cd'},
 {id:8,name:'Cheesecake aux fruits rouges',category:'Desserts',price:72,desc:'Crème légère sur biscuit croquant et coulis de fruits rouges.',tag:'',emoji:'🍰',image:'photo-1533134242443-d4fd215305ad'},
 {id:9,name:'Fondant au chocolat',category:'Desserts',price:76,desc:'Cœur fondant chocolat noir, glace vanille et éclats de noisette.',tag:'Coup de cœur',emoji:'🍫',image:'photo-1606313564200-e75d5e30476c'},
 {id:10,name:'Tarte citron meringuée',category:'Desserts',price:68,desc:'Crème au citron acidulée et meringue aérienne.',tag:'',emoji:'🥧',image:'photo-1488477181946-6428a0291777'},
 {id:11,name:'Citronnade maison',category:'Boissons',price:35,desc:'Citron fraîchement pressé, menthe et une touche de miel.',tag:'Frais',emoji:'🍋',image:'photo-1513558161293-cdaf765edfd7'},
 {id:12,name:'Cappuccino velouté',category:'Boissons',price:38,desc:'Double espresso, lait mousseux et poudre de cacao.',tag:'',emoji:'☕',image:'photo-1570968915860-54d5c301fa9f'}
];
const categories=['Tout voir','Entrées','Plats','Desserts','Boissons'];
const el=s=>document.querySelector(s);const els=s=>document.querySelectorAll(s);
const pic=d=>`https://images.unsplash.com/${d.image}?w=750&q=78&auto=format&fit=crop`;
const money=n=>`${n} DH`;
const storageKey='maison-saffron-cart-v1';
let cart={};try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))for(const [id,qty] of Object.entries(saved)){if(dishes.some(d=>d.id===Number(id))&&Number.isInteger(qty)&&qty>0&&qty<100)cart[id]=qty;}}catch(_){cart={}}
let activeCategory='Tout voir';let query='';let toastTimer;
function save(){try{localStorage.setItem(storageKey,JSON.stringify(cart));}catch(_){}renderCart()}
function totals(){return dishes.reduce((acc,d)=>{const q=cart[d.id]||0;acc.qty+=q;acc.sum+=q*d.price;return acc},{qty:0,sum:0})}
function notify(message){const box=el('#toast');box.textContent=message;box.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('show'),2400)}
function add(id){cart[id]=(cart[id]||0)+1;save();notify('Plat ajouté à votre commande');}
function adjust(id,delta){cart[id]=Math.max(0,(cart[id]||0)+delta);if(!cart[id])delete cart[id];save()}
function renderCategories(){el('#categories').innerHTML=categories.map(c=>`<button class="category-btn ${activeCategory===c?'active':''}" data-category="${c}" type="button" aria-pressed="${activeCategory===c}">${c}</button>`).join('')}
function renderMenu(){renderCategories();const items=dishes.filter(d=>(activeCategory==='Tout voir'||d.category===activeCategory)&&`${d.name} ${d.desc} ${d.category}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query));el('#resultCount').textContent=`${items.length} créations`;el('#menuGrid').innerHTML=items.map(d=>`<article class="dish-card"><div class="dish-image"><img loading="lazy" src="${pic(d)}" alt="${d.name}" onerror="this.parentElement.classList.add('img-failed')"/><div class="fallback-art">${d.emoji}</div>${d.tag?`<span class="dish-tag">${d.tag}</span>`:''}</div><div class="dish-body"><p class="dish-category">${d.category}</p><h3 class="dish-name">${d.name}</h3><p class="dish-desc">${d.desc}</p><div class="dish-bottom"><span class="dish-price">${d.price} <small>DH</small></span><span class="dish-buttons"><button class="dish-info" type="button" aria-label="Voir ${d.name}" data-detail="${d.id}">ⓘ</button><button class="dish-add" type="button" aria-label="Ajouter ${d.name}" data-add="${d.id}">+</button></span></div></div></article>`).join('');el('#noResults').hidden=items.length>0}
function renderCart(){const total=totals();els('[data-cart-count]').forEach(e=>e.textContent=total.qty);els('[data-cart-total]').forEach(e=>e.textContent=money(total.sum));el('#cartHeadingCount').textContent=`(${total.qty})`;el('#mobileCart').hidden=total.qty===0;el('#checkout').disabled=!total.qty;el('#checkout').style.opacity=total.qty?1:.5;el('#cartItems').innerHTML=!total.qty?'<div class="cart-empty"><span class="empty-symbol">✳</span><h3>Votre panier est vide</h3><p>Ajoutez vos plats préférés pour préparer votre commande.</p></div>':dishes.filter(d=>cart[d.id]).map(d=>`<div class="cart-row"><img src="${pic(d)}" alt=""/><div><strong>${d.name}</strong><small>${money(d.price)} / plat</small><div class="qty-control"><button type="button" data-adjust="${d.id}" data-delta="-1" aria-label="Retirer une portion">−</button><span>${cart[d.id]}</span><button type="button" data-adjust="${d.id}" data-delta="1" aria-label="Ajouter une portion">+</button></div></div><span class="line-total">${money(d.price*cart[d.id])}</span></div>`).join('')}
function openCart(){el('#overlay').hidden=false;el('#cartDrawer').classList.add('open');el('#cartDrawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';el('#cartClose').focus()}
function closeCart(){el('#cartDrawer').classList.remove('open');el('#cartDrawer').setAttribute('aria-hidden','true');el('#overlay').hidden=true;document.body.style.overflow=''}
function detail(id){const d=dishes.find(d=>d.id===id);if(!d)return;el('#itemContent').innerHTML=`<img class="modal-image" src="${pic(d)}" alt="${d.name}"/><div class="modal-copy"><span class="dish-category">${d.category}</span><h2>${d.name}</h2><p>${d.desc}</p><div class="modal-price">${money(d.price)}</div><button class="checkout-btn" type="button" id="modalAdd">Ajouter à ma commande <span>+</span></button></div>`;el('#itemDialog').showModal();el('#modalAdd').addEventListener('click',()=>{add(id);el('#itemDialog').close()})}
el('#categories').addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;activeCategory=btn.dataset.category;renderMenu()});
el('#search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');renderMenu()});
el('#menuGrid').addEventListener('click',e=>{const addBtn=e.target.closest('[data-add]');const info=e.target.closest('[data-detail]');if(addBtn)add(Number(addBtn.dataset.add));else if(info)detail(Number(info.dataset.detail))});
el('#cartItems').addEventListener('click',e=>{const btn=e.target.closest('[data-adjust]');if(btn)adjust(Number(btn.dataset.adjust),Number(btn.dataset.delta))});
['#cartTop','#mobileCart'].forEach(id=>el(id).addEventListener('click',openCart));
el('#cartClose').addEventListener('click',closeCart);el('#overlay').addEventListener('click',closeCart);el('#clearCart').addEventListener('click',()=>{cart={};save();notify('Panier vidé')});
el('#checkout').addEventListener('click',()=>{if(!totals().qty)return;closeCart();notify('Commande démo enregistrée localement — aucun envoi réel')});
el('#itemClose').addEventListener('click',()=>el('#itemDialog').close());el('#itemDialog').addEventListener('click',e=>{if(e.target===el('#itemDialog'))el('#itemDialog').close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&el('#cartDrawer').classList.contains('open'))closeCart()});
el('#langBtn').addEventListener('click',()=>notify('Version française · Démonstration du menu'));
el('#year').textContent=new Date().getFullYear();renderMenu();renderCart();