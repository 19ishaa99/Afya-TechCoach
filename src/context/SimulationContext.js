import React, { createContext, useContext, useState } from 'react';

const SimulationContext = createContext(null);

const initialDifferential = [
  { id: 1, value: '' },
  { id: 2, value: '' }
];

export const SimulationProvider = ({ children }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [historySectionsViewed, setHistorySectionsViewed] = useState([]);
  const [examinationsRequested, setExaminationsRequested] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [initialDiagnosis, setInitialDiagnosis] = useState('');
  const [initialReasoning, setInitialReasoning] = useState('');
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState(initialDifferential);
  const [mostLikelyDiagnosis, setMostLikelyDiagnosis] = useState('');
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);
  const [investigationInterpretation, setInvestigationInterpretation] = useState('');
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [finalReasoning, setFinalReasoning] = useState('');
  const [simulationStartTime, setSimulationStartTime] = useState(null);
  const [simulationEndTime, setSimulationEndTime] = useState(null);
  const [completedSimulations, setCompletedSimulations] = useState([]);

  const startCase = clinicalCase => {
    setSelectedCase(clinicalCase);
    setHistorySectionsViewed([]);
    setExaminationsRequested([]);
    setConversation([]);
    setInitialDiagnosis('');
    setInitialReasoning('');
    setDifferentialDiagnoses(initialDifferential);
    setMostLikelyDiagnosis('');
    setSelectedInvestigations([]);
    setInvestigationInterpretation('');
    setFinalDiagnosis('');
    setFinalReasoning('');
    setSimulationStartTime(Date.now());
    setSimulationEndTime(null);
  };

  const resetSimulation = () => {
    setSelectedCase(null);
    setHistorySectionsViewed([]);
    setExaminationsRequested([]);
    setConversation([]);
    setInitialDiagnosis('');
    setInitialReasoning('');
    setDifferentialDiagnoses(initialDifferential);
    setMostLikelyDiagnosis('');
    setSelectedInvestigations([]);
    setInvestigationInterpretation('');
    setFinalDiagnosis('');
    setFinalReasoning('');
    setSimulationStartTime(null);
    setSimulationEndTime(null);
  };

  const addCompletedSimulation = completedSimulation => {
    setCompletedSimulations(prev => {
      const exists = prev.some(item => item.simulationId === completedSimulation.simulationId && item.completedAt === completedSimulation.completedAt);
      if (exists) return prev;
      return [completedSimulation, ...prev];
    });
  };

  const addConversationEntry = entry => {
    setConversation(prev => [...prev, { ...entry, time: Date.now() }]);
  };

  return (
    <SimulationContext.Provider
      value={{
        selectedCase,
        setSelectedCase,
        historySectionsViewed,
        setHistorySectionsViewed,
        examinationsRequested,
        setExaminationsRequested,
        conversation,
        addConversationEntry,
        initialDiagnosis,
        setInitialDiagnosis,
        initialReasoning,
        setInitialReasoning,
        differentialDiagnoses,
        setDifferentialDiagnoses,
        mostLikelyDiagnosis,
        setMostLikelyDiagnosis,
        selectedInvestigations,
        setSelectedInvestigations,
        investigationInterpretation,
        setInvestigationInterpretation,
        finalDiagnosis,
        setFinalDiagnosis,
        finalReasoning,
        setFinalReasoning,
        simulationStartTime,
        setSimulationStartTime,
        simulationEndTime,
        setSimulationEndTime,
        completedSimulations,
        addCompletedSimulation,
        startCase,
        resetSimulation
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
