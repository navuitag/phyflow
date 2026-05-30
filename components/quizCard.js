import { escapeHtml } from "../assets/js/utils.js";

export function renderQuizCard(question) {
  const answerArea = question.type === "multiple_choice"
    ? `<div class="choice-grid">${question.choices.map((choice) => `
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
        <span>Mini quiz</span>
        <button class="hint-btn" type="button" data-hint="${escapeHtml(question.hint)}">Gợi ý</button>
      </div>
      <h2>${escapeHtml(question.question)}</h2>
      ${answerArea}
      <div class="feedback-panel" aria-live="polite"></div>
    </article>
  `;
}
