const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');
let data;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  try {
    const [salt, expected] = String(stored).split(':');
    const actual = crypto.scryptSync(password, salt, 64);
    const exp = Buffer.from(expected, 'hex');
    return exp.length === actual.length && crypto.timingSafeEqual(exp, actual);
  } catch { return false; }
}
function persist() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_FILE);
}
function nextId(key) {
  data.counters[key] = (data.counters[key] || 0) + 1;
  return data.counters[key];
}
function now(){ return new Date().toISOString(); }

function seed() {
  data = {
    counters: { users: 1, products: 12, faqs: 4, payment_methods: 3, orders: 0, social_channels: 3 },
    users: [
      { id: 1, username: 'dcbaez2026', display_name: 'Jefe DC', password_hash: hashPassword('baez1234'), role: 'owner', active: 1, created_at: now(), updated_at: now() }
    ],
    settings: {
      site_name: 'DC RECARGAS',
      tagline: 'Recargas, cuentas y entretenimiento digital con atención directa.',
      whatsapp_number: '51999999999',
      whatsapp_channel_url: '',
      pen_per_usd: '3.75',
      logo_url: '/assets/logo.svg',
      hero_title: 'Todo tu entretenimiento digital en un solo lugar',
      hero_subtitle: 'Compra diamantes, extras, cuentas y servicios digitales con un proceso claro, rápido y profesional.',
      hero_badge: 'TIENDA DIGITAL',
      login_music_url: '',
      store_background_url: '',
      store_background_enabled: '0',
      store_background_overlay: '78',
      store_music_url: '',
      store_music_enabled: '0',
      store_music_volume: '35',
      store_music_autoplay: '1',
      store_music_loop: '1',
      store_music_start_muted: '0',
      support_text: 'Atención directa por WhatsApp',
      footer_note: 'Entrega coordinada · Pago seguro · Soporte directo',
      account_image_limit: '8',
      account_video_limit: '2',
      auto_refresh_seconds: '12',
      login_cover_url: '',
      storefront_notice: 'Atención disponible todos los días'
    },
    products: [
      {id:1,name:'110 Diamantes',slug:'110-diamantes',category:'diamonds',price_pen:3,old_price_pen:3.5,subtitle:'100 + 10 Diamantes',description:'Recarga de diamantes para Free Fire.',image_url:'/assets/diamond-110.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:10,created_at:now(),updated_at:now()},
      {id:2,name:'341 Diamantes',slug:'341-diamantes',category:'diamonds',price_pen:8.5,old_price_pen:9.9,subtitle:'310 + 31 Diamantes',description:'Recarga de diamantes para Free Fire.',image_url:'/assets/diamond-341.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:20,created_at:now(),updated_at:now()},
      {id:3,name:'572 Diamantes',slug:'572-diamantes',category:'diamonds',price_pen:13.7,old_price_pen:15.5,subtitle:'520 + 52 Diamantes',description:'Recarga de diamantes para Free Fire.',image_url:'/assets/diamond-572.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:30,created_at:now(),updated_at:now()},
      {id:4,name:'1166 Diamantes',slug:'1166-diamantes',category:'diamonds',price_pen:24.9,old_price_pen:29.9,subtitle:'1060 + 106 Diamantes',description:'Recarga de diamantes para Free Fire.',image_url:'/assets/diamond-1166.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:40,created_at:now(),updated_at:now()},
      {id:5,name:'Pase Booyah',slug:'pase-booyah',category:'extras',price_pen:4,old_price_pen:null,subtitle:'Pase de temporada',description:'Producto adicional para Free Fire.',image_url:'/assets/extra-booyah.svg',gallery:[],stock_status:'available',featured:0,active:1,sort_order:50,created_at:now(),updated_at:now()},
      {id:6,name:'Membresía Semanal',slug:'membresia-semanal',category:'extras',price_pen:6.5,old_price_pen:7,subtitle:'Beneficio semanal',description:'Membresía semanal de Free Fire.',image_url:'/assets/extra-weekly.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:60,created_at:now(),updated_at:now()},
      {id:7,name:'Membresía Mensual',slug:'membresia-mensual',category:'extras',price_pen:29,old_price_pen:32,subtitle:'Beneficio mensual',description:'Membresía mensual de Free Fire.',image_url:'/assets/extra-monthly.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:70,created_at:now(),updated_at:now()},
      {id:8,name:'Cuenta Free Fire Premium',slug:'cuenta-ff-premium',category:'accounts',price_pen:35,old_price_pen:null,subtitle:'Cuenta lista para coordinar',description:'Cuenta digital. El administrador puede añadir una galería de fotos y videos desde el panel.',image_url:'/assets/account-ff.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:80,created_at:now(),updated_at:now()},
      {id:9,name:'Netflix 1 mes',slug:'netflix-1-mes',category:'entertainment',price_pen:12,old_price_pen:null,subtitle:'Acceso digital',description:'Servicio digital configurable desde el panel.',image_url:'/assets/ent-netflix.svg',gallery:[],stock_status:'available',featured:1,active:1,sort_order:10,created_at:now(),updated_at:now()},
      {id:10,name:'Spotify 1 mes',slug:'spotify-1-mes',category:'entertainment',price_pen:10,old_price_pen:null,subtitle:'Acceso digital',description:'Servicio digital configurable desde el panel.',image_url:'/assets/ent-spotify.svg',gallery:[],stock_status:'available',featured:0,active:1,sort_order:20,created_at:now(),updated_at:now()},
      {id:11,name:'Prime Video 1 mes',slug:'prime-video-1-mes',category:'entertainment',price_pen:9,old_price_pen:null,subtitle:'Acceso digital',description:'Servicio digital configurable desde el panel.',image_url:'/assets/ent-prime.svg',gallery:[],stock_status:'available',featured:0,active:1,sort_order:30,created_at:now(),updated_at:now()},
      {id:12,name:'Disney+ 1 mes',slug:'disney-plus-1-mes',category:'entertainment',price_pen:11,old_price_pen:null,subtitle:'Acceso digital',description:'Servicio digital configurable desde el panel.',image_url:'/assets/ent-disney.svg',gallery:[],stock_status:'available',featured:0,active:1,sort_order:40,created_at:now(),updated_at:now()}
    ],
    faqs: [
      {id:1,question:'¿Cuánto demora en llegar mi compra?',answer:'Después de confirmar el pago, el pedido queda registrado y el equipo coordina la entrega por WhatsApp.',sort_order:10,active:1},
      {id:2,question:'¿Es seguro ingresar mi ID?',answer:'El ID solo se solicita en productos que lo necesitan, como diamantes y extras. Nunca se solicita la contraseña del juego.',sort_order:20,active:1},
      {id:3,question:'¿Cómo realizo una compra?',answer:'Elige un producto, completa los datos solicitados, selecciona el método de pago y confirma. El sistema genera un voucher y prepara el mensaje de WhatsApp.',sort_order:30,active:1},
      {id:4,question:'¿Qué hago si tengo un problema?',answer:'Usa el botón de WhatsApp y comparte el código de pedido para que el equipo pueda revisarlo.',sort_order:40,active:1}
    ],
    payment_methods: [
      {id:1,name:'Yape',instructions:'Realiza el pago al número configurado y conserva tu comprobante.',image_url:'/assets/pay-yape.svg',active:1,sort_order:10},
      {id:2,name:'Plin',instructions:'Realiza el pago al número configurado y conserva tu comprobante.',image_url:'/assets/pay-plin.svg',active:1,sort_order:20},
      {id:3,name:'Transferencia',instructions:'Solicita los datos bancarios por WhatsApp.',image_url:'/assets/pay-bank.svg',active:1,sort_order:30}
    ],
    social_channels: [
      {id:1,name:'Instagram',platform:'Instagram',handle:'@dc_recargas',url:'',image_url:'',button_text:'Visitar Instagram',is_live:0,active:0,sort_order:10},
      {id:2,name:'TikTok',platform:'TikTok',handle:'@dc_recargas',url:'',image_url:'',button_text:'Visitar TikTok',is_live:0,active:0,sort_order:20},
      {id:3,name:'Canal de WhatsApp',platform:'WhatsApp',handle:'Comunidad DC',url:'',image_url:'',button_text:'Unirme al canal',is_live:0,active:0,sort_order:30}
    ],
    orders: []
  };
  persist();
}

function migrate() {
  data.counters ||= {};
  for (const key of ['users','products','faqs','payment_methods','orders','social_channels']) data.counters[key] ||= 0;
  data.settings ||= {};
  const defaults = {
    site_name:'DC RECARGAS', tagline:'Recargas, cuentas y entretenimiento digital con atención directa.', whatsapp_number:'51999999999', whatsapp_channel_url:'', pen_per_usd:'3.75', logo_url:'/assets/logo.svg', hero_title:'Todo tu entretenimiento digital en un solo lugar', hero_subtitle:'Compra diamantes, extras, cuentas y servicios digitales con un proceso claro, rápido y profesional.', hero_badge:'TIENDA DIGITAL', login_music_url:'', store_background_url:'', store_background_enabled:'0', store_background_overlay:'78', store_music_url:'', store_music_enabled:'0', store_music_volume:'35', store_music_autoplay:'1', store_music_loop:'1', store_music_start_muted:'0', support_text:'Atención directa por WhatsApp', footer_note:'Entrega coordinada · Pago seguro · Soporte directo', account_image_limit:'8', account_video_limit:'2', auto_refresh_seconds:'12', login_cover_url:'', storefront_notice:'Atención disponible todos los días'
  };
  for (const [k,v] of Object.entries(defaults)) if (data.settings[k] == null) data.settings[k] = v;
  data.products ||= [];
  for (const p of data.products) {
    if (!Array.isArray(p.gallery)) p.gallery = [];
    p.created_at ||= now(); p.updated_at ||= now();
  }
  data.faqs ||= []; data.payment_methods ||= []; data.orders ||= []; data.users ||= [];
  for (const u of data.users){ u.updated_at ||= u.created_at || now(); }
  if (!Array.isArray(data.social_channels)) data.social_channels = [];
  const maxIds = {
    users: Math.max(0,...data.users.map(x=>Number(x.id)||0)),
    products: Math.max(0,...data.products.map(x=>Number(x.id)||0)),
    faqs: Math.max(0,...data.faqs.map(x=>Number(x.id)||0)),
    payment_methods: Math.max(0,...data.payment_methods.map(x=>Number(x.id)||0)),
    orders: Math.max(0,...data.orders.map(x=>Number(x.id)||0)),
    social_channels: Math.max(0,...data.social_channels.map(x=>Number(x.id)||0))
  };
  for (const [k,v] of Object.entries(maxIds)) data.counters[k] = Math.max(data.counters[k]||0,v);
  persist();
}

function init() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_FILE)) {
    try { data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); migrate(); }
    catch { seed(); }
  } else seed();
  return data;
}
function get(){ return data; }
function save(){ persist(); }
module.exports = { init, get, save, nextId, hashPassword, verifyPassword };
