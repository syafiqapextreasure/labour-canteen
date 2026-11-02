import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {enquiryTarget} from '../public/contact.mjs';
import worker from '../src/worker.js';
import {paths, dishes, esc} from '../src/pages.mjs';
import {config} from '../src/config.mjs';

const root = path.resolve('dist');
const routes = Object.values(paths).flatMap(p => [p, '/bm' + (p === '/' ? '' : p)]);
const diskPath = route => path.join(root, route === '/' ? 'index.html' : route.slice(1) + '.html');

test('24 static routes have complete metadata, one h1, valid assets and real internal links', async () => {
  for (const route of routes) {
    const html = await fs.readFile(diskPath(route), 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, route);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.ok(html.includes('rel="canonical" href="' + config.origin), route);
    assert.match(html, /hreflang="ms"/);
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
    assert.ok(JSON.parse(json)['@graph'].some(x => x['@type'] === 'FoodEstablishment'));
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs: ' + route);
    for (const [, target] of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)) {
      if (target.startsWith('//')) continue;
      const file = target.includes('.') ? path.join(root, target) : diskPath(target);
      await assert.doesNotReject(fs.access(file), route + ' -> ' + target);
    }
  }
});

test('all 75 menu entries and original dish assets are present', async () => {
  assert.equal(dishes.length, 75);
  assert.equal(new Set(dishes.map(d => d.id)).size, 75);
  for (const [meal, count, route] of [['breakfast', 29, '/menus/breakfast'], ['lunch', 32, '/menus/lunch'], ['tea', 14, '/menus/tea-time']]) {
    const subset = dishes.filter(d => d.meal === meal);
    assert.equal(subset.length, count);
    const html = await fs.readFile(diskPath(route), 'utf8');
    for (const dish of subset) {
      assert.ok(html.includes(esc(dish.name)), dish.name);
      await fs.access(path.join(root, dish.image));
    }
  }
});

test('business facts, personal training scope and price-free subsidy concept are retained', async () => {
  const kitchen = await fs.readFile(diskPath('/central-kitchen'), 'utf8');
  assert.match(kitchen, /1,000/); assert.doesNotMatch(kitchen, /5,000/);
  assert.match(kitchen, /Jalan Lontar Peluru 13\/39/);
  const subsidy = await fs.readFile(diskPath('/subsidy-support'), 'utf8');
  assert.doesNotMatch(subsidy, /RM\s*\d/i);
  assert.match(subsidy, /company settles its agreed contribution with us later/);
  const story = await fs.readFile(diskPath('/our-story'), 'utf8');
  assert.match(story, /AZLINHAN AKBAR KHAN/);
  assert.match(story, /MUHAMMAD ALIYAS NAINA MOHAMED/);
  assert.match(story, /Individual training and professional development/);
  assert.doesNotMatch(story, /900501|JAKIM.HPB|halal.certified/i);
});

test('Malay HTML and browser translation dictionary are complete', async () => {
  const source = JSON.parse(await fs.readFile('src/translation-source.json', 'utf8'));
  const ms = JSON.parse(await fs.readFile('dist/translations/ms.json', 'utf8'));
  for (const key of source) assert.ok(ms[key], key);
  const html = await fs.readFile(diskPath('/bm/weekly-planner'), 'utf8');
  assert.match(html, /<html lang="ms">/);
  assert.match(html, /Simpan Draf/);
});

test('enquiry targets encode user text, use supplied contacts and include a plan only by choice', () => {
  const fields = {name: 'QA & team', company: 'Apex #1', email: 'qa@example.test', phone: '0123456789', workers: '120', message: 'No nuts & mild', includePlan: true};
  const whatsapp = new URL(enquiryTarget(fields, 'Monday: Nasi ayam'));
  assert.equal(whatsapp.origin + whatsapp.pathname, 'https://wa.me/60198176003');
  assert.match(whatsapp.searchParams.get('text'), /QA & team/);
  assert.match(whatsapp.searchParams.get('text'), /Monday: Nasi ayam/);
  const email = new URL(enquiryTarget({...fields, includePlan: false}, 'SECRET PLAN', 'email', 'ms'));
  assert.equal(email.pathname, 'mail@labourcanteen.com');
  assert.match(email.searchParams.get('body'), /Syarikat: Apex #1/);
  assert.doesNotMatch(email.searchParams.get('body'), /SECRET PLAN/);
  assert.throws(() => enquiryTarget({name: '', company: ''}));
});

test('Worker keeps clean URL redirects and correct not-found status', async () => {
  for (const [from, to] of [['/menus.html?plan=1', '/menus?plan=1'], ['/index.html', '/'], ['/bm/index.html', '/bm']]) {
    const response = await worker.fetch(new Request('https://labourcanteen.com' + from), {});
    assert.equal(response.status, 301); assert.equal(response.headers.get('location'), 'https://labourcanteen.com' + to);
  }
  const response = await worker.fetch(new Request('https://labourcanteen.com/missing'), {ASSETS: {fetch: () => new Response('Not found', {status: 404})}});
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('sitemap contains every clean route and robots points to it', async () => {
  const sitemap = await fs.readFile('dist/sitemap.xml', 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 24);
  assert.doesNotMatch(sitemap, /\.html/);
  assert.ok((await fs.readFile('dist/robots.txt', 'utf8')).includes('Sitemap: ' + config.origin + '/sitemap.xml'));
});
