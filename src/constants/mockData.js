export const scenarios = [
  {
    id: 'sim-01',
    title: 'Adult with acute abdominal pain',
    specialty: 'Emergency Medicine',
    difficulty: 'Intermediate',
    estimatedTime: '20 min',
    learningObjectives: [
      'Perform a focused clinical assessment of the patient',
      'Gather relevant information from the history',
      'Perform appropriate physical examinations',
      'Develop and prioritize differential diagnoses',
      'Select appropriate investigations based on clinical findings',
      'Interpret clinical and investigation findings',
      'Formulate and justify a final diagnosis'
    ],
    caseStages: [
      { id: 'presentation', title: 'Presentation', description: 'Review presenting symptoms and vital signs.' },
      { id: 'history', title: 'History', description: 'Gather information from the patient using focused questions.' },
      { id: 'examination', title: 'Examination', description: 'Request and review physical examination findings you choose.' },
      { id: 'diagnosis', title: 'Initial Impression', description: 'Capture your initial clinical impression.' },
      { id: 'differential', title: 'Differential', description: 'Build and prioritize differential diagnoses based on findings.' },
      { id: 'investigation', title: 'Investigations', description: 'Select investigations based on clinical assessment.' },
      { id: 'results', title: 'Results', description: 'Review investigation results and interpret them.' },
      { id: 'final', title: 'Final Diagnosis', description: 'Formulate and justify a final diagnosis.' },
      { id: 'feedback', title: 'Feedback', description: 'Review performance and targeted teaching points.' }
    ],
    patient: {
      name: 'John Mwinyi',
      age: 34,
      sex: 'Male'
    },
    presentation: {
      chiefComplaint: 'Severe abdominal pain',
      duration: '12 hours',
      vitalSigns: {
        temperature: '38.6°C',
        heartRate: 104,
        bloodPressure: '128/84 mmHg',
        respiratoryRate: 20
      }
    },
    history: {
      presentingIllness: 'The pain began around the umbilicus and shifted to the right lower quadrant over the past 12 hours.',
      onset: 'Sudden onset 12 hours ago.',
      location: 'Periumbilical, now right lower quadrant.',
      character: 'Cramping that became sharp and constant.',
      radiation: 'No radiation.',
      severity: 'Severe, rated 8/10.',
      timing: 'Persistent and worsening.',
      aggravatingFactors: 'Movement and coughing worsen the pain.',
      relievingFactors: 'Bending forward gives slight relief.',
      associatedSymptoms: 'Nausea, one episode of vomiting, anorexia, and low-grade fever.',
      pastMedicalHistory: 'No prior surgeries or chronic illnesses.',
      medicationHistory: 'No regular medications.',
      allergies: 'No known drug allergies.',
      familyHistory: 'No family history of gastrointestinal surgery.',
      socialHistory: 'Non-smoker, occasional alcohol, works as an accountant.'
    },
    examination: [
      {
        id: 'general',
        name: 'General Appearance',
        findings: 'Patient appears uncomfortable and mildly diaphoretic.',
        clinicalImportance: 'Suggests an acute intra-abdominal process with systemic response.'
      },
      {
        id: 'cardiovascular',
        name: 'Cardiovascular Examination',
        findings: 'Heart sounds normal, no murmurs.',
        clinicalImportance: 'Helps exclude primary cardiac causes of chest or abdominal discomfort.'
      },
      {
        id: 'respiratory',
        name: 'Respiratory Examination',
        findings: 'Breath sounds clear bilaterally.',
        clinicalImportance: 'Supports a non-pulmonary cause of abdominal pain.'
      },
      {
        id: 'abdominal',
        name: 'Abdominal Examination',
        findings: 'Localized right lower quadrant tenderness with guarding and rebound.',
        clinicalImportance: 'Classic for localized appendiceal inflammation.'
      },
      {
        id: 'neurological',
        name: 'Neurological Examination',
        findings: 'Alert and oriented, no focal deficits.',
        clinicalImportance: 'Rules out central causes of pain and altered mental status.'
      }
    ],
    investigations: [
      {
        id: 'cbc',
        name: 'Complete Blood Count',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Assess for inflammation and infection.',
        results: {
          WBC: '14.8 × 10⁹/L',
          neutrophils: '82%',
          hemoglobin: '13.5 g/dL'
        },
        interpretation: 'Neutrophilic leukocytosis is present.',
        relevance: 'Supports an acute inflammatory or infectious process.'
      },
      {
        id: 'crp',
        name: 'C-Reactive Protein',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Measure systemic inflammation.',
        results: { value: '68 mg/L' },
        interpretation: 'Elevated CRP supports active inflammation.',
        relevance: 'Supports acute appendicitis when combined with clinical findings.'
      },
      {
        id: 'urinalysis',
        name: 'Urinalysis',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Exclude urinary tract and renal causes of abdominal pain.',
        results: { result: 'Trace leukocytes, no nitrites, no blood' },
        interpretation: 'Urinalysis is not suggestive of a urinary tract infection.',
        relevance: 'Helps rule out ureteric colic and urinary infection.'
      },
      {
        id: 'abdominal_ultrasound',
        name: 'Abdominal Ultrasound',
        category: 'Imaging',
        costLevel: 'Medium',
        urgency: 'Urgent',
        brief: 'Image relevant structures to clarify the cause of symptoms.',
        results: { finding: 'Thickened appendix with periappendiceal fluid.' },
        interpretation: 'Findings are consistent with acute appendicitis.',
        relevance: 'Provides confirmatory imaging for appendicitis.'
      }
    ],
    clinicalReasoning: {
      keyClinicalFindings: [
        'Migratory abdominal pain',
        'Right lower quadrant tenderness',
        'Guarding and rebound',
        'Fever',
        'Neutrophilic leukocytosis'
      ],
      reasoningPoints: [
        {
          keyword: 'migratory abdominal pain',
          explanation: 'Supports an appendiceal process rather than diffuse gastroenteritis.'
        },
        {
          keyword: 'right lower quadrant tenderness',
          explanation: 'Indicates localization of inflammation to the appendix.'
        },
        {
          keyword: 'guarding',
          explanation: 'Suggests peritoneal irritation from appendiceal inflammation.'
        },
        {
          keyword: 'fever',
          explanation: 'Suggests an infectious or inflammatory process.'
        }
      ]
    },
    evaluation: {
      expectedInvestigations: ['cbc', 'crp', 'urinalysis', 'abdominal_ultrasound'],
      helpfulInvestigations: ['urinalysis'],
      unnecessaryInvestigations: ['chest_xray'],
      expectedDifferentials: ['acute appendicitis', 'acute gastroenteritis', 'acute cholecystitis', 'ovarian torsion'],
      importantHistorySections: ['presentingIllness', 'associatedSymptoms', 'pastMedicalHistory', 'medicationHistory', 'allergies'],
      importantExaminations: ['general', 'abdominal']
    },
    acceptedDiagnoses: ['acute appendicitis', 'appendicitis'],
    doctorVerifiedDiagnosis: 'Acute appendicitis',
    teachingPoints: [
      'Appendicitis often begins with periumbilical pain that migrates to the right lower quadrant.',
      'Guarding and rebound tenderness are key clinical findings for appendiceal inflammation.',
      'Imaging is useful to confirm the diagnosis and exclude alternative causes.'
    ],
    feedback: {
      good: [
        'Recognized the pain migration pattern.',
        'Selected appropriate laboratory and imaging tests.',
        'Noted the importance of right lower quadrant tenderness.'
      ],
      improvement: [
        'Explain why a urinary cause is less likely.',
        'Mention the role of CRP in supporting inflammation.',
        'Consider the full differential before finalizing diagnosis.'
      ]
    }
  },
  {
    id: 'sim-02',
    title: 'Older adult with productive cough and fever',
    specialty: 'Internal Medicine',
    difficulty: 'Intermediate',
    estimatedTime: '22 min',
    learningObjectives: [
      'Perform a focused clinical assessment of the patient',
      'Gather relevant information from the history',
      'Perform appropriate physical examinations',
      'Develop and prioritize differential diagnoses',
      'Select appropriate investigations based on clinical findings',
      'Interpret clinical and investigation findings',
      'Formulate and justify a final diagnosis'
    ],
    caseStages: [
      { id: 'presentation', title: 'Presentation', description: 'Review symptoms and vital signs.' },
      { id: 'history', title: 'History', description: 'Gather information from the patient using focused questions.' },
      { id: 'examination', title: 'Examination', description: 'Request and review physical examination findings you choose.' },
      { id: 'diagnosis', title: 'Initial Impression', description: 'Capture your initial clinical impression.' },
      { id: 'differential', title: 'Differential', description: 'Build and prioritize differential diagnoses based on findings.' },
      { id: 'investigation', title: 'Investigations', description: 'Select investigations based on clinical assessment.' },
      { id: 'results', title: 'Results', description: 'Review investigation findings and interpret them.' },
      { id: 'final', title: 'Final Diagnosis', description: 'Formulate and justify a final diagnosis.' },
      { id: 'feedback', title: 'Feedback', description: 'Review your performance and learning points.' }
    ],
    patient: {
      name: 'Asha Kamau',
      age: 64,
      sex: 'Female'
    },
    presentation: {
      chiefComplaint: 'Productive cough and shortness of breath',
      duration: '3 days',
      vitalSigns: {
        temperature: '38.9°C',
        heartRate: 108,
        bloodPressure: '132/86 mmHg',
        respiratoryRate: 24
      }
    },
    history: {
      presentingIllness: 'Cough with yellow sputum and progressive shortness of breath.',
      onset: 'Started three days ago.',
      location: 'Chest discomfort with deep breaths.',
      character: 'Productive cough and pleuritic chest discomfort.',
      radiation: 'No radiation.',
      severity: 'Moderate, worsens with deep breathing.',
      timing: 'Continuous with cough peaks.',
      aggravatingFactors: 'Coughing and deep inspiration worsen symptoms.',
      relievingFactors: 'Rest and acetaminophen provide slight relief.',
      associatedSymptoms: 'Fever, chills, and fatigue.',
      pastMedicalHistory: 'Type 2 diabetes and hypertension.',
      medicationHistory: 'Metformin and lisinopril.',
      allergies: 'No known drug allergies.',
      familyHistory: 'Mother had chronic hypertension.',
      socialHistory: 'Former smoker, quit 10 years ago.'
    },
    examination: [
      {
        id: 'general',
        name: 'General Appearance',
        findings: 'Patient appears unwell and febrile.',
        clinicalImportance: 'Suggests systemic infection.'
      },
      {
        id: 'cardiovascular',
        name: 'Cardiovascular Examination',
        findings: 'Regular rhythm, no murmurs.',
        clinicalImportance: 'Helps exclude primary cardiac causes of dyspnea.'
      },
      {
        id: 'respiratory',
        name: 'Respiratory Examination',
        findings: 'Crackles and bronchial breath sounds in the right lower lung field.',
        clinicalImportance: 'Classic signs of consolidation consistent with pneumonia.'
      },
      {
        id: 'abdominal',
        name: 'Abdominal Examination',
        findings: 'Soft abdomen, no tenderness.',
        clinicalImportance: 'Helps exclude abdominal causes of referred chest pain.'
      },
      {
        id: 'neurological',
        name: 'Neurological Examination',
        findings: 'Alert and oriented.',
        clinicalImportance: 'Rules out altered mental status from severe infection.'
      }
    ],
    investigations: [
      {
        id: 'cbc',
        name: 'Complete Blood Count',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Assess for infection and inflammation.',
        results: {
          WBC: '15.4 × 10⁹/L',
          neutrophils: '85%',
          hemoglobin: '12.8 g/dL'
        },
        interpretation: 'Neutrophilic leukocytosis suggests bacterial infection.',
        relevance: 'Supports pneumonia as the cause of symptoms.'
      },
      {
        id: 'crp',
        name: 'C-Reactive Protein',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Measure systemic inflammation.',
        results: { value: '82 mg/L' },
        interpretation: 'Elevated CRP supports active bacterial infection.',
        relevance: 'Helps confirm an inflammatory pneumonia process.'
      },
      {
        id: 'chest_xray',
        name: 'Chest X-ray',
        category: 'Imaging',
        costLevel: 'Medium',
        urgency: 'Urgent',
        brief: 'Image relevant areas to clarify the cause of symptoms.',
        results: { finding: 'Right lower lobe consolidation.' },
        interpretation: 'Findings are consistent with community-acquired pneumonia.',
        relevance: 'Key imaging evidence for pneumonia diagnosis.'
      }
    ],
    clinicalReasoning: {
      keyClinicalFindings: [
        'Productive cough',
        'Fever',
        'Crackles on lung exam',
        'Elevated WBC',
        'Right lower lobe consolidation'
      ],
      reasoningPoints: [
        {
          keyword: 'productive cough',
          explanation: 'Suggests a lower respiratory infection rather than a viral upper airway illness.'
        },
        {
          keyword: 'crackles',
          explanation: 'Supports lung consolidation seen in pneumonia.'
        },
        {
          keyword: 'consolidation',
          explanation: 'A classic radiographic finding for bacterial pneumonia.'
        },
        {
          keyword: 'fever',
          explanation: 'Indicates active infection.'
        }
      ]
    },
    evaluation: {
      expectedInvestigations: ['cbc', 'crp', 'chest_xray'],
      helpfulInvestigations: ['pulse_oximetry'],
      unnecessaryInvestigations: ['abdominal_ultrasound'],
      expectedDifferentials: ['community-acquired pneumonia', 'acute bronchitis', 'pulmonary embolism', 'exacerbation of chronic obstructive pulmonary disease'],
      importantHistorySections: ['presentingIllness', 'associatedSymptoms', 'pastMedicalHistory', 'medicationHistory', 'socialHistory'],
      importantExaminations: ['general', 'respiratory']
    },
    acceptedDiagnoses: ['community-acquired pneumonia', 'pneumonia'],
    doctorVerifiedDiagnosis: 'Community-acquired pneumonia',
    teachingPoints: [
      'Pneumonia often presents with fever, productive cough, and focal lung findings.',
      'A chest X-ray is important to confirm consolidation.',
      'Elevated inflammatory markers support a bacterial respiratory infection.'
    ],
    feedback: {
      good: [
        'Correctly identified the respiratory infection presentation.',
        'Selected chest imaging to confirm pneumonia.',
        'Recognized the importance of crackles and consolidation.'
      ],
      improvement: [
        'Differentiate pneumonia from pulmonary embolism and bronchitis.',
        'Comment on the role of oxygen saturation in pneumonia assessment.',
        'Include a broader view of social and smoking history.'
      ]
    }
  },
  {
    id: 'sim-03',
    title: 'Child with acute wheeze and breathlessness',
    specialty: 'Pediatrics',
    difficulty: 'Beginner',
    estimatedTime: '20 min',
    learningObjectives: [
      'Perform a focused clinical assessment of the patient',
      'Gather relevant information from the history',
      'Perform appropriate physical examinations',
      'Develop and prioritize differential diagnoses',
      'Select appropriate investigations based on clinical findings',
      'Interpret clinical and investigation findings',
      'Formulate and justify a final diagnosis'
    ],
    caseStages: [
      { id: 'presentation', title: 'Presentation', description: 'Assess the presenting symptoms and vital signs.' },
      { id: 'history', title: 'History', description: 'Collect focused pediatric respiratory history.' },
      { id: 'examination', title: 'Examination', description: 'Request exam findings relevant to asthma.' },
      { id: 'diagnosis', title: 'Initial Impression', description: 'Record your first clinical impression.' },
      { id: 'differential', title: 'Differential', description: 'Consider asthma and alternative causes.' },
      { id: 'investigation', title: 'Investigations', description: 'Select investigations based on clinical assessment.' },
      { id: 'results', title: 'Results', description: 'Review selected investigation results.' },
      { id: 'final', title: 'Final Diagnosis', description: 'Confirm the most likely diagnosis and reasoning.' },
      { id: 'feedback', title: 'Feedback', description: 'Review your reasoning and performance.' }
    ],
    patient: {
      name: 'Amina Hassan',
      age: 9,
      sex: 'Female'
    },
    presentation: {
      chiefComplaint: 'Shortness of breath and wheezing',
      duration: '6 hours',
      vitalSigns: {
        temperature: '37.8°C',
        heartRate: 118,
        bloodPressure: '110/72 mmHg',
        respiratoryRate: 30
      }
    },
    history: {
      presentingIllness: 'Breathing worsened after playing outside with cough and audible wheezing.',
      onset: 'Started this morning.',
      location: 'Diffuse chest tightness.',
      character: 'Whistling airway noise and breathlessness.',
      radiation: 'No radiation.',
      severity: 'Moderate to severe.',
      timing: 'Continuous with episodes of worsening.',
      aggravatingFactors: 'Exercise and cold air make symptoms worse.',
      relievingFactors: 'Using her inhaler gives partial relief.',
      associatedSymptoms: 'No fever, mild cough, difficulty speaking full sentences.',
      pastMedicalHistory: 'Asthma diagnosed at age 5.',
      medicationHistory: 'Uses salbutamol inhaler as needed.',
      allergies: 'Allergic to dust and pollen.',
      familyHistory: 'Mother has asthma.',
      socialHistory: 'Attends school and is exposed to pets at home.'
    },
    examination: [
      {
        id: 'general',
        name: 'General Appearance',
        findings: 'Alert but using accessory muscles to breathe.',
        clinicalImportance: 'Indicates respiratory distress and increased work of breathing.'
      },
      {
        id: 'cardiovascular',
        name: 'Cardiovascular Examination',
        findings: 'Tachycardic but regular rhythm.',
        clinicalImportance: 'Evaluates for cardiorespiratory causes of distress.'
      },
      {
        id: 'respiratory',
        name: 'Respiratory Examination',
        findings: 'Diffuse wheezing and prolonged expiration.',
        clinicalImportance: 'Characteristic of bronchospasm in asthma.'
      },
      {
        id: 'abdominal',
        name: 'Abdominal Examination',
        findings: 'Soft, non-tender abdomen.',
        clinicalImportance: 'Helps rule out abdominal causes of respiratory distress.'
      },
      {
        id: 'neurological',
        name: 'Neurological Examination',
        findings: 'Normal mental status.',
        clinicalImportance: 'Confirms adequate cerebral perfusion despite distress.'
      }
    ],
    investigations: [
      {
        id: 'pulse_oximetry',
        name: 'Pulse Oximetry',
        category: 'Vital',
        costLevel: 'Low',
        urgency: 'Urgent',
        brief: 'Measure oxygen saturation to assess clinical status.',
        results: { saturation: '92%' },
        interpretation: 'Mild hypoxia is present.',
        relevance: 'Helps determine the need for supplemental oxygen therapy.'
      },
      {
        id: 'peak_flow',
        name: 'Peak Expiratory Flow',
        category: 'Physiology',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Assess airflow limitation.',
        results: { value: '70% of predicted' },
        interpretation: 'Airflow obstruction is present, consistent with asthma exacerbation.',
        relevance: 'Helps quantify the severity of bronchospasm.'
      },
      {
        id: 'chest_xray',
        name: 'Chest X-ray',
        category: 'Imaging',
        costLevel: 'Medium',
        urgency: 'Routine',
        brief: 'Exclude pneumonia or pneumothorax.',
        results: { finding: 'No consolidation or pneumothorax.' },
        interpretation: 'No acute lung pathology aside from asthma.',
        relevance: 'Rules out alternative causes of respiratory symptoms.'
      }
    ],
    clinicalReasoning: {
      keyClinicalFindings: [
        'Wheezing',
        'Accessory muscle use',
        'History of asthma',
        'Reduced peak flow',
        'Mild hypoxia'
      ],
      reasoningPoints: [
        {
          keyword: 'wheezing',
          explanation: 'Wheezing is a hallmark of bronchospasm.'
        },
        {
          keyword: 'accessory muscles',
          explanation: 'Indicates increased work of breathing.'
        },
        {
          keyword: 'history of asthma',
          explanation: 'A previous asthma diagnosis increases the likelihood of exacerbation.'
        },
        {
          keyword: 'peak flow',
          explanation: 'Peak flow helps quantify airway obstruction.'
        }
      ]
    },
    evaluation: {
      expectedInvestigations: ['pulse_oximetry', 'peak_flow', 'chest_xray'],
      helpfulInvestigations: ['peak_flow', 'pulse_oximetry'],
      unnecessaryInvestigations: ['abdominal_ultrasound'],
      expectedDifferentials: ['acute asthma exacerbation', 'bronchiolitis', 'pneumonia', 'foreign body aspiration'],
      importantHistorySections: ['presentingIllness', 'associatedSymptoms', 'pastMedicalHistory', 'medicationHistory', 'allergies'],
      importantExaminations: ['general', 'respiratory']
    },
    acceptedDiagnoses: ['acute asthma exacerbation', 'asthma exacerbation', 'asthma'],
    doctorVerifiedDiagnosis: 'Acute asthma exacerbation',
    teachingPoints: [
      'Acute asthma exacerbations often present with wheezing and increased work of breathing.',
      'Peak flow and pulse oximetry are useful to assess severity.',
      'Chest X-ray helps exclude pneumonia and pneumothorax.'
    ],
    feedback: {
      good: [
        'Recognized the asthma history and wheezing.',
        'Chose appropriate respiratory tests.',
        'Noted accessory muscle use as a sign of distress.'
      ],
      improvement: [
        'Explain why pneumonia was less likely.',
        'Mention the need to reassess after bronchodilator therapy.',
        'Describe the role of peak flow measurement.'
      ]
    }
  },
  {
    id: 'sim-04',
    title: 'Adult with fever after travel',
    specialty: 'Infectious Disease',
    difficulty: 'Intermediate',
    estimatedTime: '22 min',
    learningObjectives: [
      'Perform a focused clinical assessment of the patient',
      'Gather relevant information from the history',
      'Perform appropriate physical examinations',
      'Develop and prioritize differential diagnoses',
      'Select appropriate investigations based on clinical findings',
      'Interpret clinical and investigation findings',
      'Formulate and justify a final diagnosis'
    ],
    caseStages: [
      { id: 'presentation', title: 'Presentation', description: 'Review symptoms and vital signs.' },
      { id: 'history', title: 'History', description: 'Gather exposure and travel history.' },
      { id: 'examination', title: 'Examination', description: 'Review key examination findings.' },
      { id: 'diagnosis', title: 'Initial Impression', description: 'Capture your first diagnostic impression.' },
      { id: 'differential', title: 'Differential', description: 'Consider alternative febrile illnesses.' },
      { id: 'investigation', title: 'Investigations', description: 'Select investigations based on clinical assessment.' },
      { id: 'results', title: 'Results', description: 'Review investigation findings.' },
      { id: 'final', title: 'Final Diagnosis', description: 'Choose a final diagnosis and justify it.' },
      { id: 'feedback', title: 'Feedback', description: 'Review the case and teaching points.' }
    ],
    patient: {
      name: 'Samuel Ochieng',
      age: 28,
      sex: 'Male'
    },
    presentation: {
      chiefComplaint: 'Fever, headache, and chills',
      duration: '4 days',
      vitalSigns: {
        temperature: '39.1°C',
        heartRate: 108,
        bloodPressure: '118/76 mmHg',
        respiratoryRate: 20
      }
    },
    history: {
      presentingIllness: 'High fever with headaches and sweats after returning from a rural area.',
      onset: 'Started four days ago.',
      location: 'Generalized body pain.',
      character: 'Intermittent chills and fever spikes.',
      radiation: 'No radiation.',
      severity: 'Moderate to severe.',
      timing: 'Intermittent fevers every 24 hours.',
      aggravatingFactors: 'Physical activity worsens fatigue.',
      relievingFactors: 'Paracetamol temporarily reduces fever.',
      associatedSymptoms: 'Headache, nausea, and sweating.',
      pastMedicalHistory: 'No chronic illnesses.',
      medicationHistory: 'Occasional paracetamol.',
      allergies: 'No known drug allergies.',
      familyHistory: 'No significant family illnesses.',
      socialHistory: 'Lives in a malaria-endemic region and works outdoors.'
    },
    examination: [
      {
        id: 'general',
        name: 'General Appearance',
        findings: 'Ill-looking, febrile, and sweaty.',
        clinicalImportance: 'Consistent with acute systemic infection.'
      },
      {
        id: 'cardiovascular',
        name: 'Cardiovascular Examination',
        findings: 'Tachycardic with normal heart sounds.',
        clinicalImportance: 'Helps rule out primary cardiac causes.'
      },
      {
        id: 'respiratory',
        name: 'Respiratory Examination',
        findings: 'Clear lung fields.',
        clinicalImportance: 'Supports a non-respiratory cause of fever.'
      },
      {
        id: 'abdominal',
        name: 'Abdominal Examination',
        findings: 'Soft abdomen with mild hepatomegaly.',
        clinicalImportance: 'Hepatomegaly can be seen in malaria.'
      },
      {
        id: 'neurological',
        name: 'Neurological Examination',
        findings: 'Alert and oriented.',
        clinicalImportance: 'Rules out cerebral malaria in uncomplicated infection.'
      }
    ],
    investigations: [
      {
        id: 'cbc',
        name: 'Complete Blood Count',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Assess for anemia and infection.',
        results: { WBC: '4.2 × 10⁹/L', hemoglobin: '10.5 g/dL', platelets: '110 × 10⁹/L' },
        interpretation: 'Mild anemia and thrombocytopenia are present.',
        relevance: 'Common findings in malaria infection.'
      },
      {
        id: 'rapid_malaria_test',
        name: 'Rapid Malaria Test',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Urgent',
        brief: 'Detect relevant laboratory markers quickly.',
        results: { result: 'Positive for Plasmodium falciparum' },
        interpretation: 'A positive rapid test confirms malaria infection.',
        relevance: 'Confirms the diagnosis in the appropriate clinical context.'
      },
      {
        id: 'blood_film',
        name: 'Peripheral Blood Film',
        category: 'Laboratory',
        costLevel: 'Medium',
        urgency: 'Routine',
        brief: 'Visualize parasites on a blood smear.',
        results: { finding: 'Ring forms consistent with Plasmodium falciparum' },
        interpretation: 'Microscopy confirms malaria and identifies species.',
        relevance: 'Supports targeted malaria treatment.'
      }
    ],
    clinicalReasoning: {
      keyClinicalFindings: [
        'Fever and chills',
        'Travel/exposure history',
        'Headache',
        'Thrombocytopenia',
        'Positive malaria test'
      ],
      reasoningPoints: [
        {
          keyword: 'travel',
          explanation: 'Travel or exposure history is critical for malaria risk assessment.'
        },
        {
          keyword: 'fever spikes',
          explanation: 'Intermittent fever suggests a parasitic illness.'
        },
        {
          keyword: 'thrombocytopenia',
          explanation: 'Low platelets are commonly seen in malaria.'
        },
        {
          keyword: 'positive malaria',
          explanation: 'A positive malaria test confirms the diagnosis in a symptomatic patient.'
        }
      ]
    },
    history: {
      presentingIllness: 'High fever with headaches and sweats after returning from a rural area.',
      onset: 'Started four days ago.',
      location: 'Generalized body pain.',
      character: 'Intermittent chills and fever spikes.',
      radiation: 'No radiation.',
      severity: 'Moderate to severe.',
      timing: 'Intermittent fevers every 24 hours.',
      aggravatingFactors: 'Physical activity worsens fatigue.',
      relievingFactors: 'Paracetamol temporarily reduces fever.',
      associatedSymptoms: 'Headache, nausea, and sweating.',
      pastMedicalHistory: 'No chronic illnesses.',
      medicationHistory: 'Occasional paracetamol.',
      allergies: 'No known drug allergies.',
      familyHistory: 'No significant family illnesses.',
      socialHistory: 'Lives in a malaria-endemic region and works outdoors.',
      travelHistory: 'Recently returned from a rural district with known malaria transmission.'
    },
    evaluation: {
      expectedInvestigations: ['cbc', 'rapid_malaria_test', 'blood_film'],
      helpfulInvestigations: ['rapid_malaria_test', 'blood_film'],
      unnecessaryInvestigations: ['chest_xray'],
      expectedDifferentials: ['malaria', 'typhoid fever', 'dengue fever', 'urinary tract infection'],
      importantHistorySections: ['presentingIllness', 'associatedSymptoms', 'pastMedicalHistory', 'travelHistory', 'medicationHistory'],
      importantExaminations: ['general', 'abdominal']
    },
    acceptedDiagnoses: ['malaria', 'uncomplicated malaria', 'plasmodium falciparum malaria'],
    doctorVerifiedDiagnosis: 'Uncomplicated malaria',
    teachingPoints: [
      'Malaria should be suspected in patients with fever after exposure in endemic areas.',
      'Rapid malaria test and blood film confirm the diagnosis.',
      'Thrombocytopenia and anemia are common laboratory findings.'
    ],
    feedback: {
      good: [
        'Recognized the fever and exposure history.',
        'Selected malaria-specific investigations.',
        'Noted the importance of blood film confirmation.'
      ],
      improvement: [
        'Explain why a respiratory infection was less likely.',
        'Mention the significance of thrombocytopenia in malaria.',
        'Discuss the importance of species identification for treatment.'
      ]
    }
  },
  {
    id: 'sim-05',
    title: 'Adult with polyuria, polydipsia and vomiting',
    specialty: 'Endocrinology',
    difficulty: 'Advanced',
    estimatedTime: '24 min',
    learningObjectives: [
      'Perform a focused clinical assessment of the patient',
      'Gather relevant information from the history',
      'Perform appropriate physical examinations',
      'Develop and prioritize differential diagnoses',
      'Select appropriate investigations based on clinical findings',
      'Interpret clinical and investigation findings',
      'Formulate and justify a final diagnosis'
    ],
    caseStages: [
      { id: 'presentation', title: 'Presentation', description: 'Review symptoms and vital signs.' },
      { id: 'history', title: 'History', description: 'Collect focused diabetes history.' },
      { id: 'examination', title: 'Examination', description: 'Review key physical exam findings.' },
      { id: 'diagnosis', title: 'Initial Impression', description: 'Capture your initial diagnosis.' },
      { id: 'differential', title: 'Differential', description: 'Consider diabetic and non-diabetic causes.' },
      { id: 'investigation', title: 'Investigations', description: 'Select investigations based on clinical assessment.' },
      { id: 'results', title: 'Results', description: 'Review metabolic investigation findings.' },
      { id: 'final', title: 'Final Diagnosis', description: 'Confirm the diagnosis and reasoning.' },
      { id: 'feedback', title: 'Feedback', description: 'Review your reasoning and learning points.' }
    ],
    patient: {
      name: 'Esther Mwende',
      age: 42,
      sex: 'Female'
    },
    presentation: {
      chiefComplaint: 'Polyuria, polydipsia, and vomiting',
      duration: '2 days',
      vitalSigns: {
        temperature: '37.8°C',
        heartRate: 116,
        bloodPressure: '100/64 mmHg',
        respiratoryRate: 26
      }
    },
    history: {
      presentingIllness: 'Increased thirst and urination with abdominal pain and vomiting.',
      onset: 'Started two days ago.',
      location: 'Generalized abdominal discomfort.',
      character: 'Constant nausea and vomiting.',
      radiation: 'No radiation.',
      severity: 'Moderate to severe.',
      timing: 'Continuous symptoms with worsening dehydration.',
      aggravatingFactors: 'Oral intake worsens nausea.',
      relievingFactors: 'No sustained relief provided.',
      associatedSymptoms: 'Fatigue, blurred vision, and dry mouth.',
      pastMedicalHistory: 'Known type 1 diabetes diagnosed at age 14.',
      medicationHistory: 'Uses insulin glargine and regular insulin.',
      allergies: 'No known drug allergies.',
      familyHistory: 'Father has hypertension.',
      socialHistory: 'Lives with family, no tobacco or alcohol use.'
    },
    examination: [
      {
        id: 'general',
        name: 'General Appearance',
        findings: 'Dry mucous membranes and dry skin.',
        clinicalImportance: 'Indicates dehydration and metabolic disturbance.'
      },
      {
        id: 'cardiovascular',
        name: 'Cardiovascular Examination',
        findings: 'Tachycardic with weak pulses.',
        clinicalImportance: 'Supports volume depletion.'
      },
      {
        id: 'respiratory',
        name: 'Respiratory Examination',
        findings: 'Kussmaul breathing pattern.',
        clinicalImportance: 'Classic for metabolic acidosis in DKA.'
      },
      {
        id: 'abdominal',
        name: 'Abdominal Examination',
        findings: 'Soft abdomen with mild tenderness.',
        clinicalImportance: 'Helps exclude acute surgical abdomen.'
      },
      {
        id: 'neurological',
        name: 'Neurological Examination',
        findings: 'Alert but fatigued.',
        clinicalImportance: 'Evaluates for cerebral edema or altered mental status.'
      }
    ],
    investigations: [
      {
        id: 'cbc',
        name: 'Complete Blood Count',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Routine',
        brief: 'Assess for infection and anemia.',
        results: {
          WBC: '11.2 × 10⁹/L',
          hemoglobin: '13.0 g/dL',
          platelets: '220 × 10⁹/L'
        },
        interpretation: 'Mild leukocytosis may reflect dehydration or stress.',
        relevance: 'Helps assess for infection and overall clinical status.'
      },
      {
        id: 'blood_glucose',
        name: 'Blood Glucose',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Urgent',
        brief: 'Measure current blood sugar.',
        results: { value: '24.5 mmol/L' },
        interpretation: 'Severe hyperglycemia is present.',
        relevance: 'A core diagnostic criterion for DKA.'
      },
      {
        id: 'urine_ketones',
        name: 'Urine Ketones',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Urgent',
        brief: 'Detect ketones in urine.',
        results: { result: 'Large ketones present' },
        interpretation: 'Confirms ketone production consistent with DKA.',
        relevance: 'Supports the diagnosis of diabetic ketoacidosis.'
      },
      {
        id: 'serum_bicarb',
        name: 'Serum Bicarbonate',
        category: 'Laboratory',
        costLevel: 'Low',
        urgency: 'Urgent',
        brief: 'Assess metabolic acidosis.',
        results: { value: '14 mmol/L' },
        interpretation: 'Low bicarbonate confirms metabolic acidosis.',
        relevance: 'Helps confirm diabetic ketoacidosis.'
      }
    ],
    clinicalReasoning: {
      keyClinicalFindings: [
        'Polyuria and polydipsia',
        'Kussmaul breathing',
        'Hyperglycemia',
        'Large urine ketones',
        'Dehydration'
      ],
      reasoningPoints: [
        {
          keyword: 'kussmaul',
          explanation: 'Deep, rapid breathing indicates metabolic acidosis.'
        },
        {
          keyword: 'ketones',
          explanation: 'Urine ketones confirm fat metabolism due to insulin deficiency.'
        },
        {
          keyword: 'dehydration',
          explanation: 'Volume depletion is common in DKA and explains tachycardia.'
        },
        {
          keyword: 'hyperglycemia',
          explanation: 'Very high blood glucose is a hallmark of DKA.'
        }
      ]
    },
    evaluation: {
      expectedInvestigations: ['blood_glucose', 'urine_ketones', 'serum_bicarb', 'cbc'],
      helpfulInvestigations: ['blood_glucose', 'urine_ketones'],
      unnecessaryInvestigations: ['chest_xray'],
      expectedDifferentials: ['diabetic ketoacidosis', 'hyperosmolar hyperglycemic state', 'acute gastroenteritis', 'sepsis'],
      importantHistorySections: ['presentingIllness', 'associatedSymptoms', 'pastMedicalHistory', 'medicationHistory'],
      importantExaminations: ['general', 'respiratory']
    },
    acceptedDiagnoses: ['diabetic ketoacidosis', 'dka'],
    doctorVerifiedDiagnosis: 'Diabetic ketoacidosis',
    teachingPoints: [
      'DKA commonly presents with dehydration, hyperglycemia, and ketonuria.',
      'Kussmaul breathing is a sign of metabolic acidosis.',
      'Rapid metabolic testing confirms the diagnosis.'
    ],
    feedback: {
      good: [
        'Recognized the classic DKA symptom cluster.',
        'Selected urgent metabolic investigations.',
        'Noted the importance of Kussmaul breathing.'
      ],
      improvement: [
        'Explain why HHS was less likely in this patient.',
        'Describe the role of bicarbonate in confirming acidosis.',
        'Mention the need for fluid resuscitation in DKA.'
      ]
    }
  }
];
