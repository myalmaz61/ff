// FileForge 1.10.0 — portable offline shell; shared URLs and user files are never cached.
const VERSION='1.10.0';
const CACHE='fileforge-shell-'+VERSION;
const FILES=[
 './','./index.html','./styles.css','./app.js','./results.js',
 './pdf-studio.js','./archive-studio.js','./jszip.min.js','./library.js',
 './batch-studio.js','./audio-studio.js','./video-studio.js',
 './downloads-studio.js','./health.js','./file-desk.js',
 './multi-file.html','./multi-file.css','./multi-file.js',
 './portable-backup.html',
 './manifest.webmanifest','./icon-192.png','./icon-512.png'
];
const APP_FILES=new Set(FILES.filter(x=>x!=='./').map(x=>x.slice(2)));
const SCOPE=new URL(self.registration.scope);
const PDF_LIB='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const PDFJS_FILES=new Set([
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
]);
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.all(FILES.map(async path=>{
   const response=await fetch(new Request(path,{cache:'reload'}));
   if(!response.ok)throw new Error('App shell: '+path+' status '+response.status);
   await cache.put(path,response);
  }));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith('fileforge-shell-')&&name!==CACHE).map(name=>caches.delete(name)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.href===PDF_LIB||PDFJS_FILES.has(url.href)){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const saved=await cache.match(url.href);if(saved)return saved;
   try{const response=await fetch(req);if(response.ok||response.type==='opaque')await cache.put(url.href,response.clone());return response;}
   catch{return Response.error();}
  })());return;
 }
 if(url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
 const name=url.pathname.slice(SCOPE.pathname.length);
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   try{return await fetch(req);}catch{
    const cache=await caches.open(CACHE);
    if(name==='multi-file.html')return await cache.match('./multi-file.html')||Response.error();
    if(name==='portable-backup.html')return await cache.match('./portable-backup.html')||Response.error();
    return await cache.match('./index.html')||Response.error();
   }
  })());return;
 }
 if(!APP_FILES.has(name))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match('./'+name);
  if(cached)return cached;
  try{const response=await fetch(req);if(response.ok&&response.type==='basic')await cache.put('./'+name,response.clone());return response;}
  catch{return Response.error();}
 })());
});
