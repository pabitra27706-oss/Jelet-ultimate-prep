import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {provisionalQuestions,provisionalResult} from '../src/lib/provisional-practice.mjs';
const papers=JSON.parse(readFileSync('src/data/papers.json')).papers;
test('provisional feedback has a separate pool; no eligibility promotion or uncertain labels',()=>{
 for(const year of [2017,2018,2019,2021]){
  const p=papers.find(p=>p.year===year), qs=provisionalQuestions(p);
  assert.ok(qs.length>0);
  for(const q of qs){assert.equal(q.provisionalAid.state,'provisional');assert.equal(q.scorable,false);assert.equal(q.keyAnswer,null);assert.equal(q.category,'I');}
 }
 const p=papers.find(p=>p.year===2017), q=structuredClone(provisionalQuestions(p)[0]);
 for(const mutate of [q=>q.provisionalAid.state='withheld',q=>q.provisionalAid.answer='A, B',q=>q.optionsComplete=false,q=>{q.figure=true;q.figureAsset=null;}]){
  const c=structuredClone(q);mutate(c);assert.equal(provisionalQuestions({questions:[c]}).length,0);
 }
});
test('provisional feedback marks agreement, disagreement and blanks using +1/-quarter',()=>{
 const items=[{id:'a',answer:'A'},{id:'b',answer:'B'},{id:'c',answer:'C'}];
 assert.deepEqual(provisionalResult(items,{a:'A',b:'D'}),{correct:1,wrong:1,blank:1,score:.75,maximum:3});
 assert.equal(provisionalResult(items,{}).score,0);
 assert.equal(provisionalResult(items,{a:'D',b:'D',c:'D'}).score,-.75);
});
