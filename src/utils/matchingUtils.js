const normalizeText = txt =>
  txt
    .toString()
    .toLowerCase()
    .replace(/["'`.,;!?()\[\]{}:–—\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const containsPhrase = (text, phrase) => {
  const normalize = s => normalizeText(s).split(' ').filter(Boolean);
  const tTokens = normalize(text);
  const pTokens = normalize(phrase);
  if (pTokens.length === 0) return false;
  // check if pTokens appear in order within tTokens (allow gaps)
  let i = 0;
  for (let j = 0; j < tTokens.length && i < pTokens.length; j++) {
    if (tTokens[j] === pTokens[i]) i++;
  }
  return i === pTokens.length;
};

const scoreMatch = (text, item) => {
  // Exact accepted question match
  const normalized = normalizeText(text);
  if (item.acceptedQuestions) {
    for (const q of item.acceptedQuestions) {
      if (normalizeText(q) === normalized) return 100;
      if (containsPhrase(normalized, q)) return 90;
    }
  }

  // Phrase matches (longer phrases weighted higher)
  let phraseScore = 0;
  if (item.phrases) {
    for (const p of item.phrases) {
      if (containsPhrase(normalized, p)) phraseScore += Math.min(40, p.split(' ').length * 10);
    }
  }

  // Keyword matching
  let kwScore = 0;
  if (item.keywords) {
    for (const k of item.keywords) {
      if (containsPhrase(normalized, k)) kwScore += 10;
    }
  }
  // Token overlap scoring (robust to variations)
  const stopwords = new Set(['the', 'a', 'an', 'patient', 'problem', 'symptom', 'tell', 'more', 'please', 'i', 'you', 'is', 'are', 'do', 'does', 'did', 'about', 'of', 'and', 'or', 'to', 'in', 'on', 'has', 'have']);
  const tokenize = s => normalizeText(s).split(' ').filter(t => t && !stopwords.has(t));
  const qTokens = tokenize(normalized);
  let itemTokens = [];
  if (item.acceptedQuestions) itemTokens = itemTokens.concat(item.acceptedQuestions.join(' '));
  if (item.keywords) itemTokens = itemTokens.concat(item.keywords.join(' '));
  if (item.phrases) itemTokens = itemTokens.concat(item.phrases.join(' '));
  itemTokens = tokenize(itemTokens.join(' '));
  const intersect = qTokens.filter(t => itemTokens.includes(t));
  const tokenScore = itemTokens.length ? Math.round((intersect.length / itemTokens.length) * 50) : 0;

  const combined = Math.max(phraseScore, kwScore, tokenScore);
  return combined;
};

const pickBestMatch = (text, items) => {
  let best = null;
  let bestScore = 0;
  for (const item of items) {
    const s = scoreMatch(text, item);
    if (s > bestScore) {
      bestScore = s;
      best = item;
    }
  }
  // Confidence threshold: accept exact(>80) or phrase(>50) or multiple keyword matches (>20)
  if (bestScore >= 50) return { item: best, score: bestScore };
  if (bestScore >= 20 && bestScore < 50) return { item: best, score: bestScore };
  return { item: null, score: bestScore };
};

const buildHistoryItemsFromObject = historyObj => {
  const synonymMap = {
    onset: {
      acceptedQuestions: ['when did this start', 'when did the symptoms begin', 'how long have you had this', 'how long has this been happening', 'when did it start'],
      keywords: ['when', 'start', 'started', 'duration', 'days', 'hours', 'began', 'how long']
    },
    presentingIllness: {
      acceptedQuestions: ['what brings you in today', 'what is your main problem', 'tell me about the problem', 'what happened'],
      keywords: ['present', 'presenting', 'complaint', 'problem', 'symptom']
    },
    location: {
      acceptedQuestions: ['where is the pain', 'where do you feel it', 'where is the pain located'],
      keywords: ['where', 'location', 'site', 'area']
    },
    character: {
      acceptedQuestions: ['what does the pain feel like', 'describe the pain', 'what is the pain like'],
      keywords: ['character', 'feel', 'sharp', 'dull', 'cramping', 'burning', 'stabbing']
    },
    severity: {
      acceptedQuestions: ['how bad is the pain', 'rate the pain', 'severity on a scale'],
      keywords: ['severity', 'worse', 'scale', 'intensity', 'how bad']
    },
    timing: {
      acceptedQuestions: ['is it constant or does it come and go', 'timing', 'pattern of the symptoms'],
      keywords: ['timing', 'pattern', 'when', 'at night', 'worse with']
    },
    associatedSymptoms: {
      acceptedQuestions: ['do you have fever', 'any nausea or vomiting', 'any other symptoms', 'any cough or shortness of breath'],
      keywords: ['fever', 'nausea', 'vomiting', 'cough', 'sputum', 'dyspnea', 'shortness', 'breath']
    },
    pastMedicalHistory: {
      acceptedQuestions: ['do you have any chronic illnesses', 'any past medical history', 'any previous illnesses'],
      keywords: ['history', 'chronic', 'diabetes', 'hypertension', 'asthma']
    },
    medicationHistory: {
      acceptedQuestions: ['what medicines do you take', 'any regular medications', 'any inhalers or insulin'],
      keywords: ['medication', 'meds', 'drug', 'insulin', 'inhaler']
    },
    allergies: {
      acceptedQuestions: ['do you have any allergies', 'are you allergic to any medicines', 'any drug allergies'],
      keywords: ['allergy', 'allergies', 'rash', 'reaction']
    },
    travelHistory: {
      acceptedQuestions: ['have you traveled recently', 'any recent travel', 'where have you been recently'],
      keywords: ['travel', 'returned', 'traveled', 'exposure']
    },
    socialHistory: {
      acceptedQuestions: ['do you smoke', 'do you drink alcohol', 'any drug use', 'smoking history'],
      keywords: ['smoke', 'alcohol', 'drink', 'occupation']
    }
  };

  return Object.keys(historyObj).map(key => {
    const base = {
      id: key,
      category: 'History',
      doctorAnswer: historyObj[key],
      acceptedQuestions: [],
      keywords: [],
      phrases: []
    };
    const mapped = synonymMap[key];
    if (mapped) {
      base.acceptedQuestions = mapped.acceptedQuestions;
      base.keywords = mapped.keywords;
      base.phrases = mapped.acceptedQuestions.slice(0, 3);
    } else {
      base.acceptedQuestions = [key];
      base.keywords = [key];
    }
    return base;
  });
};

const matchHistoryQuestion = (studentQuestion, caseData) => {
  if (!studentQuestion || !studentQuestion.trim()) return null;
  const normalizedQ = normalizeText(studentQuestion);

  let items = caseData.historyQuestions;
  if (!items || !Array.isArray(items)) {
    // try to build from legacy history object
    if (caseData.history && typeof caseData.history === 'object') {
      items = buildHistoryItemsFromObject(caseData.history);
    } else items = [];
  }

  const { item, score } = pickBestMatch(normalizedQ, items);
  if (!item) return null;
  // avoid returning low-confidence matches
  if (score < 20) return null;
  return { id: item.id, answer: item.doctorAnswer, matchScore: score };
};

const matchExaminationRequest = (studentRequest, examinations) => {
  if (!studentRequest || !studentRequest.trim()) return null;
  const normalized = normalizeText(studentRequest);
  let items = examinations;
  if (!items || !Array.isArray(items)) return null;
  // first check acceptedRequests and phrases
  for (const ex of items) {
    if (ex.acceptedRequests) {
      for (const req of ex.acceptedRequests) {
        if (normalizeText(req) === normalized) return { id: ex.id, findings: ex.findings };
      }
    }
  }
  // build enriched items with fallback synonyms when not provided
  const enrichExam = ex => {
    const name = ex.name || '';
    const lname = name.toLowerCase();
    const gen = { acceptedQuestions: [], phrases: [], keywords: [] };
    if (lname.includes('respir') || lname.includes('lung') || lname.includes('chest')) {
      gen.acceptedQuestions = ['examine the chest', 'examine the lungs', 'auscultate the lungs', 'listen to the chest', 'check breath sounds', 'perform respiratory examination'];
      gen.phrases = ['examine the lungs', 'listen to the lungs', 'perform respiratory examination'];
      gen.keywords = ['respiratory', 'lung', 'lungs', 'chest', 'auscultate', 'breath sounds'];
    } else if (lname.includes('cardio') || lname.includes('heart')) {
      gen.acceptedQuestions = ['examine the cardiovascular system', 'listen to the heart', 'check heart sounds', 'cardiac examination'];
      gen.phrases = ['listen to the heart', 'cardiac examination'];
      gen.keywords = ['cardiovascular', 'heart', 'murmur', 'pulse'];
    } else if (lname.includes('abdom') || lname.includes('abdomen')) {
      gen.acceptedQuestions = ['examine the abdomen', 'palpate the abdomen', 'perform abdominal examination'];
      gen.phrases = ['examine the abdomen', 'abdominal examination'];
      gen.keywords = ['abdominal', 'abdomen', 'tenderness', 'guarding', 'rebound'];
    } else if (lname.includes('neuro') || lname.includes('neurological')) {
      gen.acceptedQuestions = ['perform a neurological examination', 'check neurological status', 'examine the nervous system'];
      gen.phrases = ['neurological examination', 'check neurological status'];
      gen.keywords = ['neurological', 'neuro', 'reflex', 'strength', 'sensation'];
    } else if (lname.includes('general')) {
      gen.acceptedQuestions = ['general examination', 'observe general appearance', 'assess general appearance'];
      gen.phrases = ['general examination'];
      gen.keywords = ['general', 'appearance', 'diaphoretic', 'distressed'];
    } else {
      // fallback: use words from the name
      const tokens = lname.split(/\s+/).filter(Boolean);
      gen.keywords = tokens.slice(0, 4);
      gen.acceptedQuestions = [`examine the ${tokens.join(' ')}`];
      gen.phrases = [tokens.join(' ')];
    }
    return {
      ...ex,
      acceptedQuestions: ex.acceptedRequests || gen.acceptedQuestions,
      phrases: ex.phrases || gen.phrases,
      keywords: ex.keywords || gen.keywords
    };
  };

  const enriched = items.map(enrichExam);
  // then pick best by keywords/phrases
  const { item, score } = pickBestMatch(normalized, enriched.map(i => ({ ...i, acceptedQuestions: i.acceptedQuestions || [], phrases: i.phrases || [], keywords: i.keywords || [] })));
  if (item && score >= 30) return { id: item.id, findings: item.findings, score };
  return null;
};

const matchInvestigationRequest = (studentRequest, investigations) => {
  if (!studentRequest || !studentRequest.trim()) return null;
  const normalized = normalizeText(studentRequest);
  let items = investigations;
  if (!items || !Array.isArray(items)) return null;
  // exact name match
  for (const inv of items) {
    if (normalizeText(inv.name) === normalized) return { id: inv.id };
    if (inv.acceptedRequests) {
      for (const req of inv.acceptedRequests) {
        if (normalizeText(req) === normalized) return { id: inv.id };
      }
    }
  }
  // keyword match
  const { item, score } = pickBestMatch(normalized, items.map(i => ({ ...i, acceptedQuestions: i.acceptedRequests || [], phrases: i.phrases || [], keywords: i.keywords || [] })));
  if (item && score >= 30) return { id: item.id, score };
  return null;
};

export { normalizeText, matchHistoryQuestion, matchExaminationRequest, matchInvestigationRequest };
