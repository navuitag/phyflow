import { readFile, writeFile } from "node:fs/promises";

/** SGK KHTN 7 – Kết nối tri thức (mạch Vật lí: Bài 8–20, Chương III–VI) */
const lessons = [
  ["g7_b08", "Bài 8. Tốc độ chuyển động", "Tốc độ", 3, 8, "Khái niệm tốc độ v = s/t; đơn vị m/s, km/h.", "velocity"],
  ["g7_b09", "Bài 9. Đo tốc độ", "Tốc độ", 3, 9, "Đo quãng đường và thời gian để tính tốc độ trong thí nghiệm.", "measureSpeed"],
  ["g7_b10", "Bài 10. Đồ thị quãng đường – thời gian", "Tốc độ", 3, 10, "Đọc và vẽ đồ thị s–t; nhận biết chuyển động đều.", "stGraph"],
  ["g7_b11", "Bài 11. Ảnh hưởng của tốc độ trong an toàn giao thông", "Tốc độ", 3, 11, "Tốc độ cao tăng quãng đường phanh; tuân thủ luật giao thông.", "traffic"],
  ["g7_b12", "Bài 12. Sóng âm", "Âm thanh", 4, 12, "Sóng âm lan truyền qua môi trường elastic; tần số và bước sóng.", "sound"],
  ["g7_b13", "Bài 13. Độ to và độ cao của âm", "Âm thanh", 4, 13, "Biên độ → độ to; tần số → độ cao (cao/trầm).", "soundPitch"],
  ["g7_b14", "Bài 14. Phản xạ âm, chống ô nhiễm tiếng ồn", "Âm thanh", 4, 14, "Tiếng vọng, phản xạ âm; giảm tiếng ồn trong đời sống.", "echo"],
  ["g7_b15", "Bài 15. Năng lượng ánh sáng. Tia sáng, vùng tối", "Ánh sáng", 5, 15, "Ánh sáng mang quang năng; tia sáng thẳng; bóng tối và bóng đổ.", "lightRay"],
  ["g7_b16", "Bài 16. Sự phản xạ ánh sáng", "Ánh sáng", 5, 16, "Định luật phản xạ: góc tới bằng góc phản xạ (so với pháp tuyến).", "light"],
  ["g7_b17", "Bài 17. Ảnh của vật qua gương phẳng", "Ánh sáng", 5, 17, "Ảnh ảo, cùng kích thước, đối xứng qua gương phẳng.", "mirror"],
  ["g7_b18", "Bài 18. Nam châm", "Từ", 6, 18, "Nam châm có hai cực N, S; tương tác hút/đẩy.", "magnet"],
  ["g7_b19", "Bài 19. Từ trường", "Từ", 6, 19, "Từ trường quanh nam châm; đường sức từ N ra S (ngoài không gian).", "magneticField"],
  ["g7_b20", "Bài 20. Chế tạo nam châm điện đơn giản", "Từ", 6, 20, "Dòng điện trong cuộn dây tạo từ trường; nam châm điện.", "electromagnet"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 7 – Kết nối tri thức với cuộc sống (mạch Vật lí), nội dung tự biên soạn.";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  const domainMap = { 3: "Cơ học", 4: "Âm học", 5: "Quang học", 6: "Từ học" };
  return {
    id,
    title,
    grade: 7,
    book: "Kết nối tri thức",
    chapter,
    chapterIndex,
    lessonNo,
    domain: domainMap[chapterIndex] || chapter,
    level: chapterIndex <= 3 ? 1 : chapterIndex <= 5 ? 2 : 3,
    prerequisite: index === 0 ? [] : [lessons[index - 1][0]],
    description,
    visualization
  };
}

const core = {
  g7_b08: ["Tốc độ", "Tốc độ v = s/t · v: m/s hoặc km/h.", "Xe đi 120 km trong 2 h → v = 60 km/h.", "Chuyển động nhanh → tốc độ lớn."],
  g7_b09: ["Đo tốc độ", "Đo s (m) và t (s), thay vào v = s/t.", "Bóng lăn 5 m trong 2 s → v = 2,5 m/s.", "Lặp đo nhiều lần, lấy trung bình giảm sai số."],
  g7_b10: ["Đồ thị s–t", "Trục hoành: t (s), trục tung: s (m). Đường thẳng đi qua gốc → chuyển động đều.", "Độ dốc đồ thị = tốc độ v.", "Đọc s tại t = 4 s trên đồ thị."],
  g7_b11: ["An toàn giao thông", "Tốc độ cao → quãng đường phanh dài → nguy hiểm.", "Đội mũ bảo hiểm, đi đúng làn, tuân thủ tốc độ.", "Không vượt quá tốc độ cho phép."],
  g7_b12: ["Sóng âm", "Âm là dao động lan truyền qua không khí, nước, vật rắn.", "Gõ trống → không khí rung → tai nghe thấy.", "Không truyền trong chân không."],
  g7_b13: ["Độ to và độ cao", "Biên độ lớn → âm to; tần số cao → âm cao (trầm thấp).", "Trống lớn gõ mạnh → to; sáo ngắn → cao.", "Đơn vị tần số: Hz."],
  g7_b14: ["Phản xạ âm", "Tiếng vọng: âm phản xạ từ vách, tường, núi.", "Dùng tiếng vọng đo độ sâu biển (sonar).", "Giảm ồn: cách âm, cây xanh, quy định giờ yên lặng."],
  g7_b15: ["Tia sáng và bóng", "Tia sáng đi thẳng; nguồn sáng hẹp → bóng tối sắc nét.", "Che nguồn sáng → vùng tối phía sau vật cản.", "Ánh sáng là dạng năng lượng."],
  g7_b16: ["Phản xạ ánh sáng", "Góc tới i = góc phản xạ i′ (đo so với pháp tuyến).", "Soi gương thấy ảnh nhờ phản xạ.", "Mặt nhẵn phản xạ tốt."],
  g7_b17: ["Ảnh trong gương", "Ảnh ảo, cùng kích thước vật, đối xứng qua mặt gương.", "Đứng trước gương: khoảng cách ảnh = khoảng cách vật.", "Ảnh không thể đặt màn hứng."],
  g7_b18: ["Nam châm", "Hút sắt, nikel, coban; cực N–S hút nhau, N–N hoặc S–S đẩy nhau.", "Nam châm thước kẻ chỉ hướng Bắc–Nam.", "Không tách hai cực riêng lẻ."],
  g7_b19: ["Từ trường", "Vùng quanh nam châm có từ trường; kim la bàn lệch.", "Đường sức từ: N → S (ngoài nam châm).", "Từ trường vô hình, tác dụng lên nam châm nhỏ."],
  g7_b20: ["Nam châm điện", "Cuộn dây có dòng điện → từ trường; lõi sắt mạnh hơn.", "Cuộn dây quanh đinh thép, đóng mạch → hút pin.", "Tắt dòng → mất từ tính (nam châm điện)."]
};

function lessonSteps(item) {
  const [id, , , , , description, visualization] = item;
  const [visualTitle, visualContent, example, summary] = core[id];
  return [
    { type: "intro", title: "Mục tiêu vi kỹ năng", content: description },
    { type: "visualization", title: visualTitle, content: visualContent, visualization },
    { type: "example", title: "Ví dụ từ SGK", content: example },
    { type: "summary", title: "Ghi nhớ nhanh", content: summary }
  ];
}

const q = {
  g7_b08: [
    ["multiple_choice", "Công thức tốc độ đúng là?", ["v = s/t", "v = t/s", "v = s×t", "v = s + t"], "v = s/t", "Tốc độ = quãng đường / thời gian."],
    ["multiple_choice", "Đơn vị tốc độ trong SI là?", ["m/s", "km", "N", "J"], "m/s", "m/s = mét/giây."],
    ["input", "Xe đi 100 km trong 2 h. Tốc độ = ? km/h (chỉ số).", "50", "v = s/t = 100/2."]
  ],
  g7_b09: [
    ["multiple_choice", "Đo tốc độ cần đo?", ["Quãng đường và thời gian", "Chỉ khối lượng", "Chỉ nhiệt độ", "Chỉ lực"], "Quãng đường và thời gian", "v = s/t."],
    ["input", "Vật đi 10 m trong 5 s. v = ? m/s (chỉ số).", "2", "v = 10/5 = 2 m/s."],
    ["multiple_choice", "Giảm sai số khi đo tốc độ nên?", ["Đo nhiều lần, lấy trung bình", "Chỉ đo một lần", "Không ghi đơn vị", "Đo bằng nhiệt kế"], "Đo nhiều lần, lấy trung bình", "Phương pháp khoa học."]
  ],
  g7_b10: [
    ["multiple_choice", "Đồ thị s–t, trục hoành thường biểu diễn?", ["Thời gian t", "Quãng đường s", "Tốc độ v", "Khối lượng m"], "Thời gian t", "t trên trục hoành."],
    ["multiple_choice", "Đường thẳng s–t đi qua gốc tọa độ cho thấy?", ["Chuyển động đều", "Vật đứng yên", "Chuyển động nhanh dần", "Không có chuyển động"], "Chuyển động đều", "s tỉ lệ t."],
    ["multiple_choice", "Độ dốc đồ thị s–t bằng?", ["Tốc độ v", "Khối lượng", "Lực F", "Nhiệt độ"], "Tốc độ v", "v = Δs/Δt."]
  ],
  g7_b11: [
    ["multiple_choice", "Tốc độ xe cao thì quãng đường phanh thường?", ["Dài hơn", "Ngắn hơn", "Không đổi", "Bằng 0"], "Dài hơn", "Nguy hiểm khi phanh gấp."],
    ["multiple_choice", "Biện pháp an toàn giao thông?", ["Đội mũ bảo hiểm, tuân thủ tốc độ", "Chạy nhanh nhất có thể", "Không dùng đèn xe", "Vượt đèn đỏ"], "Đội mũ bảo hiểm, tuân thủ tốc độ", "Bảo vệ bản thân và người khác."],
    ["multiple_choice", "Tốc độ cho phép trên đường là để?", ["Giảm tai nạn", "Tăng tai nạn", "Chỉ trang trí biển", "Không có mục đích"], "Giảm tai nạn", "Luật giao thông bảo vệ an toàn."]
  ],
  g7_b12: [
    ["multiple_choice", "Sóng âm truyền qua?", ["Không khí, nước, vật rắn", "Chân không", "Chỉ trong chân không", "Không qua môi trường"], "Không khí, nước, vật rắn", "Cần môi trường elastic."],
    ["multiple_choice", "Đơn vị tần số sóng âm là?", ["Hz (hertz)", "m/s", "N", "Pa"], "Hz (hertz)", "Hz = số dao động/giây."],
    ["multiple_choice", "Trong chân không, tiếng nói?", ["Không truyền được", "To hơn bình thường", "Không đổi", "Chỉ truyền qua sắt"], "Không truyền được", "Không có môi trường mang sóng."]
  ],
  g7_b13: [
    ["multiple_choice", "Biên độ lớn thì âm?", ["To hơn", "Nhỏ hơn", "Cao hơn (trầm hơn)", "Im lặng"], "To hơn", "Biên độ → độ to."],
    ["multiple_choice", "Tần số cao thì âm?", ["Cao hơn (trầm thấp hơn nếu tần số thấp)", "Luôn trầm", "Không đổi", "Không nghe được"], "Cao hơn (trầm thấp hơn nếu tần số thấp)", "Tần số → độ cao."],
    ["multiple_choice", "Trống gõ mạnh so với gõ nhẹ?", ["To hơn", "Trầm hơn", "Cao hơn", "Không khác"], "To hơn", "Biên độ lớn hơn."]
  ],
  g7_b14: [
    ["multiple_choice", "Tiếng vọng là?", ["Âm phản xạ từ vách, tường", "Âm do nam châm", "Ánh sáng phản xạ", "Chỉ sóng điện từ"], "Âm phản xạ từ vách, tường", "Phản xạ âm."],
    ["multiple_choice", "Sonar dùng để?", ["Đo độ sâu biển bằng phản xạ âm", "Đo nhiệt độ", "Đo khối lượng", "Tạo ánh sáng"], "Đo độ sâu biển bằng phản xạ âm", "Gửi sóng âm, nhận vọng."],
    ["multiple_choice", "Giảm ô nhiễm tiếng ồn có thể?", ["Cách âm, trồng cây", "Bật loa to hơn", "Phá tường", "Không làm gì"], "Cách âm, trồng cây", "Hấp thụ và che chắn âm."]
  ],
  g7_b15: [
    ["multiple_choice", "Tia sáng đi theo?", ["Đường thẳng", "Đường cong ngẫu nhiên", "Chỉ đi vòng", "Không đi được"], "Đường thẳng", "Nguyên lí truyền thẳng."],
    ["multiple_choice", "Bóng tối hình thành khi?", ["Vật cản không cho ánh sáng qua", "Không có nguồn sáng", "Chỉ ban đêm", "Có gương phẳng"], "Vật cản không cho ánh sáng qua", "Vùng không nhận sáng."],
    ["multiple_choice", "Ánh sáng là dạng?", ["Năng lượng (quang năng)", "Chỉ khối lượng", "Chỉ lực", "Chỉ nhiệt độ"], "Năng lượng (quang năng)", "Mặt Trời cung cấp quang năng."]
  ],
  g7_b16: [
    ["multiple_choice", "Định luật phản xạ ánh sáng?", ["Góc tới bằng góc phản xạ", "Góc tới gấp đôi góc phản xạ", "Không có góc phản xạ", "Góc tùy ý"], "Góc tới bằng góc phản xạ", "Đo so với pháp tuyến."],
    ["multiple_choice", "Pháp tuyến là?", ["Đường vuông góc mặt phản xạ tại điểm tới", "Tia sáng tới", "Tia sáng phản xạ", "Mặt gương"], "Đường vuông góc mặt phản xạ tại điểm tới", "Chuẩn để đo góc."],
    ["multiple_choice", "Nhìn thấy vật qua gương nhờ?", ["Phản xạ ánh sáng", "Hấp thụ hết ánh sáng", "Khúc xạ trong gương", "Chỉ từ trường"], "Phản xạ ánh sáng", "Ánh sáng từ vật phản xạ vào mắt."]
  ],
  g7_b17: [
    ["multiple_choice", "Ảnh qua gương phẳng là ảnh?", ["Ảo", "Thật", "Lớn hơn vật", "Ngược chiều không đối xứng"], "Ảo", "Không hứng được trên màn."],
    ["multiple_choice", "Kích thước ảnh so với vật?", ["Bằng nhau", "Luôn nhỏ hơn", "Luôn lớn hơn", "Không xác định"], "Bằng nhau", "Gương phẳng."],
    ["multiple_choice", "Khoảng cách vật đến gương so với ảnh?", ["Bằng nhau", "Gấp đôi", "Bằng 0", "Không liên quan"], "Bằng nhau", "Đối xứng qua mặt gương."]
  ],
  g7_b18: [
    ["multiple_choice", "Nam châm hút được?", ["Sắt, nikel, coban", "Đồng, nhôm", "Gỗ, nhựa", "Muối ăn"], "Sắt, nikel, coban", "Một số kim loại."],
    ["multiple_choice", "Hai cực cùng loại (N–N) sẽ?", ["Đẩy nhau", "Hút nhau", "Không tác dụng", "Tan ra"], "Đẩy nhau", "Cực khác loại hút nhau."],
    ["multiple_choice", "Nam châm thước kẻ chỉ hướng?", ["Bắc–Nam", "Đông–Tây", "Lên trời", "Ngẫu nhiên"], "Bắc–Nam", "Trái Đất như nam châm lớn."]
  ],
  g7_b19: [
    ["multiple_choice", "Đường sức từ ngoài nam châm đi từ?", ["N ra S", "S ra N", "Chỉ trong nam châm", "Không xác định"], "N ra S", "Quy ước chiều đường sức từ."],
    ["multiple_choice", "Kim la bàn lệch vì?", ["Từ trường Trái Đất", "Gió", "Nhiệt độ", "Áp suất"], "Từ trường Trái Đất", "Kim hướng theo từ trường."],
    ["multiple_choice", "Từ trường tác dụng lên?", ["Nam châm, dây dẫn có dòng", "Chỉ gỗ", "Chỉ nước tinh khiết", "Chỉ không khí không dòng điện"], "Nam châm, dây dẫn có dòng", "Từ trường vô hình."]
  ],
  g7_b20: [
    ["multiple_choice", "Nam châm điện tạo bởi?", ["Cuộn dây có dòng điện", "Chỉ đá", "Chỉ nước", "Không cần dòng điện"], "Cuộn dây có dòng điện", "Dòng điện → từ trường."],
    ["multiple_choice", "Lõi sắt trong cuộn dây giúp?", ["Tăng cường từ trường", "Giảm từ trường", "Cách điện", "Tạo ánh sáng"], "Tăng cường từ trường", "Sắt dễ nhiễm từ."],
    ["multiple_choice", "Tắt dòng điện nam châm điện thường?", ["Mất từ tính (nếu lõi mềm)", "Mạnh hơn mãi", "Chuyển thành nam châm vĩnh cửu", "Phát sáng"], "Mất từ tính (nếu lõi mềm)", "Nam châm điện tạm thời."]
  ]
};

const errors = [
  ["g7_b08", "t/s", "formula_error", "Sai công thức tốc độ", "v = s/t, không phải t/s.", "Quãng đường chia thời gian."],
  ["g7_b08", "km", "unit_error", "Nhầm đơn vị", "m/s là SI; km/h cần đổi khi tính toán hỗn hợp.", "1 m/s = 3,6 km/h."],
  ["g7_b10", "s=t", "graph_error", "Nhầm trục đồ thị", "Trục hoành thường là t, trục tung là s.", "Đọc nhãn trục trước."],
  ["g7_b13", "tan so", "concept_error", "Nhầm độ to và độ cao", "Biên độ → to/nhỏ; tần số → cao/trầm.", "Gõ mạnh → biên độ lớn."],
  ["g7_b14", "phan xa anh sang", "concept_error", "Nhầm phản xạ âm và ánh sáng", "Tiếng vọng là phản xạ âm, không phải ánh sáng.", "Sonar dùng sóng âm."],
  ["g7_b16", "gap doi", "concept_error", "Sai định luật phản xạ", "Góc tới bằng góc phản xạ, không gấp đôi.", "Đo so với pháp tuyến."],
  ["g7_b17", "that", "concept_error", "Nhầm ảnh thật và ảo", "Gương phẳng cho ảnh ảo.", "Ảnh thật hứng được trên màn."],
  ["g7_b18", "dong", "concept_error", "Nhầm kim loại hút nam châm", "Đồng, nhôm không bị nam châm hút mạnh như sắt.", "Sắt, nikel, coban."],
  ["g7_b19", "s ra n", "concept_error", "Sai chiều đường sức từ", "Ngoài nam châm: N → S.", "Trong nam châm: S → N."],
  ["g7_b20", "vinh cuu", "concept_error", "Nhầm nam châm điện và vĩnh cửu", "Nam châm điện mất từ khi cắt dòng.", "Cần dòng điện liên tục."]
];

function questionObjects([id]) {
  return q[id].map((entry, index) => {
    const [type, question, choicesOrAnswer, answerOrHint, maybeHint] = entry;
    const isChoice = type === "multiple_choice";
    return {
      id: `q_${id}_${index + 1}`,
      skill: id,
      type,
      question,
      ...(isChoice ? { choices: choicesOrAnswer, answer: answerOrHint, hint: maybeHint } : { answer: choicesOrAnswer, hint: answerOrHint })
    };
  });
}

const grade7Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade7Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade7Questions = lessons.flatMap(questionObjects);
const grade7Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
  pattern,
  skill,
  errorType,
  title,
  message,
  hint,
  recommendation: skill
}));

const skillsFile = JSON.parse(await readFile("data/skills.json", "utf8"));
const lessonsFile = JSON.parse(await readFile("data/lessons.json", "utf8"));
const questionsFile = JSON.parse(await readFile("data/questions.json", "utf8"));
const errorsFile = JSON.parse(await readFile("data/errors.json", "utf8"));

const grade6 = skillsFile.filter((s) => s.grade === 6);
const upper = skillsFile.filter((s) => s.grade > 7);
const grade6Lessons = lessonsFile.filter((l) => grade6.some((s) => s.id === l.skill));
const upperLessons = lessonsFile.filter((l) => upper.some((s) => s.id === l.skill));
const grade6Questions = questionsFile.filter((qItem) => grade6.some((s) => s.id === qItem.skill));
const upperQuestions = questionsFile.filter((qItem) => upper.some((s) => s.id === qItem.skill));
const keepErrors = errorsFile.filter(
  (e) => grade6.some((s) => s.id === e.skill) || upper.some((s) => s.id === e.skill)
);

const skills = [...grade6, ...grade7Skills, ...upper];
const lessonData = [...grade6Lessons, ...grade7Lessons, ...upperLessons];
const questions = [...grade6Questions, ...grade7Questions, ...upperQuestions];
const allErrors = [...keepErrors, ...grade7Errors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 7 Vật lí KNTT: ${grade7Skills.length} skills, ${grade7Questions.length} questions, ${grade7Errors.length} error patterns.`);
console.log(`Total app: ${skills.length} skills, ${questions.length} questions.`);
