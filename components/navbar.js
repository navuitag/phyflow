import { getGamificationSummary } from "../modules/gamification.js";
import { renderLearnerSwitcher } from "./learnerSwitcher.js";

export function renderNavbar(state, grades = []) {
  const summary = getGamificationSummary(state);
  const options = grades
    .map((grade) => `<option value="${grade}"${grade === state.selectedGrade ? " selected" : ""}>Lớp ${grade}</option>`)
    .join("");

  return `
    <header class="topbar">
      <a class="brand" href="#/home" aria-label="PhyFlow VN home">
        <span class="brand-mark">P</span>
        <span>PhyFlow VN</span>
      </a>
      <nav class="nav-links" aria-label="Điều hướng chính">
        <a href="#/home">Hôm nay</a>
        <a href="#/skills">Kỹ năng</a>
        <a href="#/mindmap">Sơ đồ</a>
        <a href="#/review/errors">Lỗi sai</a>
        <a href="#/profile">Hồ sơ</a>
      </nav>
      <div class="top-stats">
        ${renderLearnerSwitcher(state)}
        ${grades.length ? `<label class="grade-switch">
          <span>Lớp đang học</span>
          <select id="gradeSelect" aria-label="Chọn lớp đang học">${options}</select>
        </label>` : ""}
        <span>${state.streak} ngày</span>
        <span>${state.xp} XP</span>
        <span>Lv ${summary.level}</span>
      </div>
    </header>
  `;
}

export function renderBottomNav() {
  return `
    <nav class="bottom-nav" aria-label="Điều hướng mobile">
      <a href="#/home">Nhà</a>
      <a href="#/skills">Kỹ năng</a>
      <a href="#/mindmap">Sơ đồ</a>
      <a href="#/review/errors">Lỗi</a>
      <a href="#/profile">Tôi</a>
    </nav>
  `;
}
