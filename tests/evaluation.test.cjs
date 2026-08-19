const fs = require('fs');
const vm = require('vm');
const babel = require('@babel/core');
const source = fs.readFileSync('src/utils/evaluationUtils.js', 'utf8');
const code = babel.transformSync(source, { plugins: ['@babel/plugin-transform-modules-commonjs'] }).code;
const moduleBox = { exports: {} };
vm.runInNewContext(code, { module: moduleBox, exports: moduleBox.exports, require, console });
const { calculateOverallScore, evaluateDifferential, evaluateReasoning } = moduleBox.exports;

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const differential = evaluateDifferential(['Pneumonia', { value: 'Pulmonary embolism' }], ['pneumonia', 'pulmonary embolism']);
assert(differential.score === 100, 'Differentials must support strings and objects');
const overall = calculateOverallScore({ history: { score: 80 }, examination: { score: 70 }, initialDiagnosis: { score: 100 }, differential: { score: 60 }, investigations: { score: 90 }, interpretation: { score: 50 }, diagnosis: { score: 100 }, reasoning: { score: 80 } });
assert(overall === 79, `Expected numeric weighted score 79, received ${overall}`);
const reasoning = evaluateReasoning('Fever and guarding support inflammation', { reasoningPoints: [{ keyword: 'fever' }, { keyword: 'guarding' }] });
assert(reasoning.score === 100, 'Reasoning must support the existing object structure');
console.log('Frontend evaluation tests passed (3 assertions).');
