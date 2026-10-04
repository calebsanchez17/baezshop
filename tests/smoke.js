const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const db = path.join(root, 'data', 'store.json');
const uploads = path.join(root, 'uploads');
if (fs.existsSync(db)) fs.unlinkSync(db);
fs.mkdirSync(uploads,{recursive:true});
const beforeUploads = new Set(fs.readdirSync(uploads));
const child = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: '3210', NODE_ENV: 'test' }, stdio: ['ignore','pipe','pipe'] });
let ready = false;
function cleanup(){
  try{child.kill();}catch{}
  try{if(fs.existsSync(db))fs.unlinkSync(db);}catch{}
  try{for(const f of fs.readdirSync(uploads))if(!beforeUploads.has(f))fs.unlinkSync(path.join(uploads,f));}catch{}
}
const timer = setTimeout(()=>{ console.error('Servidor no inició'); cleanup(); process.exit(1); }, 12000);
child.stdout.on('data', async d => {
  if (ready || !String(d).includes('listo en')) return;
  ready = true;
  try {
    const settingsR = await fetch('http://localhost:3210/api/public/settings');
    if (!settingsR.ok) throw new Error('settings falló');
    const settings = await settingsR.json();
    if (!('account_image_limit' in settings)) throw new Error('settings multimedia faltan');
    if (!('store_background_url' in settings) || !('store_music_volume' in settings)) throw new Error('settings de apariencia faltan');

    const productsR = await fetch('http://localhost:3210/api/public/products?category=diamonds-accounts');
    const list = await productsR.json();
    if (!Array.isArray(list) || !list.length) throw new Error('productos vacíos');

    const login = await fetch('http://localhost:3210/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:'dcbaez2026',password:'baez1234'}) });
    if (!login.ok) throw new Error('login falló');
    const cookie = login.headers.get('set-cookie').split(';')[0];
    const authHeaders = {'Content-Type':'application/json','Cookie':cookie};

    const dash = await fetch('http://localhost:3210/api/admin/dashboard',{headers:{Cookie:cookie}});
    if (!dash.ok) throw new Error('dashboard falló');

    const appearanceUpdate = await fetch('http://localhost:3210/api/admin/settings',{method:'PUT',headers:authHeaders,body:JSON.stringify({store_background_url:'/assets/diamond-572.svg',store_background_enabled:'1',store_background_overlay:'66',store_music_enabled:'1',store_music_volume:'61',store_music_autoplay:'0',store_music_loop:'1'})});
    if (!appearanceUpdate.ok) throw new Error('guardar apariencia falló');
    const publicAppearance = await (await fetch('http://localhost:3210/api/public/settings')).json();
    if (publicAppearance.store_background_enabled!=='1' || publicAppearance.store_background_overlay!=='66' || publicAppearance.store_music_volume!=='61') throw new Error('apariencia pública no se actualizó');

    const created = await fetch('http://localhost:3210/api/admin/products',{method:'POST',headers:authHeaders,body:JSON.stringify({name:'Cuenta prueba',category:'accounts',price_pen:25,subtitle:'Demo',description:'Demo',image_url:'/assets/account-ff.svg',gallery:[{type:'image',url:'/assets/account-ff.svg'}],stock_status:'available',active:true})});
    if (!created.ok) throw new Error('crear producto falló');
    const createdProduct = await created.json();

    const edited = await fetch(`http://localhost:3210/api/admin/products/${createdProduct.id}`,{method:'PUT',headers:authHeaders,body:JSON.stringify({...createdProduct,name:'Cuenta prueba editada',price_pen:27})});
    if (!edited.ok) throw new Error('editar producto falló');

    const social = await fetch('http://localhost:3210/api/admin/social-channels',{method:'POST',headers:authHeaders,body:JSON.stringify({name:'Canal prueba',platform:'YouTube',url:'https://example.com',is_live:true,active:true})});
    if (!social.ok) throw new Error('crear canal falló');
    const socialObj = await social.json();
    const hiddenSocial = await fetch('http://localhost:3210/api/admin/social-channels',{method:'POST',headers:authHeaders,body:JSON.stringify({name:'TikTok sin enlace',platform:'TikTok',url:'',is_live:false,active:false})});
    if (!hiddenSocial.ok) throw new Error('crear canal oculto falló');
    const hiddenObj = await hiddenSocial.json();
    const toggleLive = await fetch(`http://localhost:3210/api/admin/social-channels/${hiddenObj.id}`,{method:'PATCH',headers:authHeaders,body:JSON.stringify({is_live:true})});
    if (!toggleLive.ok) throw new Error('marcar EN VIVO falló');
    const publicSocials = await (await fetch('http://localhost:3210/api/public/social-channels')).json();
    const publicLive = publicSocials.find(x=>x.id===hiddenObj.id);
    if (!publicLive || !publicLive.is_live || !publicLive.active) throw new Error('canal EN VIVO no aparece públicamente');
    const html = fs.readFileSync(path.join(root,'public','index.html'),'utf8');
    if ((html.match(/class=\"category-card/g)||[]).length !== 3) throw new Error('la portada no tiene tres paneles principales');

    const staff = await fetch('http://localhost:3210/api/admin/users',{method:'POST',headers:authHeaders,body:JSON.stringify({username:'trabajador1',display_name:'Trabajador Uno',password:'password123'})});
    if (!staff.ok) throw new Error('crear administrador falló');

    const upload = await fetch('http://localhost:3210/api/admin/upload',{method:'POST',headers:authHeaders,body:JSON.stringify({mime:'image/svg+xml',data:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>').toString('base64')})});
    if (!upload.ok) throw new Error('upload falló');

    const methods = await (await fetch('http://localhost:3210/api/public/payment-methods')).json();
    const diamond = list.find(p=>p.category==='diamonds');
    const diamondOrder = await fetch('http://localhost:3210/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:diamond.id,customer_game_id:'12345678',payment_method_id:methods[0].id})});
    if (!diamondOrder.ok) throw new Error('pedido de diamantes falló');

    const accountOrder = await fetch('http://localhost:3210/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:createdProduct.id,customer_name:'Cliente Demo',payment_method_id:methods[0].id})});
    if (!accountOrder.ok) throw new Error('pedido de cuenta sin ID falló');

    const deleted = await fetch(`http://localhost:3210/api/admin/products/${createdProduct.id}`,{method:'DELETE',headers:{Cookie:cookie}});
    if (!deleted.ok) throw new Error('eliminar producto falló');

    console.log('SMOKE TEST OK');
    clearTimeout(timer); cleanup(); process.exit(0);
  } catch (e) { console.error(e); clearTimeout(timer); cleanup(); process.exit(1); }
});
child.stderr.on('data', d => process.stderr.write(d));
process.on('exit', cleanup);
