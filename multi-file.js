/* FileForge 1.8 Multi-File Actions — additive tool, does not touch the main PWA data. */
'use strict';
(() => {
  const $ = (id) => document.getElementById(id);
  const M = {
    images: { accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp', max: 30, maxFile: 20 * 1048576, maxTotal: 50 * 1048576, symbol: '🖼️' },
    merge: { accept: 'application/pdf,.pdf', max: 12, maxFile: 20 * 1048576, maxTotal: 50 * 1048576, symbol: '📄' },
    zip: { accept: '*/*', max: 30, maxFile: 20 * 1048576, maxTotal: 60 * 1048576, symbol: '📁' }
  };
  const I18N = {
    bg: {
      back: 'Към FileForge', headline: 'Няколко файла. Едно действие.', subtitle: 'Създай PDF от снимки, обедини документи или направи ZIP. Файловете се обработват на телефона.', privacy: 'Без качване на файловете в сървър',
      tabImages: 'Снимки → PDF', tabMerge: 'Обедини PDF', tabZip: 'Създай ZIP',
      helpImages: 'Избери и подреди снимките — всяка ще бъде на отделна страница.', helpMerge: 'Избери поне два PDF документа и ги подреди в желания ред.', helpZip: 'Избери файловете, които искаш да събереш в един ZIP архив.',
      addImages: 'Добави снимки', addPdfs: 'Добави PDF документи', addFiles: 'Добави файлове', selected: 'Избрани файлове', empty: 'Още няма избрани файлове.', pageSize: 'Размер на PDF страницата', portrait: 'A4 · Вертикално', landscape: 'A4 · Хоризонтално', imageNote: 'По една снимка на страница. Прозрачните области стават бели. Големите изображения се намаляват при необходимост.',
      compression: 'Компресия', standard: 'Стандартна', fast: 'Бърза', none: 'Без компресиране', process: 'Обработи файловете', clear: 'Изчисти избора', ready: 'Файлът е готов', download: '↓ Изтегли файла', share: 'Сподели', saveReminder: 'Изтегли файла преди да затвориш този екран. Резултатът е временен.',
      important: 'Важно', note: 'Оригиналните файлове не се променят. PDF библиотеката изисква интернет при първото използване. Защитени с парола PDF не се поддържат. Тази добавка не променя основната PWA или нейните данни.', footer: 'Допълнителен инструмент за лично ползване',
      maxHint: 'До {max} файла · максимум 20 MB на файл · общо {total} MB', moved: 'Промених реда на файловете.', badFile: 'Неподдържан тип файл: {name}', bigFile: 'Файлът е над 20 MB: {name}', tooMany: 'Можеш да добавиш най-много {max} файла.', tooBig: 'Превишен е общият лимит от {total} MB.', needFiles: 'Добави файлове преди обработката.', needTwo: 'За обединяване са необходими поне два PDF документа.',
      preparing: 'Подготвям…', processing: 'Обработвам {current}/{total}: {name}', finished: 'Готово! Изтегли създадения файл.', error: 'Неуспешна обработка: {message}', brokenImage: 'Тази снимка не може да се отвори или е прекалено голяма.', brokenPdf: 'PDF не може да се отвори (може да е повреден или защитен с парола).', tooManyPages: 'PDF документите заедно имат повече от 120 страници.', pdfUnavailable: 'PDF библиотеката не може да се зареди. Провери интернет връзката и опитай отново.', zipUnavailable: 'ZIP библиотеката липсва. Провери дали jszip.min.js е в основната папка на GitHub.', processingError: 'Опитай с по-малки или други файлове.', shareUnavailable: 'Споделянето на файла не е налично в този браузър. Първо го изтегли от бутона Download.', shareCancelled: 'Споделянето е отменено.', copied: 'Изборът е изчистен.', pdfPages: '{count} страници', missingResult: 'Няма готов резултат.', noSpace: 'Телефонът няма достатъчно свободна памет за тази операция.',
      up: 'Нагоре', down: 'Надолу', remove: 'Премахни'
    },
    en: {
      back: 'Back to FileForge', headline: 'Multiple files. One action.', subtitle: 'Make a PDF from images, merge documents or create a ZIP. Files are processed on your phone.', privacy: 'No file uploads to a server',
      tabImages: 'Images → PDF', tabMerge: 'Merge PDF', tabZip: 'Create ZIP',
      helpImages: 'Select and order images — each image will become a separate page.', helpMerge: 'Select at least two PDF documents and arrange them in the correct order.', helpZip: 'Choose the files to bundle into a ZIP archive.',
      addImages: 'Add images', addPdfs: 'Add PDF documents', addFiles: 'Add files', selected: 'Selected files', empty: 'No files selected yet.', pageSize: 'PDF page size', portrait: 'A4 · Portrait', landscape: 'A4 · Landscape', imageNote: 'One image per page. Transparent areas become white. Large images are scaled down as needed.',
      compression: 'Compression', standard: 'Standard', fast: 'Fast', none: 'No compression', process: 'Process files', clear: 'Clear selection', ready: 'Your file is ready', download: '↓ Download file', share: 'Share', saveReminder: 'Download before closing this screen. The result is temporary.',
      important: 'Important', note: 'Original files are never modified. The PDF library requires internet on first use. Password-protected PDFs are unsupported. This add-on does not change your main PWA or its data.', footer: 'Extra tool for personal use',
      maxHint: 'Up to {max} files · 20 MB per file · {total} MB total', moved: 'File order changed.', badFile: 'Unsupported file type: {name}', bigFile: 'File exceeds 20 MB: {name}', tooMany: 'You can add at most {max} files.', tooBig: 'Total limit of {total} MB exceeded.', needFiles: 'Choose files first.', needTwo: 'Merging requires at least two PDFs.',
      preparing: 'Preparing…', processing: 'Processing {current}/{total}: {name}', finished: 'Ready! Download your new file.', error: 'Processing failed: {message}', brokenImage: 'This image cannot be opened or is too large.', brokenPdf: 'Unable to open the PDF (it may be corrupt or password-protected).', tooManyPages: 'The PDFs contain over 120 pages in total.', pdfUnavailable: 'PDF library could not load. Check your internet connection and retry.', zipUnavailable: 'ZIP library is missing. Ensure jszip.min.js is in your GitHub repository root.', processingError: 'Try smaller or different files.', shareUnavailable: 'File sharing is not supported by this browser. Download the file first.', shareCancelled: 'Sharing cancelled.', copied: 'Selection cleared.', pdfPages: '{count} pages', missingResult: 'There is no result to save.', noSpace: 'Insufficient memory available for this operation.',
      up: 'Move up', down: 'Move down', remove: 'Remove'
    }
  };
  const S = { mode: 'images', lang: 'bg', groups: {images: [], merge: [], zip: []}, result: null, busy: false };
  let uid = 1;
  let loadingPdf = null;
  const fmt = (key, data = {}) => (I18N[S.lang][key] || key).replace(/\{(\w+)\}/g, (_, name) => String(data[name] ?? ''));
  const size = (n) => n >= 1048576 ? (n / 1048576).toFixed(2) + ' MB' : n >= 1024 ? (n / 1024).toFixed(0) + ' KB' : n + ' B';

  function setStatus(message, error = false) {
    const node = $('status'); node.hidden = !message; node.textContent = message; node.classList.toggle('error', error);
  }
  function clearResult() {
    if (S.result?.url) URL.revokeObjectURL(S.result.url);
    S.result = null; $('result').hidden = true; $('download').removeAttribute('href');
  }
  function active() { return S.groups[S.mode]; }
  function totalBytes(mode = S.mode) { return S.groups[mode].reduce((n, e) => n + e.file.size, 0); }
  function allowed(file, mode) {
    const n = file.name.toLowerCase();
    if (mode === 'images') return /\.(jpe?g|png|webp)$/.test(n) || ['image/jpeg','image/png','image/webp'].includes(file.type);
    if (mode === 'merge') return /\.pdf$/.test(n) || file.type === 'application/pdf';
    return true;
  }
  function repaintLanguage() {
    document.documentElement.lang = S.lang;
    document.querySelectorAll('[data-t]').forEach(el => {el.textContent = fmt(el.dataset.t);});
    $('language').textContent = S.lang === 'bg' ? 'EN' : 'BG';
    showMode();
  }
  function showMode() {
    document.querySelectorAll('.tab').forEach(btn => {
      const selected = btn.dataset.mode === S.mode;
      btn.classList.toggle('active',selected); btn.setAttribute('aria-selected',String(selected));
      btn.disabled = S.busy;
    });
    $('modeTitle').textContent = fmt(S.mode === 'images' ? 'tabImages' : S.mode === 'merge' ? 'tabMerge' : 'tabZip');
    $('modeHelp').textContent = fmt(S.mode === 'images' ? 'helpImages' : S.mode === 'merge' ? 'helpMerge' : 'helpZip');
    $('pickLabel').textContent = fmt(S.mode === 'images' ? 'addImages' : S.mode === 'merge' ? 'addPdfs' : 'addFiles');
    const c = M[S.mode];
    $('limits').textContent = fmt('maxHint',{max:c.max,total:c.maxTotal/1048576});
    $('fileInput').accept = c.accept;
    $('fileInput').disabled = S.busy;
    $('imageOptions').hidden = S.mode !== 'images';
    $('zipOptions').hidden = S.mode !== 'zip';
    $('process').disabled = S.busy || active().length < (S.mode === 'merge' ? 2 : 1);
    $('clear').disabled = S.busy || active().length === 0;
    drawList();
  }
  function drawList() {
    const root = $('fileList'); root.replaceChildren();
    const entries = active();
    $('count').textContent = entries.length + ' · ' + size(totalBytes());
    if (!entries.length) {
      const p = document.createElement('p'); p.className = 'empty'; p.textContent = fmt('empty'); root.append(p); return;
    }
    entries.forEach((e,i) => {
      const row=document.createElement('div'); row.className='file-row';
      const icon=document.createElement('div');icon.className='file-icon';icon.textContent=M[S.mode].symbol;
      const meta=document.createElement('div');meta.className='file-meta';
      const name=document.createElement('strong');name.textContent=(i+1)+'. '+e.file.name;name.title=e.file.name;
      const details=document.createElement('small');details.textContent=size(e.file.size);
      meta.append(name,details);
      const controls=document.createElement('div');controls.className='file-commands';
      const button=(symbol,title,fn,disabled)=>{const b=document.createElement('button');b.className='iconbutton';b.type='button';b.textContent=symbol;b.title=title;b.setAttribute('aria-label',title);b.disabled=S.busy||disabled;b.addEventListener('click',fn);return b;};
      controls.append(
        button('↑',fmt('up'),()=>move(i,-1),i===0),
        button('↓',fmt('down'),()=>move(i,1),i===entries.length-1),
        button('✕',fmt('remove'),()=>{entries.splice(i,1);clearResult();setStatus('');showMode();},false)
      );
      row.append(icon,meta,controls);root.append(row);
    });
  }
  function move(i,offset) {
    if(S.busy)return;
    const entries=active();const next=i+offset;
    if(next < 0 || next >= entries.length)return;
    [entries[i],entries[next]]=[entries[next],entries[i]];
    clearResult(); setStatus('');showMode();
  }
  function addFiles(files) {
    if(S.busy)return;
    const config=M[S.mode], entries=active();
    for(const file of files){
      if(entries.length>=config.max){setStatus(fmt('tooMany',{max:config.max}),true);break;}
      if(!allowed(file,S.mode)){setStatus(fmt('badFile',{name:file.name}),true);continue;}
      if(file.size>config.maxFile){setStatus(fmt('bigFile',{name:file.name}),true);continue;}
      if(totalBytes()+file.size>config.maxTotal){setStatus(fmt('tooBig',{total:config.maxTotal/1048576}),true);break;}
      entries.push({id:uid++,file});
    }
    clearResult();showMode();
  }
  function filenameStem(name) {
    return String(name || 'fileforge').replace(/\.[^/.]+$/,'').replace(/[\u0000-\u001f\\/:*?"<>|]/g,'_').trim().slice(0,60) || 'fileforge';
  }
  function safeZipName(name, taken) {
    const raw=String(name||'file').replace(/[\\/]/g,'_').replace(/[\u0000-\u001f\u007f:*?"<>|]/g,'_').replace(/^\.+/,'').trim().slice(0,110)||'file';
    const dot=raw.lastIndexOf('.'),stem=dot>0?raw.slice(0,dot):raw,ext=dot>0?raw.slice(dot):'';
    let candidate=raw,index=2;
    while(taken.has(candidate.toLowerCase()))candidate=stem+' ('+(index++)+')'+ext;
    taken.add(candidate.toLowerCase());return candidate;
  }
  async function loadPdfLib() {
    if(window.PDFLib?.PDFDocument)return window.PDFLib;
    if(!loadingPdf){
      loadingPdf=new Promise((resolve,reject)=>{
        const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';s.async=true;
        s.onload=()=>window.PDFLib?.PDFDocument?resolve(window.PDFLib):reject(new Error(fmt('pdfUnavailable')));
        s.onerror=()=>reject(new Error(fmt('pdfUnavailable')));
        document.head.append(s);
      }).catch(err=>{loadingPdf=null;throw err;});
    }
    return loadingPdf;
  }
  async function imageToJpeg(file){
    const url=URL.createObjectURL(file);let img;
    try{
      img=new Image();img.decoding='async';img.src=url;
      if(img.decode)await img.decode();else await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;});
      const w=img.naturalWidth,h=img.naturalHeight;
      if(!w||!h||w*h>25000000)throw Error(fmt('brokenImage'));
      const k=Math.min(1,2200/Math.max(w,h));const width=Math.max(1,Math.round(w*k));const height=Math.max(1,Math.round(h*k));
      const c=document.createElement('canvas');c.width=width;c.height=height;
      const ctx=c.getContext('2d',{alpha:false});if(!ctx)throw Error(fmt('noSpace'));
      ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,width,height);
      const blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error(fmt('brokenImage'))),'image/jpeg',.86));
      c.width=0;c.height=0;
      return {buffer:await blob.arrayBuffer(),width,height};
    }catch(e){throw Error(fmt('brokenImage'));}
    finally{URL.revokeObjectURL(url);if(img)img.src='';}
  }
  async function makeImagePdf(entries){
    const lib=await loadPdfLib();const pdf=await lib.PDFDocument.create();
    const landscape=$('pageSize').value==='landscape';const pW=landscape?841.89:595.28,pH=landscape?595.28:841.89;
    for(let i=0;i<entries.length;i++){
      const f=entries[i].file;setStatus(fmt('processing',{current:i+1,total:entries.length,name:f.name}));
      const source=await imageToJpeg(f);const jpg=await pdf.embedJpg(source.buffer);
      const margin=18,scale=Math.min((pW-2*margin)/source.width,(pH-2*margin)/source.height);
      const w=source.width*scale,h=source.height*scale;
      const page=pdf.addPage([pW,pH]);page.drawImage(jpg,{x:(pW-w)/2,y:(pH-h)/2,width:w,height:h});
    }
    const bytes=await pdf.save();return {blob:new Blob([bytes],{type:'application/pdf'}),name:'fileforge_images_'+dateTag()+'.pdf'};
  }
  async function mergePdf(entries){
    const lib=await loadPdfLib();const merged=await lib.PDFDocument.create();let count=0;
    for(let i=0;i<entries.length;i++){
      const f=entries[i].file;setStatus(fmt('processing',{current:i+1,total:entries.length,name:f.name}));
      let source;
      try{
        const a=await f.arrayBuffer();
        // Reject non-PDF data before asking pdf-lib to parse it.
        const header=new TextDecoder('latin1').decode(a.slice(0,1024));
        if(!header.includes('%PDF-'))throw Error('not a PDF');
        source=await lib.PDFDocument.load(a,{updateMetadata:false});
      }catch{throw Error(fmt('brokenPdf')+' '+f.name);}
      const pages=source.getPageCount();count+=pages;
      if(count>120)throw Error(fmt('tooManyPages'));
      const copy=await merged.copyPages(source,Array.from({length:pages},(_,j)=>j));
      copy.forEach(p=>merged.addPage(p));
    }
    const bytes=await merged.save();return {blob:new Blob([bytes],{type:'application/pdf'}),name:'fileforge_merged_'+dateTag()+'.pdf'};
  }
  async function createZip(entries){
    if(typeof window.JSZip!=='function')throw Error(fmt('zipUnavailable'));
    const zip=new window.JSZip();const taken=new Set();
    for(let i=0;i<entries.length;i++){
      const file=entries[i].file;
      setStatus(fmt('processing',{current:i+1,total:entries.length,name:file.name}));
      zip.file(safeZipName(file.name,taken),await file.arrayBuffer(),{date:new Date(file.lastModified||Date.now())});
    }
    const level=Number($('compression').value);
    const blob=await zip.generateAsync({type:'blob',compression:level===0?'STORE':'DEFLATE',compressionOptions:{level:level||1},streamFiles:true});
    return {blob,name:'fileforge_files_'+dateTag()+'.zip'};
  }
  function dateTag(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('');}
  async function process(){
    if(S.busy)return;
    const mode=S.mode,entries=active().slice();
    if(entries.length<(mode==='merge'?2:1)){setStatus(fmt(mode==='merge'?'needTwo':'needFiles'),true);return;}
    S.busy=true;clearResult();showMode();setStatus(fmt('preparing'));
    try{
      const result=mode==='images'?await makeImagePdf(entries):mode==='merge'?await mergePdf(entries):await createZip(entries);
      if(!(result.blob?.size>0))throw Error(fmt('processingError'));
      const url=URL.createObjectURL(result.blob);S.result={...result,url};
      $('download').href=url;$('download').download=result.name;
      $('resultInfo').textContent=result.name+' · '+size(result.blob.size);
      $('result').hidden=false;
      setStatus(fmt('finished'));
    }catch(e){
      console.error('Multi-file action failed',e);
      setStatus(fmt('error',{message:e instanceof Error?e.message:fmt('processingError')}),true);
    }finally{S.busy=false;showMode();}
  }
  async function shareResult(){
    const r=S.result;
    if(!r){setStatus(fmt('missingResult'),true);return;}
    const f=new File([r.blob],r.name,{type:r.blob.type||'application/octet-stream'});
    try{
      if(!navigator.share||!navigator.canShare?.({files:[f]}))throw Error(fmt('shareUnavailable'));
      await navigator.share({files:[f],title:r.name});
    }catch(e){if(e.name==='AbortError')setStatus(fmt('shareCancelled'));else setStatus(fmt('shareUnavailable'),true);}
  }
  function init(){
    document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{if(S.busy)return;S.mode=btn.dataset.mode;clearResult();setStatus('');showMode();}));
    $('language').addEventListener('click',()=>{S.lang=S.lang==='bg'?'en':'bg';repaintLanguage();});
    $('fileInput').addEventListener('change',e=>{addFiles(Array.from(e.target.files||[]));e.target.value='';});
    $('process').addEventListener('click',process);
    $('clear').addEventListener('click',()=>{if(S.busy)return;S.groups[S.mode]=[];clearResult();setStatus(fmt('copied'));showMode();});
    $('share').addEventListener('click',shareResult);
    $('pageSize').addEventListener('change',clearResult);
    $('compression').addEventListener('change',clearResult);
    window.addEventListener('pagehide',clearResult);
    repaintLanguage();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
