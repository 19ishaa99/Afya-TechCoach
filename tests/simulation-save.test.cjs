const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');

async function setup() {
  const slots = [];
  let cursor = 0;
  let effects = [];
  let saves = 0;
  let submissions = 0;
  let failSave = false;
  const react = {
    createContext: () => ({ Provider: 'Provider' }),
    createElement: (_, props) => props.value,
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useRef(initial) {
      const i = cursor++;
      return slots[i] ||= { current: initial };
    },
    useCallback: fn => fn,
    useMemo: fn => fn(),
    useEffect: fn => { effects.push(fn); },
  };
  const api = {
    start: async () => ({ id: 'attempt' }),
    save: async (_, payload) => {
      saves++;
      assert.deepEqual(Array.from(payload.differential_diagnoses), []);
      if (failSave) throw new Error('offline');
    },
    submit: async () => { submissions++; return { status: 'submitted' }; },
    get: async () => ({ case_id: 'case', status: 'completed' }),
  };
  const box = { exports: {} };
  const code = babel.transformSync(fs.readFileSync('src/context/SimulationContext.js', 'utf8'), {
    plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-transform-react-jsx'],
  }).code;
  vm.runInNewContext(code, {
    module: box, exports: box.exports, console,
    setTimeout: () => 1, clearTimeout: () => {},
    require: name => {
      if (name === 'react') return react;
      if (name === 'react-native') return { AppState: { addEventListener: () => ({ remove() {} }) } };
      if (name.includes('simulationApi')) return { simulationApi: api };
      if (name.includes('simulationStorage')) return { simulationStorage: { load: async () => null, save: async () => {}, clear: async () => {} } };
      if (name.includes('mockData')) return { scenarios: [{ id: 'case' }] };
      throw new Error(name);
    },
  });
  const render = () => {
    cursor = 0;
    effects = [];
    const value = box.exports.SimulationProvider({});
    // Sync draftRef, as React does after a render.
    effects[0]();
    return value;
  };
  return { render, counts: () => ({ saves, submissions }), fail: () => { failSave = true; } };
}

(async () => {
  const app = await setup();
  await app.render().startCase({ id: 'case' });
  await app.render().submitAttempt();
  let state = app.render();
  assert.equal(state.attemptStatus, 'submitted');
  state.setSimulationEndTime(Date.now());
  await app.render().saveDraft();
  assert.deepEqual(app.counts(), { saves: 1, submissions: 1 }, 'Feedback must not PATCH locked answers');
  await app.render().submitAttempt();
  assert.equal(app.counts().saves, 1, 'Evaluation retry must not PATCH submitted answers');
  await app.render().resumeAttempt('completed-attempt');
  await app.render().saveDraft();
  assert.equal(app.counts().saves, 1, 'Restored completed attempts must not PATCH');

  const failing = await setup();
  await failing.render().startCase({ id: 'case' });
  failing.fail();
  await assert.rejects(failing.render().submitAttempt(), /offline/);
  assert.equal(failing.counts().submissions, 0, 'Failed saves must block submission');
  assert.equal(failing.render().saveStatus, 'error');
  console.log('Simulation save regression tests passed.');
})();
