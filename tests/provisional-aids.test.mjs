import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {attachProvisionalAids} from '../scripts/provisional-aids.mjs';
const papers=JSON.parse(readFileSync('src/data/papers.json')).papers;
const rows=readFileSync('docs/audits/2026-11-21-jelet-2017-2022-reconciliation-7903a34.tsv','utf8').trim().split('\n').slice(1).map(l=>l.split('\t'));
const verdicts=new Map(rows.map(r=>[`${r[0]}:${r[1]}`,{stored:r[2],status:r[4]}]));
const record=JSON.parse(readFileSync('editorial/derived-keys/2017/2017-keys.json'));
const fresh=()=>structuredClone(papers.find(p=>p.year===2017));
test('400 aids include 262 provisional reveals, 59 withheld and 79 unsolved without scoring',()=>{
 const qs=papers.flatMap(p=>p.questions).filter(q=>q.provisionalAid);
 assert.equal(qs.length,400);
 for(const [state,n] of [['provisional',262],['withheld',59],['unsolved',79]]) assert.equal(qs.filter(q=>q.provisionalAid.state===state).length,n);
 for(const q of qs){assert.equal(q.scorable,false);assert.equal(q.keyAnswer,null);assert.equal(q.hasKey,false);assert.equal(q.boardAwarded,false);assert.equal(q.voided,false);if(q.provisionalAid.state!=='provisional')assert.equal(q.provisionalAid.answer,null);}
});
test('provisional import rejects mismatches, duplicate entries and tier promotions',()=>{
 for(const change of [r=>r.paper.year=2025,r=>r.schemaVersion='9',r=>r.entries[0].tier='derived-verified',r=>r.entries[0].scoringEligibility='eligible',r=>r.entries[1]=r.entries[0],r=>r.entries[0].answer=['W']]){
  const r=structuredClone(record);change(r);assert.throws(()=>attachProvisionalAids(fresh(),r,verdicts));
 }
 assert.throws(()=>attachProvisionalAids(fresh(),record,new Map()));
 const stale=new Map(verdicts);stale.set('2017:1',{stored:'D',status:'ANSWER-CONFIRMED'});assert.throws(()=>attachProvisionalAids(fresh(),record,stale));
});
