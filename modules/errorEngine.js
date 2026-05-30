import { normalizePhy } from "../assets/js/utils.js";

export function analyzeError(answer, question, errorPatterns) {
  const normalized = normalizePhy(answer);
  const pattern = errorPatterns.find((item) => {
    const sameSkill = !item.skill || item.skill === question.skill;
    return sameSkill && normalized.includes(normalizePhy(item.pattern));
  });

  if (pattern) {
    return pattern;
  }

  if (question.skill.includes("ohm") || question.skill.includes("g9_b")) {
    if (normalized.includes("u/i") || normalized.includes("i/u")) {
      return {
        skill: question.skill,
        errorType: "FORMULA_ERROR",
        title: "Sai công thức Định luật Ôm",
        message: "Định luật Ôm: I = U/R, không phải U/I hay I/U.",
        hint: question.hint,
        recommendation: question.skill
      };
    }
  }

  if (question.skill.includes("force") || question.skill.includes("g7_b")) {
    return {
      skill: question.skill,
      errorType: "CONCEPT_ERROR",
      title: "Nhầm khái niệm lực",
      message: "Kiểm tra lại đơn vị (N), hướng và điểm đặt lực.",
      hint: question.hint,
      recommendation: question.skill
    };
  }

  return {
    skill: question.skill,
    errorType: "LOGIC_ERROR",
    title: "Cần kiểm tra lại lập luận",
    message: "Đáp án chưa khớp. Hãy đọc lại dữ kiện và thử mô phỏng trực quan.",
    hint: question.hint,
    recommendation: question.skill
  };
}
