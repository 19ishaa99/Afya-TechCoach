import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { simulationApi } from '../api/simulationApi';
import { simulationStorage } from '../storage/simulationStorage';
import { scenarios } from '../constants/mockData';

const SimulationContext = createContext(null);
const initialDifferential = () => [{ id: 1, value: '' }, { id: 2, value: '' }];

const emptyDraft = {
  attemptId: null, selectedCase: null, currentStep: 'ScenarioIntro', historySectionsViewed: [],
  examinationsRequested: [], conversation: [], initialDiagnosis: '', initialReasoning: '',
  differentialDiagnoses: initialDifferential(), mostLikelyDiagnosis: '', selectedInvestigations: [],
  investigationInterpretation: '', finalDiagnosis: '', finalReasoning: '', simulationStartTime: null,
  simulationEndTime: null, draftUpdatedAt: null
};

export const SimulationProvider = ({ children }) => {
  const [draft, setDraft] = useState(emptyDraft);
  const [isRestoringSimulation, setIsRestoringSimulation] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');
  const draftRef = useRef(draft);
  const saveTimer = useRef(null);
  useEffect(() => { draftRef.current = draft; }, [draft]);

  const backendPayload = useCallback(value => ({
    current_step: value.currentStep,
    history_questions: value.historySectionsViewed,
    examinations_requested: value.examinationsRequested,
    conversation: value.conversation,
    initial_diagnosis: value.initialDiagnosis,
    initial_reasoning: value.initialReasoning,
    differential_diagnoses: value.differentialDiagnoses.map(item => item.value || item).filter(Boolean),
    most_likely_diagnosis: value.mostLikelyDiagnosis,
    investigations_selected: value.selectedInvestigations,
    investigation_interpretation: value.investigationInterpretation,
    final_diagnosis: value.finalDiagnosis,
    final_reasoning: value.finalReasoning
  }), []);

  const persist = useCallback(async (value = draftRef.current, { remote = true } = {}) => {
    const stamped = { ...value, draftUpdatedAt: new Date().toISOString() };
    draftRef.current = stamped;
    await simulationStorage.save(stamped);
    if (remote && stamped.attemptId) await simulationApi.save(stamped.attemptId, backendPayload(stamped));
    return stamped;
  }, [backendPayload]);

  const saveDraft = useCallback(async options => {
    setSaveStatus('saving');
    try { await persist(draftRef.current, options); setSaveStatus('saved'); return true; }
    catch (_) { setSaveStatus('error'); return false; }
  }, [persist]);

  useEffect(() => {
    simulationStorage.load().then(saved => {
      if (saved?.selectedCase?.id) {
        const currentCase = scenarios.find(item => item.id === saved.selectedCase.id);
        if (currentCase) setDraft({ ...emptyDraft, ...saved, selectedCase: currentCase });
        else simulationStorage.clear();
      }
    }).finally(() => setIsRestoringSimulation(false));
  }, []);

  useEffect(() => {
    if (isRestoringSimulation || !draft.selectedCase) return undefined;
    setSaveStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(), 700);
    return () => clearTimeout(saveTimer.current);
  }, [draft, isRestoringSimulation, saveDraft]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active' && draftRef.current.selectedCase) saveDraft();
    });
    return () => subscription.remove();
  }, [saveDraft]);

  const patch = useCallback(changes => setDraft(current => ({ ...current, ...changes })), []);
  const setter = key => value => setDraft(current => ({ ...current, [key]: typeof value === 'function' ? value(current[key]) : value }));

  const startCase = useCallback(async clinicalCase => {
    const started = await simulationApi.start(clinicalCase.id);
    const next = { ...emptyDraft, selectedCase: clinicalCase, attemptId: started.id, simulationStartTime: Date.now() };
    setDraft(next); await persist(next, { remote: false }); return started;
  }, [persist]);

  const resumeAttempt = useCallback(async attemptId => {
    const state = await simulationApi.get(attemptId);
    const clinicalCase = scenarios.find(item => item.id === state.case_id);
    if (!clinicalCase) throw new Error('The saved clinical case is no longer available.');
    const response = state.response || {};
    const next = {
      ...emptyDraft, attemptId, selectedCase: clinicalCase, currentStep: state.current_step || 'PatientScenario',
      historySectionsViewed: response.history_questions || [], examinationsRequested: response.examinations_requested || [],
      conversation: response.conversation || [], initialDiagnosis: response.initial_diagnosis || '', initialReasoning: response.initial_reasoning || '',
      differentialDiagnoses: (response.differential_diagnoses || []).map((value, index) => ({ id: index + 1, value })),
      mostLikelyDiagnosis: response.most_likely_diagnosis || '', selectedInvestigations: response.investigations_selected || [],
      investigationInterpretation: response.investigation_interpretation || '', finalDiagnosis: response.final_diagnosis || '', finalReasoning: response.final_reasoning || '',
      simulationStartTime: state.started_at ? new Date(state.started_at).getTime() : Date.now()
    };
    setDraft(next); await persist(next, { remote: false }); return next;
  }, [persist]);

  const resetSimulation = useCallback(async () => { setDraft(emptyDraft); draftRef.current = emptyDraft; await simulationStorage.clear(); }, []);
  const addConversationEntry = useCallback(entry => setDraft(current => ({ ...current, conversation: [...current.conversation, { ...entry, time: Date.now() }] })), []);

  const value = useMemo(() => ({
    ...draft, isRestoringSimulation, saveStatus, saveDraft, startCase, resumeAttempt,
    resetSimulation, addConversationEntry, setCurrentStep: setter('currentStep'),
    setSelectedCase: setter('selectedCase'), setHistorySectionsViewed: setter('historySectionsViewed'),
    setExaminationsRequested: setter('examinationsRequested'), setInitialDiagnosis: setter('initialDiagnosis'),
    setInitialReasoning: setter('initialReasoning'), setDifferentialDiagnoses: setter('differentialDiagnoses'),
    setMostLikelyDiagnosis: setter('mostLikelyDiagnosis'), setSelectedInvestigations: setter('selectedInvestigations'),
    setInvestigationInterpretation: setter('investigationInterpretation'), setFinalDiagnosis: setter('finalDiagnosis'),
    setFinalReasoning: setter('finalReasoning'), setSimulationStartTime: setter('simulationStartTime'),
    setSimulationEndTime: setter('simulationEndTime'), patchDraft: patch
  }), [draft, isRestoringSimulation, saveStatus, saveDraft, startCase, resumeAttempt, resetSimulation, addConversationEntry, patch]);

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
