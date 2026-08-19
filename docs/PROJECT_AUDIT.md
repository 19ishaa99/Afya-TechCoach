# Project audit

Audit date: 19 August 2026. Baseline commit: `3af24111` (`version updated`). A recoverable pre-change Git bundle was created as `afya-techcoach-pre-upgrade-20260819.bundle`; `.git` was read-only in this workspace. Existing tracked `node_modules` changes were left untouched.

## Existing architecture

- Expo SDK 50, React Native 0.73, React Navigation 6, React Context, JavaScript.
- Entry: `App.js`; root navigator: `AppNavigator`; auth stack and student stack/tab navigators.
- Auth screens: Splash, Welcome, Login, Register, Forgot Password.
- Student screens: Dashboard, Case List, Scenario Intro, Patient Information, History, Examination, Initial Diagnosis, Differential Diagnosis, Investigation Selection, Results, Final Diagnosis, Feedback, Progress, Case History, Profile. `QuestionScreen` and `SimulationResultScreen` are legacy quiz screens and remain preserved. `ScenarioIntroScreen.old.js` is an unused backup.
- Shared components: inputs/buttons, logo/header/divider/loading spinner, simulation progress, case/difficulty/patient/progress/question/score cards.
- State: `SimulationContext` holds the selected case, backend attempt ID, current step, collected answers, timer, conversation, and save state. AsyncStorage is a recovery cache; FastAPI is authoritative.
- Data: `src/constants/mockData.js` contains exactly five cases (`sim-01` through `sim-05`) with patient data, history, examinations, investigations, approved diagnoses, reasoning, feedback, and teaching points.
- Matching: deterministic normalization plus exact accepted-question, ordered phrase, keyword, and token-overlap scoring. Legacy history objects are enriched with common synonyms.
- Evaluation: exact normalized diagnosis matching; coverage scoring for history/examination/differentials; investigation rewards/penalties; reasoning keyword coverage; weighted overall score.

## Routes

Auth: `Splash`, `Welcome`, `Login`, `Register`, `ForgotPassword`.

Student root: `StudentTabs`, `ScenarioIntro`, `PatientScenario`, `HistoryStage`, `Examination`, `InitialDiagnosis`, `DifferentialDiagnosis`, `Investigation`, `InvestigationResults`, `FinalDiagnosis`, `ClinicalFeedback`.

Tabs: `StudentDashboard`, `SimulationList`, `Progress`, `History`, `Profile`.

## Findings and repairs

- Critical: differential strings were passed into object-only evaluation. The evaluator now accepts either representation.
- Critical: overall calculation multiplied score objects. It now extracts/clamps numeric `.score` values and includes all local categories.
- Critical: `clinicalReasoning` is an object containing `reasoningPoints`, not an array. Both shapes now work.
- Missing: initial-diagnosis and investigation-interpretation evaluation. Both are now present.
- Critical errors were silently swallowed. Submission now logs only case ID/error text, shows a safe message, preserves answers, and does not navigate on failure.
- Auth screens now use FastAPI JSON login/registration, access and refresh JWTs, authenticated `/me`, native SecureStore, browser storage, restoration, and root auth-state navigation. The old in-memory demo store is no longer used by these screens.
- Attempts, drafts, conversations, normalized approved learning content, structured evaluations and score breakdowns now have persistent backend records plus additive migrations.
- Profile logout and profile data use the authenticated user context.
- No automated tests, backend, database, migrations, AI boundary, or structured validation existed. Foundations and tests were added.

## Dependency audit

- Expo SDK 50 and React Native 0.73 are an older supported pairing and should be upgraded together only after regression testing; no forced major upgrade was attempted.
- `@expo/webpack-config` is relevant only to the legacy Webpack web path and is not required by modern Metro web builds.
- `node_modules` is tracked in Git despite `.gitignore`; this causes large platform-specific dirty states and should be removed from tracking in a separately approved cleanup.
- `npm audit` reports 41 transitive findings (1 low, 14 moderate, 25 high, 1 critical). Automatic forced fixes were not applied because they can break Expo SDK compatibility.
- Passlib 1.7.4 is incompatible with bcrypt 5; bcrypt is pinned to 4.0.1 and covered by a password-hashing test.

## Remaining production work

The backend and client foundations are production-oriented, but doctor/admin authoring UI, real reset email, Google OAuth, distributed production rate-limit storage, live AI testing with a funded key, hosted PostgreSQL/HTTPS verification, and physical Android APK testing still require external configuration. Existing clinical content is migrated as published for parity; a qualified reviewer must confirm verification status before public clinical use.
