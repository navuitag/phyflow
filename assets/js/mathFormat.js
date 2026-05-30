import { escapeHtml } from "./utils.js";

const FRAC_RE = /(\d+)\/(\d+)/g;
const EXP_RE = /(\([^)]+\)|\d+(?:[,.]\d+)?|[a-zA-Z])(\^(\([^)]+\)|\{[^}]+\}|\d+|[a-zA-Z]+))/g;
const SUB_RE = /([a-zA-Z])(_\{([^}]+)\}|_(\d+|[a-zA-Z]+))/g;
const SQRT_PAREN_RE = /√\(([^)]+)\)/g;
const SQRT_NUM_RE = /√(\d+)/g;

function wrapFrac(num, den) {
  return `<span class="math-frac" aria-label="${num}/${den}"><span class="math-num">${num}</span><span class="math-den">${den}</span></span>`;
}

function wrapSup(base, exp) {
  return `<span class="math-inline"><span class="math-base">${base}</span><sup class="math-sup">${exp}</sup></span>`;
}

function wrapSub(base, sub) {
  return `<span class="math-inline"><span class="math-base">${base}</span><sub class="math-sub">${sub}</sub></span>`;
}

function replaceFractions(text) {
  return text.replace(FRAC_RE, (_, num, den) => wrapFrac(num, den));
}

function replaceExponents(text) {
  return text.replace(EXP_RE, (_, base, __, exp) => {
    const clean = exp.replace(/^\{|\}$/g, "").replace(/^\(|\)$/g, "");
    return wrapSup(base, clean);
  });
}

function replaceSubscripts(text) {
  return text.replace(SUB_RE, (_, base, __, sub) => wrapSub(base, sub.replace(/^\{|\}$/g, "")));
}

function replaceSqrt(text) {
  return text
    .replace(SQRT_PAREN_RE, (_, inner) => `<span class="math-sqrt"><span class="math-sqrt-sign">√</span><span class="math-sqrt-body">${inner}</span></span>`)
    .replace(SQRT_NUM_RE, (_, n) => `<span class="math-sqrt">√<span class="math-sqrt-body">${n}</span></span>`);
}

function replaceOperators(text) {
  return text
    .replace(/(\d)\*(\d)/g, "$1·$2")
    .replace(/\)\*(\d)/g, ")·$1")
    .replace(/(\d)\*\(/g, "$1·(")
    .replace(/(\d)\*([a-zA-Z])/g, "$1·$2")
    .replace(/([a-zA-Z])\*(\d)/g, "$1·$2")
    .replace(/(\d)\/(\d)\s*\*\s*(\d)/g, "$1/$2 · $3")
    .replace(/\s*\*\s*/g, " · ");
}

/** Chuyển văn bản thuần (2^3, 1/2, x_1) sang HTML toán học an toàn. */
export function formatMathHtml(value) {
  if (value == null || value === "") return "";
  let text = escapeHtml(String(value));

  text = replaceSqrt(text);
  text = replaceOperators(text);
  text = replaceExponents(text);
  text = replaceSubscripts(text);
  text = replaceFractions(text);

  return text;
}

/** Gắn class math-content cho container sau khi render DOM. */
export function bindMathContent(root = document) {
  root.querySelectorAll(".math-content").forEach((el) => {
    if (el.dataset.mathBound === "1") return;
    el.dataset.mathBound = "1";
  });
}
