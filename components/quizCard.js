import { escapeHtml, shuffle } from "../assets/js/utils.js";

export function renderQuizCard(question, options = {}) {
  const choices = question.type === "multiple_choice" ? shuffle(question.choices) : [];
  const answerArea = question.type === "true_false"
    ? `<div class="choice-grid choice-grid--binary">${(question.choices || ["Đúng", "Sai"]).map((choice) => `
        <button class="choice-btn" data-answer="${escapeHtml(choice)}">${escapeHtml(choice)}</button>
      `).join("")}</div>`
    : question.type === "multiple_choice"
    ? `<div class="choice-grid">${choices.map((choice) => `
        <button class="choice-btn" data-answer="${escapeHtml(choice)}">${escapeHtml(choice)}</button>
      `).join("")}</div>`
    : `
      <form class="answer-form">
        <input class="answer-input" name="answer" autocomplete="off" placeholder="Nhập đáp án của em">
        <button class="btn primary" type="submit">Kiểm tra</button>
      </form>
    `;

  return `
    <article class="quiz-card" data-question-id="${question.id}">
      <div class="quiz-meta">
        <span>${options.workbook ? "Bài tập rèn luyện" : "Mini quiz"}${question.source === "sgk" ? ' <span class="tag tag-sgk">SGK</span>' : question.source === "sbt" ? ' <span class="tag tag-sbt">SBT</span>' : ""}</span>
        <div class="quiz-meta-actions">
          <button class="hint-btn" type="button" data-hint="${escapeHtml(question.hint || "")}">Gợi ý</button>
          ${question.solution && options.workbook ? `<button class="hint-btn solution-btn" type="button" data-solution="${escapeHtml(question.solution)}">Lời giải</button>` : ""}
        </div>
      </div>
      ${question.section ? `<span class="quiz-section">${escapeHtml(question.section)}</span>` : ""}
      <h2>${escapeHtml(question.question)}</h2>
      ${answerArea}
      <div class="feedback-panel" aria-live="polite"></div>
    </article>
  `;
}
