// Read-only answer aids. Deliberately separate from keyAnswer and scored keys.
export function attachProvisionalAids(paper, record, verdicts) {
  if (![2017, 2018, 2019, 2021].includes(paper.year) || record.paper.id !== paper.id || record.paper.year !== paper.year) throw new Error('Provisional paper identity mismatch');
  if (record.schemaVersion !== '1.1.0' || record.entries.length !== 100) throw new Error('Unsupported provisional records');
  const seen = new Set();
  for (const e of record.entries) {
    const q = paper.questions.find(q => q.n === e.q);
    if (!q || seen.has(e.q)) throw new Error('Missing or duplicate provisional question');
    seen.add(e.q);
    if (!['derived-provisional', 'unsolved'].includes(e.tier) || e.scoringEligibility !== 'held') throw new Error('Unexpected provisional tier/eligibility');
    const answer = e.tier === 'unsolved' && e.answer === null ? [] : e.answer;
    if (!Array.isArray(answer) || answer.some(a => !['A','B','C','D'].includes(a)) || new Set(answer).size !== answer.length || (e.tier === 'unsolved') !== (answer.length === 0)) throw new Error('Invalid provisional answer');
    const verdict = verdicts.get(`${paper.year}:${e.q}`);
    if (!verdict || verdict.stored !== (answer.join('') || '-')) throw new Error('Missing or stale provisional audit');
    const allowed = ['ANSWER-CONFIRMED','ANSWER-WRONG','ANSWER-AMBIGUOUS','ANSWER-NOT-CHECKABLE','UNSOLVED-CANDIDATE-PROPOSED','UNSOLVED-REMAINS-HELD'];
    if (!allowed.includes(verdict.status)) throw new Error('Unknown provisional audit verdict');
    const state = e.tier === 'unsolved' ? 'unsolved' : verdict.status === 'ANSWER-CONFIRMED' ? 'provisional' : 'withheld';
    q.provisionalAid = {
      state,
      answer: state === 'provisional' ? answer.join(', ') : null,
      note: state === 'provisional'
        ? 'Provisional study aid — not an official WBJEEB key or a verified answer. Imported label agrees with the qualified source audit, but current wording, option text and reasoning may still contain errors. Not used for scoring.'
        : state === 'unsolved'
          ? 'No integrated answer yet. Any proposed solution remains unapplied; this question is not scored.'
          : 'Imported answer withheld: the audit reports a disagreement, ambiguity or an uncheckable claim. No replacement answer has been chosen; this question is not scored.',
      source: 'Imported derived records, source revision 6a14ac1; comparison audit 53470c8.'
    };
  }
}
