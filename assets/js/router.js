import { getState, resetProgress, setSelectedGrade, completeOnboarding, restartOnboarding, updateState } from "./state.js";
import { setRoute, escapeHtml } from "./utils.js";
import { renderNavbar, renderBottomNav } from "../../components/navbar.js";
import { renderLessonCard } from "../../components/lessonCard.js";
import { renderQuizCard } from "../../components/quizCard.js";
import { renderFlashcardPanel } from "../../components/flashcardPanel.js";
import { renderMemoryPanel } from "../../components/memoryPanel.js";
import { showModal } from "../../components/modal.js";
import { renderVisualization, bindVisualizations } from "../../modules/visualization.js";
import { completeLesson } from "../../modules/lessonEngine.js";
import { submitAnswer } from "../../modules/quizEngine.js";
import { buildFlashcardDeck, buildMemoryDeck, buildMemoryPairs } from "../../modules/practiceContent.js";
import { getGamificationSummary } from "../../modules/gamification.js";
import { getOverallAccuracy, getSkillProgress, getWeakSkills } from "../../modules/progress.js";

let data = {
  skills: [],
  lessons: [],
  questions: [],
  errors: [],
  exercises: []
};

/** Khi user chọn "Luyện thêm" sau khi đúng hết câu, không hỏi chuyển bài lại cho đến khi rời practice. */
const practiceSession = {
  skillId: null,
  continueAfterComplete: false,
  workbookFilter: "all",
  flashcards: null,
  memory: null
};

export function configureRouter(appData) {
  data = appData;
  window.addEventListener("hashchange", renderRoute);
}

export function renderRoute() {
  const state = getState();
  const hash = window.location.hash || "#/home";
  const parts = hash.replace("#/", "").split("/").filter(Boolean);
  const route = parts[0] || "home";
  const id = parts[1];
  const sub = parts[2];

  if (route !== "practice") {
    practiceSession.continueAfterComplete = false;
  }

  if (!state.onboarded) {
    render(renderOnboarding(state));
    bindOnboarding();
    return;
  }

  const shell = (content) => `
    ${renderNavbar(state, availableGrades())}
    <main class="app-shell">
      ${content}
    </main>
    ${renderBottomNav()}
  `;

  let content;
  let after;

  if (route === "lesson") {
    content = renderLesson(id, state);
    after = () => bindLesson(id);
  } else if (route === "simulation") {
    content = renderSimulationPage(id, state);
    after = () => bindVisualizations();
  } else if (route === "practice") {
    if (sub === "flashcards") {
      content = renderPracticeFlashcards(id, state);
      after = () => bindPracticeFlashcards(id);
    } else if (sub === "memory") {
      content = renderPracticeMemory(id, state);
      after = () => bindPracticeMemory(id);
    } else if (sub === "workbook") {
      content = renderPracticeWorkbook(id, state);
      after = () => bindPracticeWorkbook(id);
    } else {
      content = renderPractice(id, state);
      after = () => bindPractice(id);
    }
  } else if (route === "skills") {
    content = renderSkills(state);
    after = bindSkills;
  } else if (route === "review") {
    content = renderErrors(state);
  } else if (route === "profile") {
    content = renderProfile(state);
    after = bindProfile;
  } else {
    content = renderHome(state);
  }

  render(shell(content));
  bindNavbar();
  if (after) after();
}

function bindNavbar() {
  const select = document.querySelector("#gradeSelect");
  if (!select) return;
  select.addEventListener("change", () => {
    setSelectedGrade(Number(select.value));
    renderRoute();
  });
}

function renderOnboarding(state) {
  const grades = availableGrades();
  const cards = grades.map((grade) => {
    const count = data.skills.filter((skill) => skill.grade === grade).length;
    const chapters = new Set(data.skills.filter((skill) => skill.grade === grade).map((skill) => skill.chapterIndex)).size;
    return `
      <button class="grade-pick" data-grade="${grade}">
        <span class="grade-pick-num">Lớp ${grade}</span>
        <span class="grade-pick-meta">${chapters} chương · ${count} bài</span>
      </button>
    `;
  }).join("");

  return `
    <main class="onboarding">
      <section class="onboarding-card">
        <span class="brand-mark">P</span>
        <span class="eyebrow">Chào mừng đến PhyFlow VN</span>
        <h1>Bạn đang học lớp mấy?</h1>
        <p>Chọn lớp để mở đúng lộ trình Vật lí THCS. Bạn có thể đổi lớp bất cứ lúc nào trên thanh điều hướng.</p>
        <div class="grade-pick-grid">
          ${cards}
        </div>
      </section>
    </main>
  `;
}

function bindOnboarding() {
  document.querySelectorAll(".grade-pick").forEach((button) => {
    button.addEventListener("click", () => {
      completeOnboarding(Number(button.dataset.grade));
      if (window.location.hash === "#/home") {
        renderRoute();
      } else {
        setRoute("#/home");
      }
    });
  });
}

function render(content) {
  document.querySelector("#app").innerHTML = content;
}

function renderHome(state) {
  const summary = getGamificationSummary(state);
  const activeGrade = resolveGrade(state);
  const gradeSkills = data.skills.filter((skill) => skill.grade === activeGrade);
  const nextSkill = gradeSkills.find((skill) => !state.completedLessons.includes(skill.id)) || gradeSkills[0] || data.skills[0];
  const questPercent = Math.round((state.dailyQuest.progress / state.dailyQuest.target) * 100);
  const weakSkill = getWeakSkills(state)[0];

  return `
    <section class="hero-panel">
      <div>
        <span class="eyebrow">Lộ trình hôm nay · Lớp ${activeGrade}</span>
        <h1>Học Vật lí mỗi ngày, hiểu rõ từng lỗi sai.</h1>
        <p>Hoàn thành một bài ngắn, luyện vài câu và xem ngay vì sao công thức hoặc mô phỏng chưa đúng.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#/lesson/${nextSkill.id}">Tiếp tục học</a>
          <a class="btn secondary" href="#/practice/${nextSkill.id}">Luyện nhanh</a>
        </div>
      </div>
      <div class="daily-card">
        <span class="tag">Daily Quest</span>
        <h2>${state.dailyQuest.progress}/${state.dailyQuest.target} câu đúng</h2>
        <div class="progress-track"><span style="width:${questPercent}%"></span></div>
        <p>${weakSkill ? `Nên ôn thêm: ${labelSkill(weakSkill.skill)}` : "Bạn chưa có lỗi nổi bật. Khởi động nhẹ thôi."}</p>
      </div>
    </section>
    <section class="stat-grid">
      <article><strong>${state.todayXp}</strong><span>XP hôm nay</span></article>
      <article><strong>${state.streak}</strong><span>Chuỗi ngày</span></article>
      <article><strong>${getOverallAccuracy(state)}%</strong><span>Độ chính xác</span></article>
      <article><strong>${summary.level}</strong><span>Cấp độ</span></article>
    </section>
    <section class="section-head">
      <h2>Kỹ năng tiếp theo · Lớp ${activeGrade}</h2>
      <a href="#/skills">Xem cây kỹ năng</a>
    </section>
    <div class="skill-grid">
      ${gradeSkills.slice(0, 3).map((skill) => renderLessonCard(skill, state, data.questions)).join("")}
    </div>
  `;
}

function availableGrades() {
  return [...new Set(data.skills.map((skill) => skill.grade))].sort((a, b) => a - b);
}

function resolveGrade(state) {
  const grades = availableGrades();
  return grades.includes(state.selectedGrade) ? state.selectedGrade : grades[0];
}

function groupByChapter(skills) {
  const groups = new Map();
  skills
    .slice()
    .sort((a, b) => (a.chapterIndex - b.chapterIndex) || (a.lessonNo - b.lessonNo))
    .forEach((skill) => {
      const key = `${skill.chapterIndex}|${skill.chapter}`;
      if (!groups.has(key)) {
        groups.set(key, { chapter: skill.chapter, chapterIndex: skill.chapterIndex, book: skill.book, items: [] });
      }
      groups.get(key).items.push(skill);
    });
  return [...groups.values()];
}

function renderSkills(state) {
  const grades = availableGrades();
  const activeGrade = resolveGrade(state);
  const gradeSkills = data.skills.filter((skill) => skill.grade === activeGrade);
  const completedCount = gradeSkills.filter((skill) => state.completedLessons.includes(skill.id)).length;
  const chapters = groupByChapter(gradeSkills);

  const tabs = grades.map((grade) => {
    const count = data.skills.filter((skill) => skill.grade === grade).length;
    const isActive = grade === activeGrade ? " active" : "";
    return `<button class="grade-tab${isActive}" data-grade="${grade}" aria-pressed="${grade === activeGrade}">
      <strong>Lớp ${grade}</strong>
      <span>${count} bài</span>
    </button>`;
  }).join("");

  const chapterSections = chapters.map((group) => `
    <section class="chapter-group">
      <header class="chapter-head">
        <span class="tag">Chương ${group.chapterIndex} · ${group.book}</span>
        <h2>${group.chapter}</h2>
      </header>
      <div class="skill-path">
        ${group.items.map((skill) => renderLessonCard(skill, state, data.questions)).join("")}
      </div>
    </section>
  `).join("");

  return `
    <section class="page-title">
      <span class="eyebrow">Skill Tree</span>
      <h1>Cây kỹ năng Vật lí THCS</h1>
      <p>Chọn lớp để bắt đầu. Mỗi nút là một vi kỹ năng; hoàn thành bài trước để mở khóa bài tiếp theo.</p>
    </section>
    <div class="grade-tabs" role="group" aria-label="Chọn lớp">
      ${tabs}
    </div>
    <div class="grade-summary">
      <span>Lớp ${activeGrade} · ${chapters.length} chương · ${gradeSkills.length} bài</span>
      <span>${completedCount}/${gradeSkills.length} bài đã hoàn thành</span>
    </div>
    ${chapterSections}
  `;
}

function bindSkills() {
  document.querySelectorAll(".grade-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      setSelectedGrade(Number(tab.dataset.grade));
      renderRoute();
      document.querySelector(".grade-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderLesson(id, state) {
  const lesson = data.lessons.find((item) => item.id === id);
  if (!lesson) return notFound("Không tìm thấy bài học.");
  const skillProgress = getSkillProgress({ id: lesson.skill }, state, data.questions);
  const skill = data.skills.find((s) => s.id === lesson.skill);

  return `
    <section class="lesson-layout">
      <aside class="lesson-sidebar">
        <a class="back-link" href="#/skills">← Kỹ năng</a>
        <h1>${lesson.title}</h1>
        <p>${skillProgress.mastery}% mastery</p>
        <div class="progress-track"><span style="width:${skillProgress.mastery}%"></span></div>
        ${skill?.hasSimulation ? `<a class="btn secondary" href="#/simulation/${lesson.skill}">Mô phỏng</a>` : ""}
      </aside>
      <div class="lesson-steps">
        ${lesson.steps.map((step, index) => `
          <article class="lesson-step">
            <span class="step-count">${index + 1}</span>
            <div>
              <h2>${step.title}</h2>
              <p>${step.content}</p>
              ${step.type === "visualization" || step.type === "simulation" ? renderVisualization(step) : ""}
            </div>
          </article>
        `).join("")}
        <div class="completion-panel">
          <div>
            <h2>Sẵn sàng luyện tập?</h2>
            <p>Hoàn thành bài để nhận ${lesson.xp} XP rồi làm mini quiz.</p>
          </div>
          <button class="btn primary" id="completeLesson">Hoàn thành</button>
        </div>
      </div>
    </section>
  `;
}

function bindLesson(id) {
  bindVisualizations();
  const lesson = data.lessons.find((item) => item.id === id);
  const button = document.querySelector("#completeLesson");
  if (!lesson || !button) return;
  button.addEventListener("click", () => {
    completeLesson(lesson);
    showModal({
      title: "Bài học đã hoàn thành",
      body: `Bạn nhận ${lesson.xp} XP. Giờ mình chuyển sang phần luyện tập nhé.`,
      actionLabel: "Luyện ngay"
    });
    setTimeout(() => setRoute(`#/practice/${lesson.skill}`), 500);
  });
}

function renderSimulationPage(id, state) {
  const skill = data.skills.find((s) => s.id === id);
  if (!skill) return notFound("Không tìm thấy mô phỏng.");
  return `
    <section class="practice-layout">
      <div class="practice-header">
        <a class="back-link" href="#/lesson/${id}">← Bài học</a>
        <span class="tag">${skill.title}</span>
      </div>
      <h1>Mô phỏng: ${skill.title}</h1>
      ${renderVisualization({ type: "simulation", visualization: "simulation", simulation: skill.simulation || "ohm", voltage: 12, resistance: 6 })}
    </section>
  `;
}

function getSkillQuestions(skillId) {
  return data.questions.filter((question) => question.skill === skillId);
}

function getCorrectQuestionIds(skillId, state) {
  return new Set(
    state.answers
      .filter((answer) => answer.skill === skillId && answer.correct)
      .map((answer) => answer.questionId)
  );
}

function areAllQuestionsCorrect(skillId, state) {
  const skillQuestions = getSkillQuestions(skillId);
  if (!skillQuestions.length) return false;
  const correctIds = getCorrectQuestionIds(skillId, state);
  return skillQuestions.every((question) => correctIds.has(question.id));
}

function pickPracticeQuestion(skillId, state) {
  const skillQuestions = getSkillQuestions(skillId);
  const correctIds = getCorrectQuestionIds(skillId, state);
  const remaining = skillQuestions.filter((question) => !correctIds.has(question.id));
  if (remaining.length) {
    return remaining[0];
  }
  if (!practiceSession.continueAfterComplete) {
    return null;
  }
  const attempts = state.answers.filter((answer) => answer.skill === skillId).length;
  return skillQuestions[attempts % skillQuestions.length];
}

function getNextSkill(currentSkillId) {
  const current = data.skills.find((skill) => skill.id === currentSkillId);
  if (!current) return null;
  const gradeSkills = data.skills
    .filter((skill) => skill.grade === current.grade)
    .sort((a, b) => (a.chapterIndex - b.chapterIndex) || (a.lessonNo - b.lessonNo));
  const index = gradeSkills.findIndex((skill) => skill.id === currentSkillId);
  return index >= 0 ? gradeSkills[index + 1] || null : null;
}

function renderPracticeCompletionPanel(skillId) {
  const nextSkill = getNextSkill(skillId);
  return `
    <article class="quiz-complete-panel">
      <h2>Đã trả lời đúng tất cả câu hỏi!</h2>
      <p>Bạn muốn chuyển sang bài tiếp theo hay luyện thêm các câu này?</p>
      <div class="quiz-complete-actions">
        ${nextSkill
          ? `<button class="btn primary" type="button" id="practiceNextLesson">Bài tiếp theo</button>`
          : `<a class="btn primary" href="#/skills">Về cây kỹ năng</a>`}
        <button class="btn secondary" type="button" id="practiceContinue">Luyện thêm</button>
      </div>
    </article>
  `;
}


function getSkillExercises(skillId) {
  return (data.exercises || []).filter((item) => item.skill === skillId);
}

function getFilteredExercises(skillId) {
  const all = getSkillExercises(skillId);
  if (practiceSession.workbookFilter === "sgk") return all.filter((item) => item.source === "sgk");
  if (practiceSession.workbookFilter === "sbt") return all.filter((item) => item.source === "sbt");
  return all;
}

function getCorrectExerciseIds(skillId, state) {
  return new Set(
    state.answers
      .filter((answer) => answer.skill === skillId && answer.correct && String(answer.questionId).startsWith("ex_"))
      .map((answer) => answer.questionId)
  );
}

function areAllExercisesCorrect(skillId, state) {
  const list = getFilteredExercises(skillId);
  if (!list.length) return false;
  const correctIds = getCorrectExerciseIds(skillId, state);
  return list.every((item) => correctIds.has(item.id));
}

function pickPracticeExercise(skillId, state) {
  const list = getFilteredExercises(skillId);
  const correctIds = getCorrectExerciseIds(skillId, state);
  const remaining = list.filter((item) => !correctIds.has(item.id));
  if (remaining.length) return remaining[0];
  if (!practiceSession.continueAfterComplete) return null;
  const attempts = state.answers.filter((answer) => answer.skill === skillId && String(answer.questionId).startsWith("ex_")).length;
  return list[attempts % list.length];
}

function renderWorkbookFilters(skillId, activeFilter) {
  const counts = { all: 0, sgk: 0, sbt: 0 };
  getSkillExercises(skillId).forEach((item) => {
    counts.all += 1;
    counts[item.source] = (counts[item.source] || 0) + 1;
  });
  const filters = [
    { id: "all", label: `Tất cả (${counts.all})` },
    { id: "sgk", label: `SGK (${counts.sgk})` },
    { id: "sbt", label: `SBT (${counts.sbt})` }
  ];
  return `
    <div class="workbook-filters" role="group" aria-label="Lọc bài tập">
      ${filters.map((filter) => `
        <button type="button" class="workbook-filter${filter.id === activeFilter ? " active" : ""}" data-workbook-filter="${filter.id}">${filter.label}</button>
      `).join("")}
    </div>
  `;
}

function renderPracticeWorkbook(skillId, state) {
  const list = getSkillExercises(skillId);
  if (!list.length) return notFound("Chưa có bài tập rèn luyện cho kỹ năng này.");
  resetPracticeModesIfNeeded(skillId);
  const allComplete = areAllExercisesCorrect(skillId, state);
  const exercise = allComplete && !practiceSession.continueAfterComplete ? null : pickPracticeExercise(skillId, state);
  const done = getCorrectExerciseIds(skillId, state).size;
  const progress = `
    <p class="workbook-progress">Đã hoàn thành ${done}/${getFilteredExercises(skillId).length} bài tập${practiceSession.workbookFilter !== "all" ? ` (${practiceSession.workbookFilter.toUpperCase()})` : ""}</p>
    ${renderWorkbookFilters(skillId, practiceSession.workbookFilter)}
  `;
  const body = exercise
    ? `${progress}${renderQuizCard(exercise, { workbook: true })}`
    : `${progress}${renderPracticeCompletionPanel(skillId)}`;
  return renderPracticeShell(skillId, state, "workbook", body);
}

function bindPracticeWorkbook(skillId) {
  bindVisualizations();
  document.querySelectorAll("[data-workbook-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      practiceSession.workbookFilter = button.dataset.workbookFilter;
      practiceSession.continueAfterComplete = false;
      renderRoute();
    });
  });
  document.querySelector("#practiceContinue")?.addEventListener("click", () => {
    practiceSession.continueAfterComplete = true;
    renderRoute();
  });
  document.querySelector("#practiceNextLesson")?.addEventListener("click", () => navigateToNextSkill(skillId));
  const exercise = (data.exercises || []).find((item) => item.id === document.querySelector(".quiz-card")?.dataset.questionId);
  if (!exercise) return;
  document.querySelectorAll(".choice-btn").forEach((button) => {
    button.addEventListener("click", () => handleAnswer(button.dataset.answer, exercise, skillId));
  });
  const form = document.querySelector(".answer-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleAnswer(new FormData(form).get("answer"), exercise, skillId);
    });
  }
  document.querySelector(".hint-btn")?.addEventListener("click", (event) => {
    const hint = event.currentTarget.dataset.hint;
    if (hint) showModal({ title: "Gợi ý", body: hint });
  });
  document.querySelector(".solution-btn")?.addEventListener("click", (event) => {
    const solution = event.currentTarget.dataset.solution;
    if (solution) showModal({ title: "Lời giải SBT", body: solution });
  });
}

function resetPracticeModesIfNeeded(skillId) {
  if (practiceSession.skillId !== skillId) {
    practiceSession.skillId = skillId;
    practiceSession.continueAfterComplete = false;
    practiceSession.workbookFilter = "all";
    practiceSession.flashcards = null;
    practiceSession.memory = null;
  }
}

function renderPracticeTabs(skillId, activeMode) {
  const modes = [
    { id: "quiz", label: "Mini quiz", href: `#/practice/${skillId}` },
    { id: "flashcards", label: "Flashcards", href: `#/practice/${skillId}/flashcards` },
    { id: "memory", label: "Memory", href: `#/practice/${skillId}/memory` },
    { id: "workbook", label: "Bài tập", href: `#/practice/${skillId}/workbook` }
  ];

  return `
    <nav class="practice-tabs" role="tablist" aria-label="Chế độ luyện tập">
      ${modes.map((mode) => `
        <a
          class="practice-tab${mode.id === activeMode ? " active" : ""}"
          href="${mode.href}"
          role="tab"
          aria-selected="${mode.id === activeMode}"
        >${mode.label}</a>
      `).join("")}
    </nav>
  `;
}

function renderPracticeShell(skillId, state, activeMode, body) {
  const skill = data.skills.find((item) => item.id === skillId);
  return `
    <section class="practice-layout">
      <div class="practice-header">
        <a class="back-link" href="#/skills">← Kỹ năng</a>
        <span class="tag">${labelSkill(skillId)}</span>
      </div>
      ${renderPracticeTabs(skillId, activeMode)}
      ${activeMode === "quiz" ? renderVisualization({ visualization: skill?.visualization }) : ""}
      ${body}
    </section>
  `;
}

function ensureFlashcardDeck(skillId) {
  if (practiceSession.flashcards?.deck) return;
  const lesson = data.lessons.find((item) => item.skill === skillId);
  const skill = data.skills.find((item) => item.id === skillId);
  practiceSession.flashcards = {
    deck: buildFlashcardDeck(skillId, lesson, data.questions, skill),
    index: 0,
    flipped: false,
    known: new Set(),
    xpAwarded: false
  };
}

function ensureMemorySession(skillId) {
  if (practiceSession.memory?.deck) return;
  const lesson = data.lessons.find((item) => item.skill === skillId);
  const pairs = buildMemoryPairs(skillId, lesson, data.questions);
  practiceSession.memory = {
    pairs,
    deck: buildMemoryDeck(pairs),
    flipped: [],
    matched: [],
    moves: 0,
    locked: false,
    xpAwarded: false
  };
}

function awardPracticeBonus(amount, title, body) {
  updateState((next) => {
    next.xp += amount;
    next.todayXp += amount;
  });
  showModal({ title, body: `${body} (+${amount} XP)` });
}

function renderPracticeFlashcards(skillId, state) {
  if (!data.skills.find((item) => item.id === skillId)) {
    return notFound("Không tìm thấy kỹ năng.");
  }
  resetPracticeModesIfNeeded(skillId);
  ensureFlashcardDeck(skillId);
  const session = practiceSession.flashcards;
  const panel = renderFlashcardPanel(session.deck, session.index, session.flipped);
  return renderPracticeShell(skillId, state, "flashcards", panel);
}

function renderPracticeMemory(skillId, state) {
  if (!data.skills.find((item) => item.id === skillId)) {
    return notFound("Không tìm thấy kỹ năng.");
  }
  resetPracticeModesIfNeeded(skillId);
  ensureMemorySession(skillId);
  const session = practiceSession.memory;
  const won = session.pairs.length > 0 && session.matched.length === session.pairs.length;
  const panel = renderMemoryPanel(session.deck, session.flipped, session.matched, session.moves, won);
  return renderPracticeShell(skillId, state, "memory", panel);
}

function bindPracticeFlashcards(skillId) {
  const session = practiceSession.flashcards;
  if (!session?.deck.length) return;

  const updateProgress = () => {
    const progress = document.querySelector("#flashcardProgress");
    if (!progress) return;
    progress.textContent = `${session.known.size}/${session.deck.length} thẻ đã nhớ`;
  };
  updateProgress();

  const flip = () => {
    session.flipped = !session.flipped;
    renderRoute();
  };

  document.querySelector("#flashcardFlip")?.addEventListener("click", flip);

  document.querySelector("#flashcardPrev")?.addEventListener("click", () => {
    if (session.index <= 0) return;
    session.index -= 1;
    session.flipped = false;
    renderRoute();
  });

  document.querySelector("#flashcardNext")?.addEventListener("click", () => {
    if (session.index >= session.deck.length - 1) return;
    session.index += 1;
    session.flipped = false;
    renderRoute();
  });

  document.querySelector("#flashcardKnown")?.addEventListener("click", () => {
    const card = session.deck[session.index];
    session.known.add(card.id);
    if (session.known.size >= session.deck.length && !session.xpAwarded) {
      session.xpAwarded = true;
      renderRoute();
      awardPracticeBonus(15, "Hoàn thành Flashcards!", "Bạn đã xem và ghi nhớ hết bộ thẻ.");
      return;
    }
    if (session.index < session.deck.length - 1) {
      session.index += 1;
      session.flipped = false;
    }
    renderRoute();
  });
}

function bindPracticeMemory(skillId) {
  const session = practiceSession.memory;
  if (!session?.deck.length) return;

  document.querySelector("#memoryRestart")?.addEventListener("click", () => {
    practiceSession.memory = null;
    ensureMemorySession(skillId);
    renderRoute();
  });

  document.querySelectorAll(".memory-card:not(.is-matched):not([disabled])").forEach((button) => {
    button.addEventListener("click", () => handleMemoryFlip(skillId, button.dataset.cardId));
  });
}

function handleMemoryFlip(skillId, cardId) {
  const session = practiceSession.memory;
  if (!session || session.locked) return;
  if (session.flipped.includes(cardId)) return;

  const card = session.deck.find((item) => item.id === cardId);
  if (!card || session.matched.includes(card.pairId)) return;

  session.flipped.push(cardId);

  if (session.flipped.length < 2) {
    renderRoute();
    return;
  }

  session.moves += 1;
  const [firstId, secondId] = session.flipped;
  const first = session.deck.find((item) => item.id === firstId);
  const second = session.deck.find((item) => item.id === secondId);

  if (first.pairId === second.pairId) {
    session.matched.push(first.pairId);
    session.flipped = [];
    renderRoute();
    if (session.matched.length === session.pairs.length && !session.xpAwarded) {
      session.xpAwarded = true;
      setTimeout(() => {
        awardPracticeBonus(20, "Hoàn thành Memory Training!", `Ghép đủ ${session.pairs.length} cặp trong ${session.moves} lượt.`);
      }, 350);
    }
    return;
  }

  session.locked = true;
  renderRoute();
  setTimeout(() => {
    session.flipped = [];
    session.locked = false;
    renderRoute();
  }, 850);
}

function renderPractice(id, state) {
  const skillQuestions = getSkillQuestions(id);
  if (!skillQuestions.length) return notFound("Chưa có câu hỏi cho kỹ năng này.");

  resetPracticeModesIfNeeded(id);

  const allComplete = areAllQuestionsCorrect(id, state);
  const question = allComplete && !practiceSession.continueAfterComplete
    ? null
    : pickPracticeQuestion(id, state);

  const body = question ? renderQuizCard(question) : renderPracticeCompletionPanel(id);
  return renderPracticeShell(id, state, "quiz", body);
}

function bindPractice(id) {
  bindVisualizations();

  const continueBtn = document.querySelector("#practiceContinue");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      practiceSession.continueAfterComplete = true;
      renderRoute();
    });
  }

  const nextBtn = document.querySelector("#practiceNextLesson");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => navigateToNextSkill(id));
  }

  const question = data.questions.find((item) => item.id === document.querySelector(".quiz-card")?.dataset.questionId);
  if (!question) return;

  document.querySelectorAll(".choice-btn").forEach((button) => {
    button.addEventListener("click", () => handleAnswer(button.dataset.answer, question, id));
  });

  const form = document.querySelector(".answer-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleAnswer(new FormData(form).get("answer"), question, id);
    });
  }

  const hint = document.querySelector(".hint-btn");
  if (hint) {
    hint.addEventListener("click", () => showModal({ title: "Gợi ý", body: hint.dataset.hint }));
  }
}

function navigateToNextSkill(currentSkillId) {
  const nextSkill = getNextSkill(currentSkillId);
  if (nextSkill) {
    setRoute(`#/lesson/${nextSkill.id}`);
    return;
  }
  setRoute("#/skills");
}

function promptPracticeCompletion(skillId) {
  const nextSkill = getNextSkill(skillId);
  showModal({
    title: "Hoàn thành mini quiz!",
    body: nextSkill
      ? "Bạn đã trả lời đúng tất cả câu hỏi. Chuyển sang bài tiếp theo?"
      : "Bạn đã trả lời đúng tất cả câu hỏi của bài này.",
    actionLabel: nextSkill ? "Bài tiếp theo" : "Về cây kỹ năng",
    secondaryLabel: "Luyện thêm",
    onAction: () => navigateToNextSkill(skillId),
    onSecondary: () => {
      practiceSession.continueAfterComplete = true;
      renderRoute();
    }
  });
}

function handleAnswer(answer, question, skillId) {
  const result = submitAnswer(answer, question, data.errors);
  const panel = document.querySelector(".feedback-panel");
  const card = document.querySelector(".quiz-card");
  card.classList.remove("is-correct", "is-wrong");
  card.classList.add(result.correct ? "is-correct" : "is-wrong");
  const isWorkbook = String(question.id || "").startsWith("ex_");

  if (result.correct) {
    const state = getState();
    const allComplete = isWorkbook
      ? areAllExercisesCorrect(skillId, state)
      : areAllQuestionsCorrect(skillId, state);

    if (allComplete && !practiceSession.continueAfterComplete) {
      panel.innerHTML = `
        <strong>Chính xác! +${result.xp} XP</strong>
        <p>Bạn đã trả lời đúng tất cả câu hỏi của bài này.</p>
      `;
      setTimeout(() => promptPracticeCompletion(skillId), 400);
      return;
    }

    panel.innerHTML = `
      <strong>Chính xác! +${result.xp} XP</strong>
      <p>${allComplete ? "Tiếp tục luyện thêm..." : "Câu tiếp theo sẽ xuất hiện sau một nhịp."}</p>
    `;
    setTimeout(() => {
      const nextRoute = isWorkbook ? `#/practice/${skillId}/workbook` : `#/practice/${skillId}`;
      if (window.location.hash.startsWith(`#/practice/${skillId}`)) {
        renderRoute();
      } else {
        setRoute(nextRoute);
      }
    }, 900);
    return;
  }

  panel.innerHTML = `
    <strong>${escapeHtml(result.error.title)}</strong>
    <p>${escapeHtml(result.error.message)}</p>
    <p><b>Gợi ý:</b> ${escapeHtml(result.error.hint)}</p>
    <a class="btn quiet" href="#/lesson/${result.error.recommendation}">Ôn lại bài liên quan</a>
  `;
}

function renderErrors(state) {
  const weakSkills = getWeakSkills(state);
  return `
    <section class="page-title">
      <span class="eyebrow">Error Review</span>
      <h1>Sổ tay lỗi sai</h1>
      <p>Ứng dụng lưu lỗi gần đây để gợi ý bài cần ôn — đặc biệt khi nhầm công thức, đơn vị hoặc khái niệm vật lí.</p>
    </section>
    <div class="review-grid">
      <article class="review-summary">
        <h2>Kỹ năng cần chú ý</h2>
        ${weakSkills.length ? weakSkills.map((item) => `
          <div class="weak-row">
            <span>${labelSkill(item.skill)}</span>
            <strong>${item.count} lỗi</strong>
          </div>
        `).join("") : "<p>Chưa có lỗi nào được ghi nhận.</p>"}
      </article>
      <div class="error-list">
        ${state.errors.length ? state.errors.map((error) => `
          <article class="error-card">
            <span class="tag">${labelSkill(error.skill)}</span>
            <h2>${escapeHtml(error.title)}</h2>
            <p>${escapeHtml(error.message)}</p>
            <p><b>Gợi ý:</b> ${escapeHtml(error.hint)}</p>
            <a class="btn quiet" href="#/practice/${error.recommendation}">Luyện lại</a>
          </article>
        `).join("") : "<article class='empty-state'>Làm vài câu quiz để sổ tay bắt đầu ghi nhận lỗi nhé.</article>"}
      </div>
    </div>
  `;
}

function renderProfile(state) {
  const summary = getGamificationSummary(state);
  return `
    <section class="page-title">
      <span class="eyebrow">Hồ sơ</span>
      <h1>${state.user.name}</h1>
      <p>Đang học Lớp ${resolveGrade(state)} · Level ${summary.level} · ${state.xp} XP</p>
    </section>
    <section class="profile-grid">
      <article>
        <h2>Huy hiệu</h2>
        <div class="badge-list">
          ${summary.badges.length ? summary.badges.map((badge) => `<span>${badge}</span>`).join("") : "<p>Hoàn thành bài đầu tiên để nhận huy hiệu.</p>"}
        </div>
      </article>
      <article>
        <h2>Tiến độ cấp độ</h2>
        <div class="progress-track"><span style="width:${Math.round((summary.currentLevelXp / summary.nextLevelXp) * 100)}%"></span></div>
        <p>${summary.currentLevelXp}/${summary.nextLevelXp} XP tới level tiếp theo</p>
      </article>
      <article>
        <h2>Lớp đang học</h2>
        <p>Bạn đang theo lộ trình Lớp ${resolveGrade(state)}. Đổi lớp sẽ mở lại màn hình chọn lớp (tiến độ được giữ nguyên).</p>
        <button class="btn secondary" id="changeGrade">Đổi lớp</button>
      </article>
      <article>
        <h2>Dữ liệu học tập</h2>
        <button class="btn danger" id="resetProgress">Xóa tiến độ local</button>
      </article>
    </section>
  `;
}

function bindProfile() {
  const reset = document.querySelector("#resetProgress");
  if (reset) {
    reset.addEventListener("click", () => {
      resetProgress();
      setRoute("#/home");
    });
  }

  const changeGrade = document.querySelector("#changeGrade");
  if (changeGrade) {
    changeGrade.addEventListener("click", () => {
      restartOnboarding();
      renderRoute();
    });
  }
}

function labelSkill(id) {
  return data.skills.find((skill) => skill.id === id)?.title || id;
}

function notFound(message) {
  return `<section class="empty-state">${message}<br><a class="btn primary" href="#/home">Về trang chính</a></section>`;
}
