/**
 * Multi-learner profile storage for *Flow apps.
 * @param {object} config
 * @param {string} config.legacyKey - Old single-user localStorage key
 * @param {string} config.storageKey - New accounts localStorage key
 * @param {() => object} config.defaultProgress - Fresh progress shape per app
 * @param {string} [config.defaultName="Học viên"] - Default learner name
 * @param {(raw: object, progress: object) => void} [config.hydrateProgress] - Map legacy fields
 * @param {(progress: object, profile: object|null) => object} config.buildUser - Public user object
 */
export function createProfileStore(config) {
  const {
    legacyKey,
    storageKey,
    defaultProgress,
    defaultName = "Học viên",
    hydrateProgress,
    buildUser
  } = config;

  const AVATAR_COLORS = ["#20a36b", "#193f65", "#e07b39", "#7c3aed", "#db2777", "#0891b2"];

  function createEmptyAccounts() {
    return { activeProfileId: "", profiles: [], progress: {} };
  }

  function profileColor(id) {
    let hash = 0;
    for (const char of id) hash = (hash + char.charCodeAt(0)) % AVATAR_COLORS.length;
    return AVATAR_COLORS[hash];
  }

  function createProfileId() {
    return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function extractProgress(raw = {}) {
    const progress = defaultProgress();
    for (const key of Object.keys(progress)) {
      if (raw[key] !== undefined) progress[key] = raw[key];
    }
    hydrateProgress?.(raw, progress);
    return progress;
  }

  function migrateLegacyState() {
    try {
      const legacy = localStorage.getItem(legacyKey);
      if (!legacy) return null;
      const old = JSON.parse(legacy);
      const id = createProfileId();
      const accounts = {
        activeProfileId: id,
        profiles: [{
          id,
          name: old.user?.name || defaultName,
          avatarColor: profileColor(id),
          createdAt: new Date().toISOString().slice(0, 10)
        }],
        progress: { [id]: extractProgress(old) }
      };
      localStorage.removeItem(legacyKey);
      return accounts;
    } catch {
      return null;
    }
  }

  function loadAccounts() {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const accounts = JSON.parse(stored);
        if (!accounts.progress) accounts.progress = {};
        if (!Array.isArray(accounts.profiles)) accounts.profiles = [];
        return accounts;
      }
    } catch {
      /* fall through */
    }

    const migrated = migrateLegacyState();
    if (migrated) {
      saveAccounts(migrated);
      return migrated;
    }

    return createEmptyAccounts();
  }

  function saveAccounts(accounts) {
    localStorage.setItem(storageKey, JSON.stringify(accounts));
  }

  function getActiveProfile(accounts) {
    return accounts.profiles.find((profile) => profile.id === accounts.activeProfileId) || null;
  }

  function getActiveProgress(accounts) {
    const id = accounts.activeProfileId;
    if (!id) return defaultProgress();
    if (!accounts.progress[id]) accounts.progress[id] = defaultProgress();
    return accounts.progress[id];
  }

  function buildPublicState(accounts) {
    const profile = getActiveProfile(accounts);
    const progress = getActiveProgress(accounts);
    return {
      profileId: profile?.id || "",
      user: buildUser(progress, profile),
      avatarColor: profile?.avatarColor || AVATAR_COLORS[0],
      ...progress
    };
  }

  let accounts = loadAccounts();
  let state = buildPublicState(accounts);
  const listeners = new Set();

  function persist(mutator) {
    mutator(accounts);
    saveAccounts(accounts);
    state = buildPublicState(accounts);
    listeners.forEach((listener) => listener(state));
  }

  function summarizeProgress(progress = defaultProgress()) {
    const totalAnswers = progress.answers?.length || 0;
    const correctAnswers = (progress.answers || []).filter((item) => item.correct).length;
    return {
      xp: progress.xp || 0,
      completedLessons: progress.completedLessons?.length || 0,
      accuracy: totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
      onboarded: Boolean(progress.onboarded)
    };
  }

  return {
    getProfiles() {
      return accounts.profiles.map((profile) => ({
        ...profile,
        summary: summarizeProgress(accounts.progress[profile.id] || defaultProgress())
      }));
    },
    summarizeProgress,
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    updateState(mutator) {
      persist((next) => {
        const progress = getActiveProgress(next);
        mutator(progress);
        next.progress[next.activeProfileId] = progress;
      });
    },
    completeOnboarding(levelOrGrade, name) {
      persist((next) => {
        const profile = getActiveProfile(next);
        if (profile && name?.trim()) profile.name = name.trim();
        const progress = getActiveProgress(next);
        config.onCompleteOnboarding?.(progress, levelOrGrade);
        progress.onboarded = true;
        next.progress[next.activeProfileId] = progress;
      });
    },
    restartOnboarding() {
      this.updateState((next) => {
        next.onboarded = false;
      });
    },
    createProfile(name) {
      const trimmed = String(name || "").trim();
      if (!trimmed) return null;
      const id = createProfileId();
      persist((next) => {
        next.profiles.push({
          id,
          name: trimmed,
          avatarColor: profileColor(id),
          createdAt: new Date().toISOString().slice(0, 10)
        });
        next.progress[id] = defaultProgress();
        next.activeProfileId = id;
      });
      return id;
    },
    switchProfile(profileId) {
      if (!accounts.profiles.some((profile) => profile.id === profileId)) return false;
      persist((next) => {
        next.activeProfileId = profileId;
      });
      return true;
    },
    renameProfile(profileId, name) {
      const trimmed = String(name || "").trim();
      if (!trimmed) return false;
      persist((next) => {
        const profile = next.profiles.find((item) => item.id === profileId);
        if (!profile) return;
        profile.name = trimmed;
      });
      return true;
    },
    deleteProfile(profileId) {
      if (accounts.profiles.length <= 1) return false;
      if (!accounts.profiles.some((profile) => profile.id === profileId)) return false;
      persist((next) => {
        next.profiles = next.profiles.filter((profile) => profile.id !== profileId);
        delete next.progress[profileId];
        if (next.activeProfileId === profileId) {
          next.activeProfileId = next.profiles[0]?.id || "";
        }
      });
      return true;
    },
    resetProgress(profileId = accounts.activeProfileId) {
      persist((next) => {
        if (!next.profiles.some((profile) => profile.id === profileId)) return;
        const previous = next.progress[profileId] || defaultProgress();
        next.progress[profileId] = defaultProgress();
        if (profileId === next.activeProfileId) {
          next.progress[profileId].onboarded = true;
          for (const key of config.preserveOnReset || []) {
            if (previous[key] !== undefined) next.progress[profileId][key] = previous[key];
          }
        }
      });
    },
    hasProfiles() {
      return accounts.profiles.length > 0;
    }
  };
}
