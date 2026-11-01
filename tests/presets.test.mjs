import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mealPresets,presetDishNames,presetMealIds} from '../public/presets.mjs';
const dishes=JSON.parse(fs.readFileSync(new URL('../public/assets/dishes.json',import.meta.url)));
test('all nine presets resolve existing dishes in the correct meal category',()=>{for(const meal of ['breakfast','lunch','tea'])for(let index=0;index<3;index++){assert.ok(presetDishNames(meal,index).length>=3);for(let day=0;day<7;day++){const ids=presetMealIds(dishes,meal,index,day);assert.ok(ids.length);assert.ok(ids.every(id=>dishes.some(d=>d.id===id&&d.meal===meal)));}}});
test('weekly presets rotate combinations and reject invalid selection',()=>{assert.notDeepEqual(presetMealIds(dishes,'lunch',1,0),presetMealIds(dishes,'lunch',1,1));assert.deepEqual(presetMealIds(dishes,'lunch',1,0),presetMealIds(dishes,'lunch',1,3));assert.throws(()=>presetMealIds(dishes,'dinner',0));});
