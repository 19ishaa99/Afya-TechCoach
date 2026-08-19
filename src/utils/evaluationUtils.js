const normalizeAnswer = value =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[.,;!]/g, '')
    .replace(/\s+/g, ' ');

const evaluateDiagnosis = (studentAnswer, acceptedDiagnoses) => {
  const normalized = normalizeAnswer(studentAnswer);
  const accepted = acceptedDiagnoses.some(answer => normalizeAnswer(answer) === normalized);
  return {
    score: accepted ? 100 : 0,
    correct: accepted,
    feedback: accepted
      ? 'Your final diagnosis matches the doctor-verified diagnosis.'
      : 'The final diagnosis does not match the expected diagnosis. Review the teaching points and key findings.'
  };
};

const evaluateDifferential = (studentDifferentials, expectedDifferentials) => {
  const normalizedExpected = expectedDifferentials.map(normalizeAnswer);
  const normalizedStudent = studentDifferentials
    .map(item => normalizeAnswer(typeof item === 'string' ? item : item?.value || ''))
    .filter(Boolean);

  const matched = normalizedStudent.filter(item => normalizedExpected.includes(item));
  const missed = normalizedExpected.filter(item => !normalizedStudent.includes(item));

  const score = Math.min(100, Math.round((matched.length / Math.max(normalizedExpected.length, 1)) * 100));

  return {
    score,
    matched,
    missed,
    feedback: `You included ${matched.length} of ${normalizedExpected.length} important differential diagnoses.`
  };
};

const evaluateInterpretation = (studentInterpretation, interpretationPoints = []) => {
  const points = Array.isArray(interpretationPoints) ? interpretationPoints : [];
  const normalized = normalizeAnswer(studentInterpretation || '');
  const matched = points.filter(point => {
    const value = typeof point === 'string' ? point : point?.keyword || point?.explanation || '';
    return value && normalized.includes(normalizeAnswer(value));
  });
  const score = points.length
    ? Math.round((matched.length / points.length) * 100)
    : normalized.length >= 20 ? 100 : normalized.length ? 50 : 0;
  return {
    score: Math.min(100, score),
    matched,
    missed: points.filter(point => !matched.includes(point)),
    feedback: normalized
      ? 'Your interpretation was assessed against the approved investigation findings.'
      : 'No investigation interpretation was provided.'
  };
};

const evaluateInitialDiagnosis = (studentAnswer, acceptedDiagnoses) =>
  evaluateDiagnosis(studentAnswer, acceptedDiagnoses);

const evaluateInvestigations = (selectedInvestigations, caseEvaluation) => {
  const selected = selectedInvestigations.map(normalizeAnswer);
  const expected = caseEvaluation.expectedInvestigations.map(normalizeAnswer);
  const helpful = caseEvaluation.helpfulInvestigations.map(normalizeAnswer);
  const unnecessary = caseEvaluation.unnecessaryInvestigations.map(normalizeAnswer);

  const appropriate = selected.filter(item => expected.includes(item) || helpful.includes(item));
  const missing = expected.filter(item => !selected.includes(item));
  const extra = selected.filter(item => unnecessary.includes(item));

  const score = Math.max(
    0,
    Math.round(
      ((appropriate.length - extra.length * 0.5) / Math.max(expected.length, 1)) * 100
    )
  );

  return {
    score: Math.min(100, score),
    appropriate: Array.from(new Set(appropriate)),
    missing,
    unnecessary: Array.from(new Set(extra)),
    feedback: `You selected ${appropriate.length} appropriate investigations.`
  };
};

const evaluateReasoning = (studentReasoning, reasoningPoints) => {
  const points = Array.isArray(reasoningPoints)
    ? reasoningPoints
    : reasoningPoints?.reasoningPoints || [];
  const normalized = normalizeAnswer(studentReasoning);
  const identified = points.filter(point => normalized.includes(normalizeAnswer(point.keyword)));
  const missed = points.filter(point => !normalized.includes(normalizeAnswer(point.keyword)));
  const score = Math.min(100, Math.round((identified.length / Math.max(points.length, 1)) * 100));

  return {
    score,
    identified,
    missed,
    feedback: `You addressed ${identified.length} of ${points.length} key reasoning points.`
  };
};

const evaluateHistory = (historySectionsViewed, caseEvaluation) => {
  const expected = caseEvaluation.importantHistorySections.map(normalizeAnswer);
  const viewed = historySectionsViewed.map(normalizeAnswer);
  const covered = expected.filter(section => viewed.includes(section));
  const score = Math.min(100, Math.round((covered.length / Math.max(expected.length, 1)) * 100));

  return {
    score,
    covered,
    missed: expected.filter(section => !viewed.includes(section)),
    feedback: `You reviewed ${covered.length} of ${expected.length} important history sections.`
  };
};

const evaluateExamination = (examinationsRequested, caseEvaluation) => {
  const expected = caseEvaluation.importantExaminations.map(normalizeAnswer);
  const selected = examinationsRequested.map(normalizeAnswer);
  const covered = expected.filter(item => selected.includes(item));
  const missed = expected.filter(item => !selected.includes(item));
  const score = Math.min(100, Math.round((covered.length / Math.max(expected.length, 1)) * 100));

  return {
    score,
    covered,
    missed,
    feedback: `You requested ${covered.length} of ${expected.length} important examination areas.`
  };
};

const calculateOverallScore = scores => {
  const weights = {
    history: 0.1,
    examination: 0.1,
    initialDiagnosis: 0.05,
    differential: 0.15,
    investigations: 0.15,
    interpretation: 0.1,
    diagnosis: 0.15,
    reasoning: 0.2
  };
  const numericScore = value => {
    const score = typeof value === 'number' ? value : value?.score;
    return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
  };
  return Math.round(Object.entries(weights).reduce(
    (total, [category, weight]) => total + numericScore(scores[category]) * weight,
    0
  ));
};

const generateFeedback = evaluation => {
  const items = [];
  if (evaluation.diagnosis && !evaluation.diagnosis.correct) {
    items.push('Review the final diagnosis and compare it to the key clinical findings.');
  }
  if (evaluation.differential && evaluation.differential.missed.length > 0) {
    items.push('Consider additional alternative diagnoses that were not listed.');
  }
  if (evaluation.investigations && evaluation.investigations.missing.length > 0) {
    items.push('Add missing investigations that help confirm or exclude the most likely diagnosis.');
  }
  if (evaluation.reasoning && evaluation.reasoning.missed.length > 0) {
    items.push('Strengthen your reasoning by including more key clinical findings.');
  }
  return items.length ? items : ['Good clinical reasoning overall; continue practicing the structured approach.'];
};

export {
  normalizeAnswer,
  evaluateDiagnosis,
  evaluateInitialDiagnosis,
  evaluateDifferential,
  evaluateInvestigations,
  evaluateReasoning,
  evaluateHistory,
  evaluateExamination,
  evaluateInterpretation,
  calculateOverallScore,
  generateFeedback
};
