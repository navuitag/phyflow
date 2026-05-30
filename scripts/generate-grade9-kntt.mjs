import { readFile, writeFile } from "node:fs/promises";

/** SGK KHTN 9 – Kết nối tri thức (mạch Vật lí: Bài 2–17, Chương I–V) */
const lessons = [
  ["g9_b02", "Bài 2. Động năng. Thế năng", "Năng lượng cơ học", 1, 2, "Động năng Wđ = ½mv²; thế năng Wt = mgh (g ≈ 10 N/kg).", "kineticEnergy"],
  ["g9_b03", "Bài 3. Cơ năng", "Năng lượng cơ học", 1, 3, "Cơ năng = động năng + thế năng; bảo toàn cơ năng (không ma sát).", "mechanicalEnergy"],
  ["g9_b04", "Bài 4. Công và công suất", "Năng lượng cơ học", 1, 4, "Công A = F·s; công suất P = A/t; đơn vị J và W.", "workPower"],
  ["g9_b05", "Bài 5. Khúc xạ ánh sáng", "Ánh sáng", 2, 5, "Ánh sáng đổi hướng qua mặt phân cách hai môi trường.", "refraction"],
  ["g9_b06", "Bài 6. Phản xạ toàn phần", "Ánh sáng", 2, 6, "Góc tới lớn → khúc xạ 90° → phản xạ toàn phần.", "totalReflection"],
  ["g9_b07", "Bài 7. Lăng kính", "Ánh sáng", 2, 7, "Lăng kính tách sáng trắng thành quang phổ; khúc xạ qua mặt nghiêng.", "prism"],
  ["g9_b08", "Bài 8. Thấu kính", "Ánh sáng", 2, 8, "Thấu kính hội tụ và phân kỳ; tiêu điểm F, tiêu cự f.", "lens"],
  ["g9_b09", "Bài 9. Thực hành đo tiêu cự thấu kính hội tụ", "Ánh sáng", 2, 9, "Phương pháp vật xa/vật gần hoặc bài B để tính f.", "focalLength"],
  ["g9_b10", "Bài 10. Kính lúp. Bài tập thấu kính", "Ánh sáng", 2, 10, "Kính lúp là thấu kính hội tụ; ảnh ảo phóng đại khi vật trong tiêu cự.", "magnifierLens"],
  ["g9_b11", "Bài 11. Điện trở. Định luật Ohm", "Điện", 3, 11, "I = U/R; đơn vị Ω, V, A.", "ohm"],
  ["g9_b12", "Bài 12. Đoạn mạch nối tiếp, song song", "Điện", 3, 12, "Nối tiếp: Rt = R1+R2, cùng I. Song song: 1/Rt = 1/R1+1/R2, cùng U.", "circuitMixed"],
  ["g9_b13", "Bài 13. Năng lượng của dòng điện và công suất điện", "Điện", 3, 13, "P = U·I; điện năng W = P·t; kW·h.", "power"],
  ["g9_b14", "Bài 14. Cảm ứng điện từ. Nguyên tắc tạo dòng điện xoay chiều", "Điện từ", 4, 14, "Nam châm và cuộn dây chuyển động tương đối → dòng cảm ứng.", "induction"],
  ["g9_b15", "Bài 15. Tác dụng của dòng điện xoay chiều", "Điện từ", 4, 15, "Dòng xoay chiều đổi chiều theo chu kì; máy phát, truyền tải điện.", "acCurrent"],
  ["g9_b16", "Bài 16. Vòng năng lượng trên Trái Đất. Năng lượng hóa thạch", "Năng lượng với cuộc sống", 5, 16, "Năng lượng Mặt Trời → sinh vật → hóa thạch; chu trình carbon.", "energyCycle"],
  ["g9_b17", "Bài 17. Một số dạng năng lượng tái tạo", "Năng lượng với cuộc sống", 5, 17, "Mặt trời, gió, thủy điện, sinh khối; giảm phát thải CO₂.", "renewable"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 9 – Kết nối tri thức với cuộc sống (mạch Vật lí), nội dung tự biên soạn.";
const SIMULATION_SKILL = "g9_b11";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  const domainMap = {
    1: "Cơ năng",
    2: "Quang học",
    3: "Điện học",
    4: "Điện từ",
    5: "Năng lượng"
  };
  const skill = {
    id,
    title,
    grade: 9,
    book: "Kết nối tri thức",
    chapter,
    chapterIndex,
    lessonNo,
    domain: domainMap[chapterIndex] || chapter,
    level: chapterIndex <= 1 ? 1 : chapterIndex <= 3 ? 2 : 3,
    prerequisite: index === 0 ? [] : [lessons[index - 1][0]],
    description,
    visualization
  };
  if (id === SIMULATION_SKILL) {
    skill.hasSimulation = true;
    skill.simulation = "ohm";
  }
  return skill;
}

const core = {
  g9_b02: ["Động năng và thế năng", "Wđ = ½mv² · Wt = mgh.", "Vật rơi: thế năng giảm, động năng tăng.", "Đơn vị năng lượng: J (Joule)."],
  g9_b03: ["Bảo toàn cơ năng", "Wc = Wđ + Wt; không ma sát thì Wc không đổi.", "Con lắc lý tưởng: điểm cao nhất Wđ=0, điểm thấp nhất Wt=0.", "Ma sát → cơ năng giảm thành nhiệt."],
  g9_b04: ["Công và công suất", "A = F·s (J) · P = A/t (W).", "Nâng vật 10 N lên 2 m: A = 20 J.", "1 kW = 1000 W."],
  g9_b05: ["Khúc xạ", "Tia tới, tia khúc xạ, pháp tuyến; n₁sin i = n₂sin r.", "Que trong nước trông gãy do khúc xạ.", "Từ không khí vào nước: hướng về pháp tuyến."],
  g9_b06: ["Phản xạ toàn phần", "Khi góc tới > góc tới hạn → phản xạ toàn phần.", "Sợi quang truyền nhờ phản xạ toàn phần.", "Góc tới hạn phụ thuộc n₁, n₂."],
  g9_b07: ["Lăng kính", "Khúc xạ qua lăng kính tách sáng trắng.", "Cầu vồng: khúc xạ và phản xạ trong giọt nước.", "Chiết suất khác nhau → tia lệch khác nhau."],
  g9_b08: ["Thấu kính", "Hội tụ: dày giữa; phân kỳ: mỏng giữa; F là tiêu điểm.", "Kính đeo cận là thấu kính hội tụ.", "Tiêu cự f đo bằng mét (m)."],
  g9_b09: ["Đo tiêu cự", "Vật xa: 1/f ≈ 1/s + 1/s′; hoặc dùng bài B.", "Thấu kính hội tụ f > 0; phân kỳ f < 0.", "Đo nhiều lần, lấy trung bình."],
  g9_b10: ["Kính lúp", "Kính lúp = thấu kính hội tụ; vật trong tiêu cự → ảnh ảo phóng đại.", "Độ phóng đại G ≈ khoảng cách mắt / f.", "Dùng quan sát chi tiết nhỏ."],
  g9_b11: ["Định luật Ohm", "I = U/R · U(V), I(A), R(Ω).", "U = 12 V, R = 4 Ω → I = 3 A.", "Điện trở cản dòng điện."],
  g9_b12: ["Mạch hỗn hợp", "Nối tiếp: Rt = R1+R2. Song song: 1/Rt = 1/R1+1/R2.", "R1=2Ω, R2=3Ω nối tiếp → Rt=5Ω.", "Song song: cùng U, dòng nhánh cộng lại."],
  g9_b13: ["Công suất điện", "P = U·I · W = P·t · 1 kW·h = 3,6·10⁶ J.", "Bóng 60 W bật 2 h → W = 0,12 kW·h.", "Tiết kiệm điện giảm chi phí."],
  g9_b14: ["Cảm ứng điện từ", "Cuộn dây và nam châm chuyển động tương đối → dòng cảm ứng.", "Máy phát điện: quay cuộn dây trong từ trường.", "Nguyên tắc máy biến áp."],
  g9_b15: ["Dòng xoay chiều", "Dòng đổi chiều theo thời gian; tần số 50 Hz (Việt Nam).", "Động cơ điện, bếp từ dùng dòng xoay chiều.", "Khác dòng một chiều từ pin."],
  g9_b16: ["Vòng năng lượng", "Năng lượng Mặt Trời → quang hợp → hóa thạch sau hàng triệu năm.", "Than, dầu là năng lượng hóa thạch.", "Đốt hóa thạch tạo CO₂."],
  g9_b17: ["Năng lượng tái tạo", "Mặt trời, gió, thủy điện, sinh khối tái tạo nhanh.", "Pin mặt trời giảm phụ thuộc hóa thạch.", "Bảo vệ môi trường và bền vững."]
};

function lessonSteps(item) {
  const [id, , , , , description, visualization] = item;
  const [visualTitle, visualContent, example, summary] = core[id];
  const isSim = id === SIMULATION_SKILL;
  return [
    { type: "intro", title: "Mục tiêu vi kỹ năng", content: description },
    {
      type: isSim ? "simulation" : "visualization",
      title: isSim ? "Mô phỏng trực quan" : visualTitle,
      content: isSim
        ? "Kéo thanh trượt U và R để quan sát dòng điện thay đổi theo Định luật Ohm."
        : visualContent,
      visualization,
      ...(isSim ? { simulation: "ohm", voltage: 12, resistance: 6 } : {})
    },
    { type: "example", title: "Ví dụ từ SGK", content: example },
    { type: "summary", title: "Ghi nhớ nhanh", content: summary }
  ];
}

const q = {
  g9_b02: [
    ["multiple_choice", "Công thức động năng là?", ["Wđ = ½mv²", "Wđ = mv", "Wđ = mgh", "Wđ = F/s"], "Wđ = ½mv²", "Phụ thuộc m và v."],
    ["multiple_choice", "Công thức thế năng (g ≈ 10 N/kg) là?", ["Wt = mgh", "Wt = ½mv²", "Wt = m/g", "Wt = F·s"], "Wt = mgh", "Phụ thuộc độ cao h."],
    ["multiple_choice", "Đơn vị năng lượng trong SI là?", ["Joule (J)", "Newton (N)", "Watt (W)", "Pascal (Pa)"], "Joule (J)", "1 J = 1 N·m."]
  ],
  g9_b03: [
    ["multiple_choice", "Cơ năng bằng?", ["Động năng + thế năng", "Chỉ động năng", "Chỉ thế năng", "m·g"], "Động năng + thế năng", "Wc = Wđ + Wt."],
    ["multiple_choice", "Không ma sát thì cơ năng?", ["Bảo toàn", "Luôn bằng 0", "Tăng vô hạn", "Không xác định"], "Bảo toàn", "Chỉ chuyển đổi giữa Wđ và Wt."],
    ["multiple_choice", "Vật rơi tự do (bỏ qua ma sát): thế năng giảm thì động năng?", ["Tăng tương ứng", "Giảm", "Không đổi", "Bằng 0"], "Tăng tương ứng", "Bảo toàn cơ năng."]
  ],
  g9_b04: [
    ["multiple_choice", "Công thực hiện A = ?", ["F·s", "F/s", "F + s", "m·g"], "F·s", "Lực nhân quãng đường theo phương lực."],
    ["multiple_choice", "Công suất P = ?", ["A/t", "A×t", "F/s", "m·v"], "A/t", "Công chia thời gian."],
    ["input", "Nâng vật 50 N lên 3 m. A = ? J (chỉ số).", "150", "A = F·s = 50×3."]
  ],
  g9_b05: [
    ["multiple_choice", "Khúc xạ xảy ra khi?", ["Ánh sáng qua mặt phân cách hai môi trường", "Chỉ trong chân không", "Không có ánh sáng", "Chỉ ban đêm"], "Ánh sáng qua mặt phân cách hai môi trường", "Đổi hướng tia."],
    ["multiple_choice", "Từ không khí vào nước, tia khúc xạ?", ["Hướng về pháp tuyến", "Ra xa pháp tuyến hơn tia tới", "Không đổi hướng", "Dừng lại"], "Hướng về pháp tuyến", "n_nước > n_không khí."],
    ["multiple_choice", "Que trong nước trông gãy do?", ["Khúc xạ ánh sáng", "Phản xạ toàn phần", "Chỉ phản xạ thường", "Từ trường"], "Khúc xạ ánh sáng", "Mắt nhận tia khúc xạ."]
  ],
  g9_b06: [
    ["multiple_choice", "Phản xạ toàn phần xảy ra khi?", ["Góc tới lớn hơn góc tới hạn", "Góc tới bằng 0", "Không có môi trường", "Chỉ với âm thanh"], "Góc tới lớn hơn góc tới hạn", "Không có tia khúc xạ."],
    ["multiple_choice", "Sợi quang truyền sáng nhờ?", ["Phản xạ toàn phần", "Chỉ khúc xạ", "Chỉ hấp thụ", "Dòng điện"], "Phản xạ toàn phần", "Ánh sáng giữ trong sợi."],
    ["multiple_choice", "Phản xạ toàn phần khác phản xạ thường ở?", ["Góc tới lớn, trong môi trường chiết suất cao hơn", "Mọi góc", "Chỉ góc 0", "Chỉ trong nước"], "Góc tới lớn, trong môi trường chiết suất cao hơn", "Điều kiện góc tới hạn."]
  ],
  g9_b07: [
    ["multiple_choice", "Lăng kính tách sáng trắng thành?", ["Quang phổ màu", "Chỉ một màu", "Chỉ hồng ngoại", "Không tách"], "Quang phổ màu", "Chiết suất theo màu."],
    ["multiple_choice", "Cầu vồng hình thành do?", ["Khúc xạ và phản xạ trong giọt nước", "Chỉ phản xạ toàn phần", "Chỉ từ trường", "Chỉ dòng điện"], "Khúc xạ và phản xạ trong giọt nước", "Tách sắc màu."],
    ["multiple_choice", "Trong lăng kính, tia sáng?", ["Khúc xạ qua các mặt nghiêng", "Không đổi hướng", "Chỉ phản xạ", "Dừng ngay"], "Khúc xạ qua các mặt nghiêng", "Mặt nghiêng gây lệch."]
  ],
  g9_b08: [
    ["multiple_choice", "Thấu kính hội tụ có hình?", ["Dày ở giữa", "Mỏng ở giữa", "Phẳng", "Không khúc xạ"], "Dày ở giữa", "Hội tụ tia song song về F."],
    ["multiple_choice", "Tiêu cự f là?", ["Khoảng cách từ quang tâm đến tiêu điểm", "Đường kính thấu kính", "Chiều dài vật", "Công suất điện"], "Khoảng cách từ quang tâm đến tiêu điểm", "f đo bằng m."],
    ["multiple_choice", "Thấu kính phân kỳ làm tia song song?", ["Phân kỳ ra xa trục", "Hội tụ về F", "Dừng lại", "Phản xạ toàn phần"], "Phân kỳ ra xa trục", "Tiêu điểm ảo."]
  ],
  g9_b09: [
    ["multiple_choice", "Đo tiêu cự thấu kính hội tụ có thể dùng?", ["Phương pháp vật xa hoặc bài B", "Chỉ cân khối lượng", "Chỉ nhiệt kế", "Chỉ ampe kế"], "Phương pháp vật xa hoặc bài B", "Thực hành SGK."],
    ["multiple_choice", "Thấu kính hội tụ có tiêu cự f?", ["> 0", "< 0", "= 0 luôn", "Không có"], "> 0", "Quy ước f hội tụ dương."],
    ["multiple_choice", "Giảm sai số khi đo f nên?", ["Đo nhiều lần, lấy trung bình", "Chỉ đo một lần", "Không cần ghi đơn vị", "Dùng thước đo lực"], "Đo nhiều lần, lấy trung bình", "Phương pháp khoa học."]
  ],
  g9_b10: [
    ["multiple_choice", "Kính lúp là?", ["Thấu kính hội tụ", "Thấu kính phân kỳ", "Gương cầu", "Lăng kính"], "Thấu kính hội tụ", "Ứng dụng quang học."],
    ["multiple_choice", "Vật đặt trong tiêu cự f → ảnh?", ["Ảo, phóng đại", "Thật, thu nhỏ", "Không có ảnh", "Chỉ tối"], "Ảo, phóng đại", "Quan sát kính lúp."],
    ["multiple_choice", "f càng nhỏ thì độ phóng đại?", ["Càng lớn (cùng khoảng cách mắt)", "Càng nhỏ", "Không đổi", "Bằng 0"], "Càng lớn (cùng khoảng cách mắt)", "G ≈ L/f."]
  ],
  g9_b11: [
    ["multiple_choice", "Định luật Ohm viết đúng là?", ["I = U/R", "I = R/U", "I = U×R", "U = I/R"], "I = U/R", "I tỉ lệ U, nghịch R."],
    ["input", "U = 12 V, R = 4 Ω. I = ? A (chỉ số).", "3", "I = U/R = 12/4."],
    ["multiple_choice", "Đơn vị điện trở là?", ["Ohm (Ω)", "Volt (V)", "Ampere (A)", "Watt (W)"], "Ohm (Ω)", "Ω đọc là ohm."]
  ],
  g9_b12: [
    ["multiple_choice", "R1=2Ω, R2=3Ω nối tiếp. Rt = ?", ["5", "1.2", "6", "0.5"], "5", "Rt = R1 + R2."],
    ["multiple_choice", "Hai điện trở song song có đặc điểm?", ["Cùng điện áp U", "Cùng dòng I trên mọi nhánh", "Rt = R1 + R2", "Không có U"], "Cùng điện áp U", "Song song: U bằng nhau."],
    ["input", "R1=4Ω, R2=4Ω song song. Rt = ? Ω (chỉ số).", "2", "1/Rt = 1/4 + 1/4."]
  ],
  g9_b13: [
    ["multiple_choice", "Công thức công suất điện?", ["P = U·I", "P = U/I", "P = I/R", "P = R/U"], "P = U·I", "P đo bằng W."],
    ["multiple_choice", "1 kW·h bằng bao nhiêu J?", ["3,6·10⁶", "1000", "360", "3,6"], "3,6·10⁶", "Đơn vị điện năng tiêu thụ."],
    ["multiple_choice", "Điện năng W = ?", ["P·t", "P/t", "U/R", "I²·R luôn sai"], "P·t", "Công suất nhân thời gian."]
  ],
  g9_b14: [
    ["multiple_choice", "Cảm ứng điện từ xảy ra khi?", ["Cuộn dây và từ trường chuyển động tương đối", "Vật đứng yên tuyệt đối", "Không có nam châm", "Chỉ có ánh sáng"], "Cuộn dây và từ trường chuyển động tương đối", "Faraday."],
    ["multiple_choice", "Máy phát điện dựa trên?", ["Cảm ứng điện từ", "Chỉ nhiễm điện", "Chỉ khúc xạ", "Chỉ Archimedes"], "Cảm ứng điện từ", "Quay cuộn dây trong từ trường."],
    ["multiple_choice", "Dòng cảm ứng là?", ["Dòng do thay đổi từ thông", "Dòng từ pin vĩnh viễn", "Chỉ dòng một chiều tĩnh", "Không có trong cuộn dây"], "Dòng do thay đổi từ thông", "Nguyên lý biến áp."]
  ],
  g9_b15: [
    ["multiple_choice", "Dòng điện xoay chiều?", ["Đổi chiều theo thời gian", "Luôn một chiều", "Không đổi cường độ", "Chỉ trong pin"], "Đổi chiều theo thời gian", "AC vs DC."],
    ["multiple_choice", "Tần số dòng điện sinh ở Việt Nam?", ["50 Hz", "60 Hz", "100 Hz", "1 Hz"], "50 Hz", "50 chu kì/giây."],
    ["multiple_choice", "Pin cung cấp dòng?", ["Một chiều (DC)", "Xoay chiều (AC)", "Không có dòng", "Chỉ xoay chiều 50 Hz"], "Một chiều (DC)", "Pin vs máy phát."]
  ],
  g9_b16: [
    ["multiple_choice", "Than, dầu mỏ là?", ["Năng lượng hóa thạch", "Năng lượng tái tạo", "Chỉ quang năng trực tiếp", "Không chứa năng lượng"], "Năng lượng hóa thạch", "Hình thành hàng triệu năm."],
    ["multiple_choice", "Nguồn gốc năng lượng hóa thạch?", ["Sinh vật cổ qua quang hợp", "Chỉ từ Mặt Trăng", "Chỉ từ sét", "Không từ sinh vật"], "Sinh vật cổ qua quang hợp", "Vòng năng lượng Trái Đất."],
    ["multiple_choice", "Đốt hóa thạch tạo ra chủ yếu?", ["CO₂ và nhiệt", "Chỉ oxy", "Chỉ nước tinh khiết", "Không khí thuần"], "CO₂ và nhiệt", "Ảnh hưởng khí hậu."]
  ],
  g9_b17: [
    ["multiple_choice", "Nguồn năng lượng tái tạo là?", ["Năng lượng mặt trời", "Than đá", "Dầu mỏ", "Khí thiên nhiên hóa thạch"], "Năng lượng mặt trời", "Tái tạo liên tục."],
    ["multiple_choice", "Thủy điện dùng?", ["Động năng nước chảy", "Chỉ hóa năng pin", "Chỉ ma sát", "Chỉ từ trường tĩnh"], "Động năng nước chảy", "Tuabin quay phát điện."],
    ["multiple_choice", "Dùng năng lượng tái tạo giúp?", ["Giảm phát thải CO₂", "Tăng hóa thạch", "Lãng phí tài nguyên", "Không ảnh hưởng môi trường"], "Giảm phát thải CO₂", "Bền vững."]
  ]
};

const errors = [
  ["g9_b02", "mgh", "concept_error", "Nhầm động và thế năng", "Wđ = ½mv²; Wt = mgh.", "Xem vật đang chuyển động hay ở độ cao."],
  ["g9_b03", "mat", "concept_error", "Cơ năng mất hoàn toàn", "Không ma sát: cơ năng bảo toàn, chỉ đổi dạng.", "Ma sát → nhiệt."],
  ["g9_b04", "f/s", "formula_error", "Sai công thức công", "A = F·s, không phải F/s.", "Công = lực × quãng đường."],
  ["g9_b11", "u/i", "formula_error", "Sai Định luật Ohm", "I = U/R, không phải U/I.", "I tỉ lệ U, nghịch R."],
  ["g9_b11", "48", "logic_error", "Nhân thay vì chia", "I = U/R = 12/4 = 3 A.", "Chia U cho R."],
  ["g9_b12", "r1+r2", "concept_error", "Nhầm nối tiếp và song song", "R1+R2 chỉ đúng nối tiếp.", "Song song: 1/Rt = 1/R1 + 1/R2."],
  ["g9_b13", "p=u/i", "formula_error", "Sai công thức công suất", "P = U·I, không phải U/I.", "P đo bằng W."],
  ["g9_b05", "phan xa", "concept_error", "Nhầm khúc xạ và phản xạ", "Que gãy trong nước là khúc xạ.", "Phản xạ: góc tới = góc phản xạ."],
  ["g9_b08", "mo giua", "concept_error", "Nhầm hội tụ và phân kỳ", "Hội tụ dày giữa; phân kỳ mỏng giữa.", "Nhìn hình thấu kính."],
  ["g9_b14", "nhiem dien", "concept_error", "Nhầm cảm ứng và nhiễm điện", "Cảm ứng cần chuyển động tương đối.", "Máy phát dùng cảm ứng."],
  ["g9_b16", "tai tao", "concept_error", "Nhầm hóa thạch và tái tạo", "Than dầu là hóa thạch, không tái tạo nhanh.", "Mặt trời, gió là tái tạo."]
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

const grade9Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade9Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade9Questions = lessons.flatMap(questionObjects);
const grade9Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
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

const lower = skillsFile.filter((s) => s.grade < 9);
const lowerLessons = lessonsFile.filter((l) => lower.some((s) => s.id === l.skill));
const lowerQuestions = questionsFile.filter((qItem) => lower.some((s) => s.id === qItem.skill));
const keepErrors = errorsFile.filter((e) => lower.some((s) => s.id === e.skill));

const skills = [...lower, ...grade9Skills];
const lessonData = [...lowerLessons, ...grade9Lessons];
const questions = [...lowerQuestions, ...grade9Questions];
const allErrors = [...keepErrors, ...grade9Errors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 9 Vật lí KNTT: ${grade9Skills.length} skills, ${grade9Questions.length} questions, ${grade9Errors.length} error patterns.`);
console.log(`Total app: ${skills.length} skills, ${questions.length} questions.`);
