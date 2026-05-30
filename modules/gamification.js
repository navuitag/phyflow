import { levelFromXp } from "../assets/js/utils.js";

export function getGamificationSummary(state) {
  const level = levelFromXp(state.xp);
  const currentLevelXp = state.xp % 120;
  const badges = [];

  if (state.completedLessons.includes("g6_b01")) badges.push("Khởi đầu Vật lí");
  if (state.completedLessons.includes("g6_b06")) badges.push("Thợ đo lường");
  if (state.completedLessons.includes("g7_b03")) badges.push("Hiểu chuyển động");
  if (state.completedLessons.includes("g8_b06")) badges.push("Thợ mạch điện");
  if (state.completedLessons.includes("g9_b01")) badges.push("Bậc thầy Định luật Ôm");
  if (state.completedLessons.includes("g9_b05")) badges.push("Quang học cơ bản");
  if (state.completedLessons.length >= 3) badges.push("Nhịp học đều");
  if (state.streak >= 7) badges.push("7 ngày liên tiếp");
  if (state.answers.filter((answer) => answer.correct).length >= 10) badges.push("Mười câu chắc tay");

  return {
    level,
    currentLevelXp,
    nextLevelXp: 120,
    badges
  };
}

export function xpForAnswer(correct) {
  return correct ? 10 : 0;
}
