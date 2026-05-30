const STORAGE_KEY = "phyflow_vn_state";

const defaultState = {
  user: {
    name: "Bạn học nhỏ",
    grade: 6
  },
  selectedGrade: 6,
  onboarded: false,
  xp: 0,
  todayXp: 0,
  streak: 1,
  completedLessons: [],
  skillMastery: {},
  answers: [],
  errors: [],
  dailyQuest: {
    target: 5,
    progress: 0
  },
  lastStudiedDate: new Date().toISOString().slice(0, 10)
};

let state = loadState();
const listeners = new Set();

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateState(mutator) {
  const next = structuredClone(state);
  mutator(next);
  state = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener(state));
}

export function setSelectedGrade(grade) {
  updateState((next) => {
    next.selectedGrade = grade;
  });
}

export function completeOnboarding(grade) {
  updateState((next) => {
    next.selectedGrade = grade;
    next.user.grade = grade;
    next.onboarded = true;
  });
}

export function restartOnboarding() {
  updateState((next) => {
    next.onboarded = false;
  });
}

export function resetProgress() {
  state = structuredClone(defaultState);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener(state));
}
