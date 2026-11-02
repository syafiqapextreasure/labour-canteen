import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('shared WhatsApp panel is present across EN and BM pages with three valid contact links',async()=>{
 for(const file of ['index.html','menus.html','weekly-planner.html','central-kitchen.html','subsidy-support.html','our-story.html','bm/our-story.html']){
 const html=await fs.readFile('dist/'+file,'utf8');assert.match(html,/id="whatsapp-panel"/);assert.equal((html.match(/https:\/\/wa\.me\/60198176003\?text=/g)||[]).length>=3,true);assert.match(html,/aria-controls="whatsapp-panel" aria-expanded="false"/);
 }
});
test('story contains supplied partners, two biographies and five training records',async()=>{const html=await fs.readFile('dist/our-story.html','utf8');for(const name of ['KPJ Rawang Specialist Hospital','GE Aviation Subang','KERRY'])assert.ok(html.includes(name));assert.equal((html.match(/class="leader-bio"/g)||[]).length,2);assert.equal((html.match(/class="certificate-number"/g)||[]).length,5);assert.ok(!html.includes('900501'));});
