import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {document,paths,setLocale,catalog} from '../src/pages.mjs';
import {config} from '../src/config.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw new Error('Unsafe build output path');
await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});
await fs.cp(path.join(root,'public'),out,{recursive:true});
await fs.mkdir(path.join(out,'fonts'),{recursive:true});
await fs.copyFile(path.join(root,'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),path.join(out,'fonts/inter-latin-wght-normal.woff2'));
let ms={};try{ms=JSON.parse(await fs.readFile(path.join(root,'src/ms.json'),'utf8'));}catch{}
await fs.mkdir(path.join(out,'translations'),{recursive:true});
await fs.writeFile(path.join(out,'translations/ms.json'),JSON.stringify(ms));
const urls=[];
for(const lang of ['en','ms']){setLocale(lang,ms);for(const [key,route] of Object.entries(paths)){const url=(lang==='ms'?'/bm':'')+(route==='/'?(lang==='ms'?'':'/'):route);const file=url==='/'?'index.html':url.slice(1)+'.html';await fs.mkdir(path.dirname(path.join(out,file)),{recursive:true});await fs.writeFile(path.join(out,file),document(key));urls.push(url);}}
await fs.writeFile(path.join(root,'src/translation-source.json'),JSON.stringify([...catalog].sort(),null,2));
await fs.writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(p=>`<url><loc>${config.origin+p}</loc></url>`).join('')}</urlset>`);
await fs.writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${config.origin}/sitemap.xml\n`);
await fs.writeFile(path.join(out,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Labour Canteen</title><link rel="stylesheet" href="/site.css"></head><body><main class="container prose"><h1>That page is not on the menu.</h1><p>Let's help you find your way.</p><a class="button primary" href="/">Back to Labour Canteen</a></main></body></html>`);
console.log(`Built ${urls.length} pages. Canonical origin: ${config.origin}. ${catalog.size} translation strings.`);
