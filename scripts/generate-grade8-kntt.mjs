import { readFile, writeFile } from "node:fs/promises";

/** SGK KHTN 8 – Kết nối tri thức (mạch Vật lí: Bài 13–29, Chương III–VI) */
const lessons = [
  ["g8_b13", "Bài 13. Khối lượng riêng", "Khối lượng riêng và áp suất", 3, 13, "Khối lượng riêng D = m/V; đơn vị kg/m³, g/cm³.", "density"],
  ["g8_b14", "Bài 14. Thực hành xác định khối lượng riêng", "Khối lượng riêng và áp suất", 3, 14, "Đo khối lượng và thể tích vật rắn, tính D = m/V.", "densityLab"],
  ["g8_b15", "Bài 15. Áp suất trên một bề mặt", "Khối lượng riêng và áp suất", 3, 15, "Áp suất p = F/S; đơn vị Pa (N/m²).", "pressure"],
  ["g8_b16", "Bài 16. Áp suất chất lỏng. Áp suất khí quyển", "Khối lượng riêng và áp suất", 3, 16, "p = ρ·g·h; áp suất khí quyển ≈ 101 325 Pa.", "liquidPressure"],
  ["g8_b17", "Bài 17. Lực đẩy Archimedes", "Khối lượng riêng và áp suất", 3, 17, "F_A = ρ·g·V (vật chìm hoàn toàn); vật nổi khi ρ_vật < ρ_chất lỏng.", "archimedes"],
  ["g8_b18", "Bài 18. Tác dụng làm quay của lực. Moment lực", "Tác dụng làm quay của lực", 4, 18, "Moment lực M = F·d; đơn vị N·m.", "moment"],
  ["g8_b19", "Bài 19. Đòn bẩy và ứng dụng", "Tác dụng làm quay của lực", 4, 19, "Đòn bẩy cân bằng khi F₁·d₁ = F₂·d₂.", "lever"],
  ["g8_b20", "Bài 20. Hiện tượng nhiễm điện do cọ xát", "Điện", 5, 20, "Cọ xát làm vật mang điện tích; điện tích dương, âm.", "charge"],
  ["g8_b21", "Bài 21. Dòng điện, nguồn điện", "Điện", 5, 21, "Dòng điện là dòng điện tích có hướng; nguồn điện duy trì hiệu điện thế.", "currentSource"],
  ["g8_b22", "Bài 22. Mạch điện đơn giản", "Điện", 5, 22, "Mạch kín: nguồn, dây dẫn, tải; dòng chạy kín.", "circuit"],
  ["g8_b23", "Bài 23. Tác dụng của dòng điện", "Điện", 5, 23, "Dòng điện tỏa nhiệt, tác dụng từ, tác dụng quang (đèn).", "currentEffects"],
  ["g8_b24", "Bài 24. Cường độ dòng điện và hiệu điện thế", "Điện", 5, 24, "I đo bằng A; U đo bằng V; ampe kế mắc tiếp, vôn kế mắc song song.", "currentVoltage"],
  ["g8_b25", "Bài 25. Thực hành đo cường độ dòng điện và hiệu điện thế", "Điện", 5, 25, "Mắc ampe kế tiếp, vôn kế song song tải; đọc số liệu an toàn.", "measureIU"],
  ["g8_b26", "Bài 26. Năng lượng nhiệt và nội năng", "Nhiệt", 6, 26, "Nội năng phụ thuộc nhiệt độ; nhiệt lượng Q truyền làm đổi nội năng.", "thermalEnergy"],
  ["g8_b27", "Bài 27. Thực hành đo năng lượng nhiệt bằng joulemeter", "Nhiệt", 6, 27, "Joulemeter đo năng lượng điện chuyển thành nhiệt.", "joulemeter"],
  ["g8_b28", "Bài 28. Sự truyền nhiệt", "Nhiệt", 6, 28, "Dẫn nhiệt, đối lưu, bức xạ nhiệt.", "heatTransfer"],
  ["g8_b29", "Bài 29. Sự nở vì nhiệt", "Nhiệt", 6, 29, "Vật nở khi nóng lên: nở dài, nở thể tích.", "thermalExpansion"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 8 – Kết nối tri thức với cuộc sống (mạch Vật lí), nội dung tự biên soạn.";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  const domainMap = { 3: "Cơ học", 4: "Moment lực", 5: "Điện học", 6: "Nhiệt học" };
  return {
    id,
    title,
    grade: 8,
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
  g8_b13: ["Khối lượng riêng", "D = m/V · D đơn vị kg/m³ hoặc g/cm³.", "Nhôm D ≈ 2700 kg/m³; nước ≈ 1000 kg/m³.", "Vật cùng thể tích, D lớn → nặng hơn."],
  g8_b14: ["Xác định D", "Cân m, đo V (thước hoặc cách thủy), tính D = m/V.", "Khối lập phương cạnh 2 cm, m = 21,6 g → V = 8 cm³ → D = 2,7 g/cm³.", "Đổi đơn vị: 1 g/cm³ = 1000 kg/m³."],
  g8_b15: ["Áp suất", "p = F/S · F vuông góc mặt tiếp xúc.", "Giày rộng → S lớn → p nhỏ, lún ít hơn.", "Đơn vị Pa = N/m²."],
  g8_b16: ["Áp suất chất lỏng", "p = ρ·g·h; h sâu hơn → p lớn hơn.", "Đập nước sâu chịu áp suất lớn.", "Áp suất khí quyển ≈ 1 atm ≈ 101 kPa."],
  g8_b17: ["Archimedes", "F_A hướng lên, bằng trọng lượng phần chất lỏng bị vật chiếm chỗ.", "Thuyền gỗ nổi vì ρ_gỗ < ρ_nước.", "Vật chìm: P > F_A; nổi: P = F_A (cân bằng)."],
  g8_b18: ["Moment lực", "M = F·d (d là cánh tay đòn vuông góc lực).", "Mở cửa: đẩy xa bản lề → d lớn → dễ quay.", "Đơn vị N·m."],
  g8_b19: ["Đòn bẩy", "Cân bằng: F₁·d₁ = F₂·d₂.", "Kìm cắt: lực nhỏ ở tay cầm tạo lực lớn ở đầu cắt.", "Đòn bẩy lợi thế: tiết kiệm lực."],
  g8_b20: ["Nhiễm điện", "Cọ xát → electron chuyển → vật dư/thiếu electron.", "Thước nhựa cọ áo len → hút giấy nhẹ.", "Điện tích cùng loại đẩy, khác loại hút."],
  g8_b21: ["Dòng điện", "Dòng điện tích có hướng; trong kim loại chủ yếu electron.", "Pin cung cấp nguồn; dòng chạy từ + → − qua mạch ngoài.", "Không có nguồn → không có dòng lâu dài."],
  g8_b22: ["Mạch kín", "Mạch kín gồm nguồn, dây, tải (đèn, điện trở).", "Công tắc đóng → mạch kín → đèn sáng.", "Mạch hở → không có dòng."],
  g8_b23: ["Tác dụng dòng điện", "Tỏa nhiệt (bóng đèn), từ (nam châm điện), quang (LED).", "Dây điện quá tải → nóng → cháy.", "Không chạm tay ướt vào thiết bị điện."],
  g8_b24: ["I và U", "I (A): lượng điện tích qua mặt cắt/giây. U (V): hiệu thế giữa hai điểm.", "Ampe kế mắc tiếp; vôn kế mắc song song tải.", "1 A = 1 C/s."],
  g8_b25: ["Đo I, U", "Kiểm tra cực ampe kế (+ nối về + nguồn); vôn kế song song.", "Đo U pin ≈ 1,5 V; I bóng đèn nhỏ vài mA–A.", "Đóng mạch sau khi mắc đúng."],
  g8_b26: ["Nội năng", "Nội năng liên quan chuyển động hỗn loạn phân tử; nhiệt độ cao → nội năng lớn.", "Nước sôi: nội năng tăng, nhiệt độ không đổi (đang hóa hơi).", "Nhiệt lượng Q truyền vào → nội năng tăng (hoặc đổi thể)."],
  g8_b27: ["Joulemeter", "Đo năng lượng điện E = U·I·t chuyển thành nhiệt.", "Đun nước bằng điện trở: E càng lớn → nước nóng hơn.", "Đơn vị năng lượng: J (Joule)."],
  g8_b28: ["Truyền nhiệt", "Dẫn nhiệt (kim loại), đối lưu (chất lỏng/khí), bức xạ (Mặt Trời).", "Muỗng kim loại trong nồi nóng → dẫn nhiệt.", "Nhiệt từ vật nóng sang vật lạnh."],
  g8_b29: ["Nở vì nhiệt", "Vật nở dài, nở thể tích khi nóng lên.", "Khe hở trên cầu sắt cho nở nhiệt.", "Nở dài: Δl = l₀·α·Δt (α hệ số nở)."]
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
  g8_b13: [
    ["multiple_choice", "Công thức khối lượng riêng là?", ["D = m/V", "D = V/m", "D = m×V", "D = m + V"], "D = m/V", "Khối lượng chia thể tích."],
    ["multiple_choice", "Đơn vị khối lượng riêng trong SI là?", ["kg/m³", "N/m²", "J/kg", "A/m"], "kg/m³", "kg/m³ là đơn vị chuẩn."],
    ["input", "Vật 2 kg, V = 0,001 m³. D = ? kg/m³ (chỉ số).", "2000", "D = 2/0,001 = 2000."]
  ],
  g8_b14: [
    ["multiple_choice", "Xác định D cần đo?", ["m và V", "Chỉ nhiệt độ", "Chỉ lực", "Chỉ thời gian"], "m và V", "D = m/V."],
    ["multiple_choice", "1 g/cm³ bằng bao nhiêu kg/m³?", ["1000", "100", "10", "1"], "1000", "1 g/cm³ = 1000 kg/m³."],
    ["multiple_choice", "Khối lập phương cạnh a thì V = ?", ["a³", "3a", "a²", "6a²"], "a³", "Thể tích hình lập phương."]
  ],
  g8_b15: [
    ["multiple_choice", "Công thức áp suất là?", ["p = F/S", "p = F×S", "p = S/F", "p = F + S"], "p = F/S", "Lực chia diện tích."],
    ["multiple_choice", "Đơn vị áp suất Pa là?", ["N/m²", "N·m", "J/s", "kg/m³"], "N/m²", "1 Pa = 1 N/m²."],
    ["multiple_choice", "Giày rộng đế so với gót nhọn khi cùng trọng lượng người?", ["Áp suất nhỏ hơn", "Áp suất lớn hơn", "Không đổi", "Bằng 0"], "Áp suất nhỏ hơn", "S lớn → p nhỏ."]
  ],
  g8_b16: [
    ["multiple_choice", "Áp suất chất lỏng tăng khi?", ["h sâu hơn", "h nông hơn", "Không phụ thuộc h", "Chỉ phụ thuộc màu"], "h sâu hơn", "p = ρ·g·h."],
    ["multiple_choice", "Áp suất khí quyển xấp xỉ?", ["101 kPa", "1 Pa", "1000 MPa", "0 Pa"], "101 kPa", "≈ 101 325 Pa."],
    ["multiple_choice", "Công thức áp suất chất lỏng tĩnh?", ["p = ρ·g·h", "p = m/V", "p = F×S", "p = U/I"], "p = ρ·g·h", "ρ khối lượng riêng chất lỏng."]
  ],
  g8_b17: [
    ["multiple_choice", "Lực đẩy Archimedes hướng?", ["Lên trên", "Xuống dưới", "Ngang", "Không xác định"], "Lên trên", "Ngược trọng lực."],
    ["multiple_choice", "Vật nổi trên nước khi?", ["ρ_vật < ρ_nước", "ρ_vật > ρ_nước", "ρ_vật = 0", "Không liên quan ρ"], "ρ_vật < ρ_nước", "P = F_A khi cân bằng nổi."],
    ["multiple_choice", "F_A bằng trọng lượng phần chất lỏng?", ["Bị vật chiếm chỗ (thể tích chìm)", "Toàn bộ bình", "Không liên quan thể tích", "Chỉ khối lượng vật"], "Bị vật chiếm chỗ (thể tích chìm)", "V là thể tích phần chìm."]
  ],
  g8_b18: [
    ["multiple_choice", "Moment lực M = ?", ["F·d", "F/d", "F + d", "F − d"], "F·d", "d là cánh tay đòn."],
    ["multiple_choice", "Đơn vị moment lực là?", ["N·m", "N/m", "J/kg", "Pa"], "N·m", "Newton mét."],
    ["multiple_choice", "Mở cửa, đẩy xa bản lề thì?", ["Dễ quay hơn (d lớn)", "Khó quay hơn", "Không đổi", "Cửa không quay"], "Dễ quay hơn (d lớn)", "M = F·d lớn hơn với cùng F."]
  ],
  g8_b19: [
    ["multiple_choice", "Đòn bẩy cân bằng khi?", ["F₁·d₁ = F₂·d₂", "F₁ = F₂", "d₁ = d₂ luôn", "F₁ + F₂ = 0"], "F₁·d₁ = F₂·d₂", "Quy tắc moment."],
    ["multiple_choice", "Đòn bẩy lợi thế giúp?", ["Giảm lực cần dùng", "Tăng lực cần dùng", "Không tiết kiệm lực", "Chỉ đo nhiệt"], "Giảm lực cần dùng", "Đổi lấy quãng đường dài hơn."],
    ["multiple_choice", "Kìm cắt là ứng dụng?", ["Đòn bẩy", "Áp suất khí", "Nhiễm điện", "Bức xạ"], "Đòn bẩy", "Moment lực."]
  ],
  g8_b20: [
    ["multiple_choice", "Nhiễm điện do cọ xát là?", ["Chuyển electron giữa vật", "Tạo proton mới", "Tạo nhiệt độ 0", "Chỉ xảy ra với nước"], "Chuyển electron giữa vật", "Electron di chuyển."],
    ["multiple_choice", "Hai vật cùng điện tích sẽ?", ["Đẩy nhau", "Hút nhau", "Không tác dụng", "Tan ra"], "Đẩy nhau", "Cùng dấu đẩy."],
    ["multiple_choice", "Đơn vị điện tích là?", ["Coulomb (C)", "Volt (V)", "Ampere (A)", "Ohm (Ω)"], "Coulomb (C)", "C là đơn vị điện tích."]
  ],
  g8_b21: [
    ["multiple_choice", "Dòng điện là?", ["Dòng điện tích có hướng", "Chỉ electron đứng yên", "Chỉ ánh sáng", "Chỉ nhiệt"], "Dòng điện tích có hướng", "Có chiều quy ước."],
    ["multiple_choice", "Nguồn điện có tác dụng?", ["Duy trì hiệu điện thế", "Chỉ đo nhiệt", "Chỉ cách điện", "Không cần trong mạch"], "Duy trì hiệu điện thế", "Pin, ắc quy..."],
    ["multiple_choice", "Trong dây kim loại dòng điện chủ yếu do?", ["Electron", "Proton di chuyển tự do", "Neutron", "Photon"], "Electron", "Electron tự do."]
  ],
  g8_b22: [
    ["multiple_choice", "Mạch kín cần có?", ["Nguồn, dây dẫn, tải", "Chỉ dây", "Chỉ đèn", "Không cần nguồn"], "Nguồn, dây dẫn, tải", "Dòng chạy kín."],
    ["multiple_choice", "Công tắc mở thì?", ["Mạch hở, không có dòng", "Dòng tăng gấp đôi", "U = 0 luôn", "Cháy nguồn"], "Mạch hở, không có dòng", "Mạch không kín."],
    ["multiple_choice", "Chiều dòng điện quy ước (ngoài nguồn)?", ["Từ cực dương ra cực âm", "Từ âm ra dương trong mọi chỗ", "Ngẫu nhiên", "Không quy ước"], "Từ cực dương ra cực âm", "Quy ước dòng dương."]
  ],
  g8_b23: [
    ["multiple_choice", "Tác dụng nhiệt của dòng điện?", ["Dây điện nóng lên", "Chỉ phát sáng", "Chỉ từ tính", "Không có"], "Dây điện nóng lên", "Hiệu ứng Joule."],
    ["multiple_choice", "Dòng điện qua cuộn dây có thể?", ["Tạo từ trường", "Tạo trọng lực", "Làm nguội ngay", "Chỉ đo áp suất"], "Tạo từ trường", "Nam châm điện."],
    ["multiple_choice", "Dòng quá tải có thể gây?", ["Cháy dây dẫn", "Giảm nhiệt", "Tăng an toàn", "Không ảnh hưởng"], "Cháy dây dẫn", "Cần cầu chì, aptomat."]
  ],
  g8_b24: [
    ["multiple_choice", "Cường độ dòng điện đo bằng?", ["Ampe (A)", "Volt (V)", "Ohm (Ω)", "Watt (W)"], "Ampe (A)", "Ampe kế."],
    ["multiple_choice", "Hiệu điện thế đo bằng?", ["Volt (V)", "Ampe (A)", "Coulomb (C)", "Pascal (Pa)"], "Volt (V)", "Vôn kế."],
    ["multiple_choice", "Ampe kế mắc?", ["Tiếp (series) trong mạch", "Song song tải", "Không mắc", "Chỉ nối đất"], "Tiếp (series) trong mạch", "Đo I qua mạch."]
  ],
  g8_b25: [
    ["multiple_choice", "Vôn kế mắc?", ["Song song tải", "Tiếp mạch", "Cắt dây", "Không cần nguồn"], "Song song tải", "Đo U hai đầu tải."],
    ["multiple_choice", "Trước khi đóng mạch thí nghiệm nên?", ["Kiểm tra mắc đúng, an toàn", "Chạm tay ướt", "Nối tắt nguồn", "Không đeo kính"], "Kiểm tra mắc đúng, an toàn", "An toàn điện."],
    ["input", "Pin 1,5 V. Viết số hiệu điện thế (chỉ số, dùng dấu phẩy nếu cần).", "1,5", "Đọc vôn kế hoặc nhãn pin."]
  ],
  g8_b26: [
    ["multiple_choice", "Nội năng phụ thuộc?", ["Nhiệt độ và trạng thái vật chất", "Chỉ màu sắc", "Chỉ hình dạng", "Không đổi"], "Nhiệt độ và trạng thái vật chất", "Nội năng tăng khi nóng lên."],
    ["multiple_choice", "Nhiệt lượng truyền vào vật thường?", ["Làm tăng nội năng hoặc đổi thể", "Luôn giảm nhiệt độ", "Không ảnh hưởng", "Chỉ đổi màu"], "Làm tăng nội năng hoặc đổi thể", "Q vào → nội năng tăng."],
    ["multiple_choice", "Nhiệt độ và nội năng?", ["Liên quan nhưng khác khái niệm", "Giống hệt nhau", "Không liên quan", "Chỉ đo bằng kg"], "Liên quan nhưng khác khái niệm", "Nhiệt độ đo mức nóng lạnh."]
  ],
  g8_b27: [
    ["multiple_choice", "Joulemeter đo?", ["Năng lượng điện chuyển thành nhiệt", "Chỉ khối lượng", "Chỉ lực", "Chỉ tốc độ"], "Năng lượng điện chuyển thành nhiệt", "E = U·I·t."],
    ["multiple_choice", "Đơn vị năng lượng là?", ["Joule (J)", "Watt (W)", "Newton (N)", "Pascal (Pa)"], "Joule (J)", "1 J = 1 N·m."],
    ["multiple_choice", "Năng lượng điện càng lớn đun nước thì nước?", ["Nóng hơn (nếu cùng khối lượng nước)", "Lạnh hơn", "Không đổi", "Đông ngay"], "Nóng hơn (nếu cùng khối lượng nước)", "Q = E chuyển thành nội năng."]
  ],
  g8_b28: [
    ["multiple_choice", "Truyền nhiệt qua dẫn nhiệt?", ["Kim loại nóng lên", "Chỉ trong chân không", "Không cần chênh nhiệt", "Chỉ ban đêm"], "Kim loại nóng lên", "Tiếp xúc trực tiếp."],
    ["multiple_choice", "Đối lưu xảy ra chủ yếu ở?", ["Chất lỏng và khí", "Chỉ vật rắn tĩnh", "Chân không", "Chỉ trong pin"], "Chất lỏng và khí", "Dòng chất lỏng/khí mang nhiệt."],
    ["multiple_choice", "Mặt Trời sưởi ấm Trái Đất chủ yếu qua?", ["Bức xạ nhiệt", "Dẫn nhiệt trong chân không", "Chỉ đối lưu không khí", "Dòng điện"], "Bức xạ nhiệt", "Không cần môi chất."]
  ],
  g8_b29: [
    ["multiple_choice", "Vật nóng lên thường?", ["Nở ra", "Co lại", "Không đổi kích thước", "Tan ra"], "Nở ra", "Nở vì nhiệt."],
    ["multiple_choice", "Khe hở trên cầu sắt để?", ["Cho phép nở nhiệt", "Trang trí", "Giảm trọng lượng", "Tăng ma sát"], "Cho phép nở nhiệt", "Tránh cong vênh."],
    ["multiple_choice", "Nở dài Δl phụ thuộc?", ["l₀, α và Δt", "Chỉ màu", "Chỉ lực", "Chỉ áp suất khí"], "l₀, α và Δt", "Δl = l₀·α·Δt."]
  ]
};

const errors = [
  ["g8_b13", "v/m", "formula_error", "Sai công thức khối lượng riêng", "D = m/V, không phải V/m.", "Khối lượng chia thể tích."],
  ["g8_b15", "f*s", "formula_error", "Sai công thức áp suất", "p = F/S, không phải F×S.", "Chia lực cho diện tích."],
  ["g8_b16", "p=m/v", "formula_error", "Nhầm công thức áp suất chất lỏng", "p = ρ·g·h, không phải m/V.", "ρ là khối lượng riêng chất lỏng."],
  ["g8_b17", "xuong", "concept_error", "Sai hướng Archimedes", "F_A hướng lên, ngược trọng lực.", "F_A = ρ·g·V (phần chìm)."],
  ["g8_b18", "f/d", "formula_error", "Sai moment lực", "M = F·d, không phải F/d.", "d vuông góc lực."],
  ["g8_b20", "proton", "concept_error", "Nhầm nhiễm điện", "Cọ xát chủ yếu chuyển electron.", "Electron dễ di chuyển hơn trong vật."],
  ["g8_b24", "song song", "circuit_error", "Mắc sai ampe kế", "Ampe kế mắc tiếp, không song song.", "Vôn kế mới song song tải."],
  ["g8_b24", "tiếp", "circuit_error", "Mắc sai vôn kế", "Vôn kế mắc song song, không tiếp mạch.", "Đo U hai đầu tải."],
  ["g8_b26", "nhiet do", "concept_error", "Nhầm nhiệt và nhiệt độ", "Nhiệt lượng Q khác nhiệt độ.", "Nội năng liên quan nhiệt độ."],
  ["g8_b28", "lanh sang nong", "concept_error", "Sai chiều truyền nhiệt", "Nhiệt từ vật nóng sang vật lạnh.", "Không tự chuyển ngược."],
  ["g8_b29", "co lai", "concept_error", "Sai nở vì nhiệt", "Vật thường nở khi nóng lên.", "Trừ một số trường hợp đặc biệt (nước 0–4°C)."]
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

const grade8Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade8Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade8Questions = lessons.flatMap(questionObjects);
const grade8Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
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

const lower = skillsFile.filter((s) => s.grade < 8);
const upper = skillsFile.filter((s) => s.grade > 8);
const lowerLessons = lessonsFile.filter((l) => lower.some((s) => s.id === l.skill));
const upperLessons = lessonsFile.filter((l) => upper.some((s) => s.id === l.skill));
const lowerQuestions = questionsFile.filter((qItem) => lower.some((s) => s.id === qItem.skill));
const upperQuestions = questionsFile.filter((qItem) => upper.some((s) => s.id === qItem.skill));
const keepErrors = errorsFile.filter(
  (e) => lower.some((s) => s.id === e.skill) || upper.some((s) => s.id === e.skill)
);

const skills = [...lower, ...grade8Skills, ...upper];
const lessonData = [...lowerLessons, ...grade8Lessons, ...upperLessons];
const questions = [...lowerQuestions, ...grade8Questions, ...upperQuestions];
const allErrors = [...keepErrors, ...grade8Errors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 8 Vật lí KNTT: ${grade8Skills.length} skills, ${grade8Questions.length} questions, ${grade8Errors.length} error patterns.`);
console.log(`Total app: ${skills.length} skills, ${questions.length} questions.`);
