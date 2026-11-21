// Owner-approved provisional exercise feedback; never an official/verified score.
export function provisionalQuestions(paper) {
  return paper.questions.filter(q => q.provisionalAid?.state === 'provisional'
    && /^[ABCD]$/.test(q.provisionalAid.answer ?? '')
    && q.category === 'I' && q.optionsComplete && q.options.length === 4
    && (!q.figure || Boolean(q.figureAsset)));
}
export function provisionalResult(items, selected) {
  let correct = 0, wrong = 0, blank = 0;
  for (const item of items) {
    const choice = selected[item.id];
    if (!choice) blank++;
    else if (choice === item.answer) correct++;
    else wrong++;
  }
  return { correct, wrong, blank, score: correct - wrong / 4, maximum: items.length };
}
