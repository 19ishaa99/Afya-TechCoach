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
    .map(item => normalizeAnswer(item.value))
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
  const normalized = normalizeAnswer(studentReasoning);
  const identified = reasoningPoints.filter(point => normalized.includes(normalizeAnswer(point.keyword)));
  const missed = reasoningPoints.filter(point => !normalized.includes(normalizeAnswer(point.keyword)));
  const score = Math.min(100, Math.round((identified.length / Math.max(reasoningPoints.length, 1)) * 100));

  return {
    score,
    identified,
    missed,
    feedback: `You addressed ${identified.length} of ${reasoningPoints.length} key reasoning points.`
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
    diagnosis: 0.25,
    reasoning: 0.2,
    investigations: 0.15,
    investigationInterpretation: 0.15,
    differential: 0.15,
    history: 0.05,
    examination: 0.05
  };

  const weightedScore =
    (scores.diagnosis * weights.diagnosis || 0) +
    (scores.reasoning * weights.reasoning || 0) +
    (scores.investigations * weights.investigations || 0) +
    (scores.interpretation * weights.investigationInterpretation || 0) +
    (scores.differential * weights.differential || 0) +
    (scores.history * weights.history || 0) +
    (scores.examination * weights.examination || 0);

  return Math.round(weightedScore);
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
  evaluateDifferential,
  evaluateInvestigations,
  evaluateReasoning,
  evaluateHistory,
  evaluateExamination,
  calculateOverallScore,
  generateFeedback
};
