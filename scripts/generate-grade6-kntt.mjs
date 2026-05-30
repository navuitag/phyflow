import { readFile, writeFile } from "node:fs/promises";

/** SGK KHTN 6 – Kết nối tri thức (mạch Vật lí: Bài 1–2, 5–8, 40–55) */
const lessons = [
  ["g6_b01", "Bài 1. Giới thiệu về Khoa học tự nhiên", "Mở đầu về Khoa học tự nhiên", 1, 1, "Nhận biết ba lĩnh vực KHTN và vai trò Vật lí trong đời sống.", "khtn"],
  ["g6_b02", "Bài 2. An toàn trong phòng thực hành", "Mở đầu về Khoa học tự nhiên", 1, 2, "Tuân thủ quy tắc an toàn khi làm thí nghiệm Vật lí – Hóa – Sinh.", "lab"],
  ["g6_b05", "Bài 5. Đo chiều dài", "Mở đầu về Khoa học tự nhiên", 1, 5, "Dùng thước kẻ, thước dây; đơn vị m, cm, mm và đọc số liệu.", "length"],
  ["g6_b06", "Bài 6. Đo khối lượng", "Mở đầu về Khoa học tự nhiên", 1, 6, "Dùng cân, đơn vị gam và kilogam khi đo trong thí nghiệm Vật lí.", "measure"],
  ["g6_b07", "Bài 7. Đo thời gian", "Mở đầu về Khoa học tự nhiên", 1, 7, "Dùng đồng hồ, bấm giờ đo thời gian chuyển động và quá trình vật lí.", "time"],
  ["g6_b08", "Bài 8. Đo nhiệt độ", "Mở đầu về Khoa học tự nhiên", 1, 8, "Đọc nhiệt kế, thang độ C và liên hệ với hiện tượng nhiệt.", "temperature"],
  ["g6_b40", "Bài 40. Lực là gì?", "Lực trong đời sống", 8, 40, "Lực là tác dụng làm vật biến dạng hoặc thay đổi chuyển động.", "force"],
  ["g6_b41", "Bài 41. Biểu diễn lực", "Lực trong đời sống", 8, 41, "Vẽ mũi tên biểu diễn lực: điểm đặt, phương, chiều và độ lớn.", "forceVector"],
  ["g6_b42", "Bài 42. Biến dạng của lò xo", "Lực trong đời sống", 8, 42, "Lò xo co giãn khi có lực tác dụng; biến dạng đàn hồi.", "spring"],
  ["g6_b43", "Bài 43. Trọng lực, lực hấp dẫn", "Lực trong đời sống", 8, 43, "Trọng lượng do Trái Đất hút vật; P = m·g (g ≈ 10 N/kg).", "gravity"],
  ["g6_b44", "Bài 44. Lực ma sát", "Lực trong đời sống", 8, 44, "Lực ma sát cản chuyển động tương đối giữa hai bề mặt tiếp xúc.", "friction"],
  ["g6_b45", "Bài 45. Lực cản của nước", "Lực trong đời sống", 8, 45, "Nước và không khí cản chuyển động; lực cản tăng khi vật đi nhanh hơn.", "drag"],
  ["g6_b46", "Bài 46. Năng lượng và sự truyền năng lượng", "Năng lượng", 9, 46, "Năng lượng truyền từ vật này sang vật khác hoặc qua môi trường.", "energy"],
  ["g6_b47", "Bài 47. Một số dạng năng lượng", "Năng lượng", 9, 47, "Cơ năng, nhiệt năng, điện năng, quang năng, hóa năng.", "energyForms"],
  ["g6_b48", "Bài 48. Sự chuyển hóa năng lượng", "Năng lượng", 9, 48, "Năng lượng chuyển từ dạng này sang dạng khác nhưng bảo toàn.", "energyTransform"],
  ["g6_b49", "Bài 49. Năng lượng hao phí", "Năng lượng", 9, 49, "Một phần năng lượng chuyển thành nhiệt, tiếng ồn, không dùng được.", "energyWaste"],
  ["g6_b50", "Bài 50. Năng lượng tái tạo", "Năng lượng", 9, 50, "Năng lượng mặt trời, gió, thủy điện, sinh khối tái tạo nhanh.", "renewable"],
  ["g6_b51", "Bài 51. Tiết kiệm năng lượng", "Năng lượng", 9, 51, "Giảm tiêu thụ, dùng thiết bị tiết kiệm, tái sử dụng nguồn sạch.", "saveEnergy"],
  ["g6_b52", "Bài 52. Chuyển động nhìn thấy của Mặt Trời. Thiên thể", "Trái Đất và bầu trời", 10, 52, "Mặt Trời mọc lặn do Trái Đất quay; thiên thể là vật thiên văn.", "sunMotion"],
  ["g6_b53", "Bài 53. Mặt Trăng", "Trái Đất và bầu trời", 10, 53, "Mặt Trăng quay quanh Trái Đất; các pha Mặt Trăng theo chu kì.", "moon"],
  ["g6_b54", "Bài 54. Hệ Mặt Trời", "Trái Đất và bầu trời", 10, 54, "Mặt Trời, các hành tinh, tiểu hành tinh và sao chổi.", "solarSystem"],
  ["g6_b55", "Bài 55. Ngân Hà", "Trái Đất và bầu trời", 10, 55, "Ngân Hà là thiên hà xoắn ốc chứa Hệ Mặt Trời.", "galaxy"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 6 – Kết nối tri thức với cuộc sống (mạch Vật lí), nội dung tự biên soạn.";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  return {
    id,
    title,
    grade: 6,
    book: "Kết nối tri thức",
    chapter,
    chapterIndex,
    lessonNo,
    domain: chapterIndex <= 1 ? "Mở đầu & Đo lường" : chapterIndex === 8 ? "Lực học" : chapterIndex === 9 ? "Năng lượng" : "Thiên văn",
    level: chapterIndex <= 1 ? 1 : chapterIndex <= 8 ? 2 : 3,
    prerequisite: index === 0 ? [] : [lessons[index - 1][0]],
    description,
    visualization
  };
}

const core = {
  g6_b01: ["Vai trò Vật lí", "Vật lí nghiên cứu chuyển động, lực, nhiệt, điện, ánh sáng và âm thanh.", "Quả bóng rơi, xe chạy, bóng đèn sáng đều liên quan Vật lí.", "KHTN gồm Vật lí, Hóa học, Sinh học."],
  g6_b02: ["An toàn lab", "Đeo kính bảo hộ; kiểm tra dây điện trước khi đóng nguồn; không chạm tay ướt vào thiết bị.", "Khi dùng nguồn điện một chiều nhỏ, kiểm tra mạch kín trước.", "Báo giáo viên ngay khi có sự cố."],
  g6_b05: ["Đo chiều dài", "Thước kẻ, thước dây; đơn vị m, cm, mm.", "Đo chiều dài bàn học: l ≈ 1,2 m = 120 cm.", "1 m = 100 cm = 1000 mm."],
  g6_b06: ["Cân khối lượng", "Khối lượng đo lượng chất; đơn vị g, kg.", "Quyển vở cân được 200 g = 0,2 kg.", "Đặt cân trên mặt phẳng, đọc số khi ổn định."],
  g6_b07: ["Đo thời gian", "Đồng hồ, bấm giờ; đơn vị s, phút, h.", "Đo thời gian quả bóng lăn từ A đến B: t = 3 s.", "1 h = 60 phút = 3600 s."],
  g6_b08: ["Nhiệt kế", "Nhiệt độ đo mức nóng lạnh; thang độ C.", "Nước sôi khoảng 100°C; nước đá tan ở 0°C.", "Đọc vạch ngang mực cột thủy ngân."],
  g6_b40: ["Khái niệm lực", "Lực là tác dụng cơ học; có thể làm biến dạng hoặc đổi chuyển động.", "Đẩy xe đạp → xe chuyển động; nén lò xo → lò xo co lại.", "Lực là đại lượng vectơ (có phương, chiều)."],
  g6_b41: ["Biểu diễn lực", "Vẽ mũi tên: điểm đặt tại vật, hướng theo chiều lực, độ dài tỉ lệ độ lớn.", "Kéo vật sang phải → mũi tên hướng sang phải từ vật.", "Ghi ký hiệu F, đơn vị N (Newton)."],
  g6_b42: ["Lò xo", "Lò xo biến dạng khi có lực; trả về hình cũ nếu không vượt giới hạn đàn hồi.", "Treo vật vào lò xo → lò xo giãn; bỏ vật → lò xo co lại.", "Biến dạng đàn hồi: hình dạng phục hồi khi bỏ lực."],
  g6_b43: ["Trọng lượng", "Trọng lượng P do Trái Đất hút; P = m·g, g ≈ 10 N/kg.", "Vật 2 kg có trọng lượng P ≈ 20 N.", "Trọng lượng ≠ khối lượng (đơn vị khác nhau)."],
  g6_b44: ["Lực ma sát", "Xuất hiện khi hai bề mặt tiếp xúc trượt; cản chuyển động tương đối.", "Xe phanh trên đường nhờ lực ma sát giữa lốp và mặt đường.", "Ma sát trượt và ma sát nghỉ khác nhau."],
  g6_b45: ["Lực cản", "Chất lỏng và khí cản chuyển động của vật đi trong chúng.", "Cá bơi gặp lực cản nước; ô tô gặp lực cản không khí.", "Hình dạng trơn giúp giảm lực cản."],
  g6_b46: ["Truyền năng lượng", "Năng lượng có thể truyền qua va chạm, dẫn nhiệt, bức xạ.", "Tay chạm cốc nóng → nhiệt truyền sang tay.", "Năng lượng không tự sinh ra từ không."],
  g6_b47: ["Các dạng năng lượng", "Cơ năng (vật chuyển động/nâng), nhiệt, điện, quang, hóa.", "Pin: hóa năng → điện năng; quạt: điện → cơ năng.", "Mỗi dạng có ứng dụng riêng."],
  g6_b48: ["Chuyển hóa năng lượng", "Năng lượng chuyển dạng nhưng tổng bảo toàn (trong hệ kín).", "Đèn LED: điện năng → quang năng (+ nhiệt).", "Không có máy sinh năng lượng vô hạn."],
  g6_b49: ["Hao phí năng lượng", "Một phần năng lượng thành nhiệt thừa, tiếng ồn, không hữu ích.", "Động cơ xe tỏa nhiệt ra môi trường.", "Giảm hao phí = tăng hiệu suất."],
  g6_b50: ["Năng lượng tái tạo", "Mặt trời, gió, thủy điện, sinh khối tái tạo nhanh hơn than dầu.", "Pin mặt trời chuyển quang năng thành điện.", "Ít làm cạn kiệt nguồn như nhiên liệu hóa thạch."],
  g6_b51: ["Tiết kiệm năng lượng", "Tắt thiết bị khi không dùng; chọn bóng LED; giảm lãng phí.", "Rút phích điện thiết bị standby tiết kiệm điện.", "Mỗi người đều có thể tiết kiệm năng lượng."],
  g6_b52: ["Mặt Trời mọc lặn", "Do Trái Đất quay quanh trục; Mặt Trời gần như đứng yên so với Trái Đất.", "Buổi sáng thấy Mặt Trời mọc ở phía đông (ở Bắc bán cầu).", "Thiên thể: sao, hành tinh, Mặt Trăng, Mặt Trời..."],
  g6_b53: ["Mặt Trăng", "Vệ tinh tự nhiên quay quanh Trái Đất; pha trăng do vị trí Mặt Trăng – Trái Đất – Mặt Trời.", "Trăng non → trăng khuyết → trăng tròn trong ~29,5 ngày.", "Mặt Trăng phản chiếu ánh sáng Mặt Trời."],
  g6_b54: ["Hệ Mặt Trời", "Mặt Trời ở trung tâm; 8 hành tinh quay quanh (theo SGK THCS).", "Trái Đất hành tinh thứ 3 từ Mặt Trời.", "Sao chổi, tiểu hành tinh cũng thuộc hệ."],
  g6_b55: ["Ngân Hà", "Thiên hà xoắn ốc chứa hàng tỷ sao, trong đó có Mặt Trời.", "Nhìn dải sáng ban đêm là nhìn vào mặt phẳng Ngân Hà.", "Vũ trụ còn nhiều thiên hà khác Ngân Hà."]
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
  g6_b01: [
    ["multiple_choice", "Vật lí nghiên cứu chủ yếu điều gì?", ["Các hiện tượng tự nhiên về vật chất và năng lượng", "Chỉ tế bào", "Chỉ phản ứng hóa học", "Chỉ lịch sử"], "Các hiện tượng tự nhiên về vật chất và năng lượng", "Vật lí là một nhánh KHTN."],
    ["multiple_choice", "KHTN gồm những lĩnh vực nào?", ["Vật lí, Hóa học, Sinh học", "Chỉ Toán", "Chỉ Văn", "Chỉ Địa"], "Vật lí, Hóa học, Sinh học", "Ba lĩnh vực cốt lõi THCS."],
    ["multiple_choice", "Hiện tượng nào thuộc Vật lí?", ["Quả bóng rơi xuống đất", "Vi khuẩn lên men", "Muối tan trong nước (hóa học)", "Phân loại côn trùng"], "Quả bóng rơi xuống đất", "Chuyển động và lực thuộc Vật lí."]
  ],
  g6_b02: [
    ["multiple_choice", "Khi làm thí nghiệm điện, việc nào đúng?", ["Kiểm tra mạch trước khi đóng nguồn", "Chạm tay ướt vào dây điện", "Nối trực tiếp hai cực pin không qua tải", "Không đeo kính"], "Kiểm tra mạch trước khi đóng nguồn", "An toàn điện là ưu tiên."],
    ["multiple_choice", "Phát hiện dây điện bị hở trong phòng lab, em nên:", ["Báo giáo viên ngay", "Sửa bằng tay ướt", "Vẫn cắm điện thử", "Cắt bỏ phần hở tự ý"], "Báo giáo viên ngay", "Không tự sửa thiết bị điện."],
    ["multiple_choice", "Dụng cụ bảo hộ khi làm TN Vật lí gồm:", ["Kính bảo hộ", "Chỉ dép lê", "Không cần gì", "Chỉ găng tay một bên"], "Kính bảo hộ", "Bảo vệ mắt và da."]
  ],
  g6_b05: [
    ["multiple_choice", "1 mét bằng bao nhiêu centimet?", ["100", "10", "1000", "50"], "100", "1 m = 100 cm."],
    ["multiple_choice", "Đơn vị đo chiều dài trong hệ SI là?", ["mét (m)", "kilogam (kg)", "giây (s)", "Newton (N)"], "mét (m)", "m là đơn vị cơ bản."],
    ["input", "Thước đo được 25 cm. Viết số (chỉ số, không đơn vị).", "25", "Đọc vạch chia trên thước."]
  ],
  g6_b06: [
    ["multiple_choice", "Đơn vị khối lượng trong SI là?", ["kilogam (kg)", "Newton (N)", "mét (m)", "Joule (J)"], "kilogam (kg)", "kg là đơn vị khối lượng."],
    ["multiple_choice", "1 kg bằng bao nhiêu gam?", ["1000", "100", "10", "500"], "1000", "1 kg = 1000 g."],
    ["input", "Cân được 250 g. Viết số (chỉ số, không đơn vị).", "250", "Đọc thước hoặc màn hình cân."]
  ],
  g6_b07: [
    ["multiple_choice", "Đơn vị thời gian trong hệ SI là?", ["Giây (s)", "Phút", "Giờ", "Ngày"], "Giây (s)", "s là đơn vị cơ bản."],
    ["multiple_choice", "1 giờ bằng bao nhiêu phút?", ["60", "100", "30", "24"], "60", "1 h = 60 phút."],
    ["multiple_choice", "Đo thời gian quả bóng lăn dùng?", ["Đồng hồ hoặc bấm giờ", "Cân", "Nhiệt kế", "Thước kẻ"], "Đồng hồ hoặc bấm giờ", "Ghi nhận thời gian quá trình."]
  ],
  g6_b08: [
    ["multiple_choice", "Nước sôi ở áp suất thường khoảng bao nhiêu độ C?", ["100", "0", "37", "50"], "100", "Điều kiện chuẩn trong SGK."],
    ["multiple_choice", "0°C là nhiệt độ nào của nước?", ["Nóng chảy của nước đá", "Sôi của nước", "Nhiệt độ cơ thể", "Cháy"], "Nóng chảy của nước đá", "Rắn → lỏng."],
    ["multiple_choice", "Đọc nhiệt kế thủy ngân nên:", ["Nhìn ngang vạch mực cột", "Nhìn xiên từ trên", "Lắc mạnh trước khi đọc", "Đo khi nhiệt kế nghiêng"], "Nhìn ngang vạch mực cột", "Tránh sai số parallax."]
  ],
  g6_b40: [
    ["multiple_choice", "Lực có thể gây ra hiện tượng nào?", ["Làm vật biến dạng hoặc đổi chuyển động", "Chỉ đổi màu sắc hóa học", "Tạo tế bào mới", "Chỉ thay đổi vị trí sao"], "Làm vật biến dạng hoặc đổi chuyển động", "Tác dụng cơ học của lực."],
    ["multiple_choice", "Đơn vị lực trong SI là?", ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"], "Newton (N)", "1 N = 1 kg·m/s²."],
    ["multiple_choice", "Đẩy xe đạp là ví dụ:", ["Lực tác dụng làm vật chuyển động", "Lực hấp dẫn giữa các hành tinh", "Chỉ lực ma sát", "Không có lực"], "Lực tác dụng làm vật chuyển động", "Lực làm đổi trạng thái chuyển động."]
  ],
  g6_b41: [
    ["multiple_choice", "Biểu diễn lực thường dùng?", ["Mũi tên", "Hình tròn", "Bảng chữ cái", "Chỉ số đo"], "Mũi tên", "Hướng mũi tên = chiều lực."],
    ["multiple_choice", "Điểm đặt lực thường đặt ở?", ["Vị trí lực tác dụng lên vật", "Giữa không trung", "Luôn ở Mặt Trời", "Ngoài vật"], "Vị trí lực tác dụng lên vật", "Điểm đặt quan trọng khi vẽ."],
    ["multiple_choice", "Độ dài mũi tên biểu diễn lực thể hiện?", ["Độ lớn lực (tỉ lệ)", "Khối lượng vật", "Thời gian", "Nhiệt độ"], "Độ lớn lực (tỉ lệ)", "Lực lớn → mũi tên dài hơn."]
  ],
  g6_b42: [
    ["multiple_choice", "Lò xo bị nén khi:", ["Có lực ép vào", "Không có lực", "Ở trong chân không", "Nhiệt độ 0 K"], "Có lực ép vào", "Lực gây biến dạng."],
    ["multiple_choice", "Biến dạng đàn hồi là:", ["Trở lại hình cũ khi bỏ lực", "Không bao giờ phục hồi", "Chỉ xảy ra với nước", "Chỉ ở nhiệt độ cao"], "Trở lại hình cũ khi bỏ lực", "Trong giới hạn đàn hồi."],
    ["multiple_choice", "Treo vật nặng vào lò xo treo, lò xo sẽ:", ["Giãn ra", "Tan ra", "Bay lên", "Đổi màu hóa học"], "Giãn ra", "Lực kéo làm lò xo dài thêm."]
  ],
  g6_b43: [
    ["multiple_choice", "Trọng lượng là:", ["Lực hấp dẫn Trái Đất tác dụng lên vật", "Khối lượng của vật", "Thể tích vật", "Nhiệt độ vật"], "Lực hấp dẫn Trái Đất tác dụng lên vật", "P đo bằng N."],
    ["multiple_choice", "Công thức trọng lượng (lớp 6):", ["P = m·g", "P = m/g", "P = m + g", "P = g/m"], "P = m·g", "g ≈ 10 N/kg."],
    ["input", "Vật 3 kg có trọng lượng P ≈ ? N (g = 10 N/kg). Viết số.", "30", "P = m·g = 3×10."]
  ],
  g6_b44: [
    ["multiple_choice", "Lực ma sát có tác dụng:", ["Cản chuyển động tương đối", "Luôn làm vật nhanh hơn", "Không phụ thuộc bề mặt", "Chỉ có trong nước"], "Cản chuyển động tương đối", "Ngược chiều chuyển động trượt."],
    ["multiple_choice", "Xe phanh được nhờ:", ["Lực ma sát giữa lốp và mặt đường", "Lực hấp dẫn Mặt Trăng", "Chỉ lực đẩy động cơ", "Không có lực"], "Lực ma sát giữa lốp và mặt đường", "Ma sát giúp dừng xe."],
    ["multiple_choice", "Mặt nhẵn thường có ma sát:", ["Nhỏ hơn mặt nhám", "Lớn hơn mặt nhám", "Bằng 0 luôn", "Không đổi"], "Nhỏ hơn mặt nhám", "Bề mặt ảnh hưởng ma sát."]
  ],
  g6_b45: [
    ["multiple_choice", "Lực cản của nước xuất hiện khi:", ["Vật chuyển động trong nước", "Vật đứng yên trên cạn", "Không có nước", "Chỉ có trong chân không"], "Vật chuyển động trong nước", "Chất lỏng cản chuyển động."],
    ["multiple_choice", "Cá bơi về phía trước, lực cản nước hướng:", ["Ngược chiều bơi", "Cùng chiều bơi", "Vuông góc lên trời", "Không xác định"], "Ngược chiều bơi", "Cản chuyển động."],
    ["multiple_choice", "Hình dạng trơn giúp:", ["Giảm lực cản", "Tăng lực cản", "Tăng khối lượng", "Đổi nhiệt độ sôi"], "Giảm lực cản", "Tàu ngầm, cá có hình thủy động."]
  ],
  g6_b46: [
    ["multiple_choice", "Năng lượng có thể:", ["Truyền từ vật này sang vật khác", "Chỉ ở một vật mãi mãi", "Không liên quan nhiệt", "Chỉ là khối lượng"], "Truyền từ vật này sang vật khác", "Truyền nhiệt là một dạng truyền."],
    ["multiple_choice", "Tay chạm cốc nóng, nhiệt truyền do:", ["Chênh lệch nhiệt độ", "Chênh lệch khối lượng", "Chênh lệch màu", "Chênh lệch thể tích"], "Chênh lệch nhiệt độ", "Nhiệt từ nóng sang lạnh."],
    ["multiple_choice", "Năng lượng Mặt Trời đến Trái Đất chủ yếu qua:", ["Bức xạ (ánh sáng)", "Dẫn nhiệt trong chân không", "Dòng nước", "Dòng điện trong dây"], "Bức xạ (ánh sáng)", "Không cần môi chất."]
  ],
  g6_b47: [
    ["multiple_choice", "Vật đang chuyển động có:", ["Động năng (một dạng cơ năng)", "Chỉ hóa năng", "Chỉ nhiệt độ sôi", "Không có năng lượng"], "Động năng (một dạng cơ năng)", "Cơ năng liên quan chuyển động."],
    ["multiple_choice", "Pin chuyển hóa năng thành:", ["Điện năng", "Chỉ quang năng", "Chỉ âm thanh", "Khối lượng"], "Điện năng", "Hóa năng → điện năng."],
    ["multiple_choice", "Bóng đèn sáng có:", ["Quang năng", "Chỉ cơ năng", "Chỉ nhiệt độ 0", "Không năng lượng"], "Quang năng", "Ánh sáng mang quang năng."]
  ],
  g6_b48: [
    ["multiple_choice", "Quạt điện chuyển:", ["Điện năng → cơ năng (không khí)", "Cơ năng → điện năng", "Chỉ hóa năng → nhiệt", "Không chuyển hóa"], "Điện năng → cơ năng (không khí)", "Động cơ quay cánh."],
    ["multiple_choice", "Đèn LED chuyển điện năng chủ yếu thành:", ["Quang năng", "Chỉ âm thanh", "Chỉ khối lượng", "Hóa năng trong pin"], "Quang năng", "Cũng có nhiệt nhưng ít hơn đèn sợi đốt."],
    ["multiple_choice", "Trong hệ kín, năng lượng:", ["Bảo toàn (chỉ đổi dạng)", "Tự sinh vô hạn", "Luôn mất hết", "Không đổi dạng"], "Bảo toàn (chỉ đổi dạng)", "Không mất đi, chỉ chuyển hóa."]
  ],
  g6_b49: [
    ["multiple_choice", "Năng lượng hao phí thường chuyển thành:", ["Nhiệt hoặc tiếng ồn không hữu ích", "Chỉ quang năng hữu ích", "Khối lượng mới", "Chỉ điện tích"], "Nhiệt hoặc tiếng ồn không hữu ích", "Máy móc tỏa nhiệt."],
    ["multiple_choice", "Hiệu suất thấp nghĩa là:", ["Nhiều năng lượng bị hao phí", "Không hao phí", "Không cần năng lượng", "Chỉ dùng pin"], "Nhiều năng lượng bị hao phí", "Phần lớn thành nhiệt thừa."],
    ["multiple_choice", "Giảm hao phí giúp:", ["Tiết kiệm năng lượng", "Tăng lãng phí", "Tăng tiếng ồn", "Giảm hiệu suất"], "Tiết kiệm năng lượng", "Dùng ít nhiên liệu/điện hơn."]
  ],
  g6_b50: [
    ["multiple_choice", "Nguồn năng lượng tái tạo là:", ["Năng lượng mặt trời", "Than đá (hóa thạch)", "Dầu mỏ", "Khí thiên nhiên hóa thạch"], "Năng lượng mặt trời", "Tái tạo liên tục."],
    ["multiple_choice", "Thủy điện dùng:", ["Động năng nước chảy", "Chỉ hóa năng pin", "Chỉ ma sát", "Chỉ từ trường"], "Động năng nước chảy", "Nước chảy quay tuabin."],
    ["multiple_choice", "Năng lượng gió chuyển thành điện nhờ:", ["Tuabin gió", "Chỉ lò xo", "Chỉ kính lúp", "Chỉ nhiệt kế"], "Tuabin gió", "Gió quay cánh tuabin."]
  ],
  g6_b51: [
    ["multiple_choice", "Cách tiết kiệm điện ở nhà:", ["Tắt đèn khi ra khỏi phòng", "Để đèn sáng cả ngày", "Mở cửa tủ lạnh lâu", "Dùng bóng sợi đốt cũ"], "Tắt đèn khi ra khỏi phòng", "Giảm tiêu thụ."],
    ["multiple_choice", "Bóng LED thường:", ["Tiết kiệm điện hơn đèn sợi đốt", "Tốn điện hơn mọi loại", "Không phát sáng", "Chỉ dùng pin một lần"], "Tiết kiệm điện hơn đèn sợi đốt", "Hiệu suất cao hơn."],
    ["multiple_choice", "Tiết kiệm năng lượng giúp:", ["Giảm khí thải và chi phí", "Tăng hóa thạch", "Lãng phí tài nguyên", "Không ảnh hưởng gì"], "Giảm khí thải và chi phí", "Bảo vệ môi trường."]
  ],
  g6_b52: [
    ["multiple_choice", "Mặt Trời mọc lặn do:", ["Trái Đất quay quanh trục", "Mặt Trời quay quanh Trái Đất", "Mặt Trăng che Mặt Trời mỗi ngày", "Không có chuyển động"], "Trái Đất quay quanh trục", "Hiện tượng nhìn thấy hàng ngày."],
    ["multiple_choice", "Thiên thể là:", ["Vật thiên văn (sao, hành tinh...)", "Chỉ cây cối", "Chỉ vi khuẩn", "Chỉ hóa chất"], "Vật thiên văn (sao, hành tinh...)", "Ngoài khí quyển Trái Đất."],
    ["multiple_choice", "Ban ngày ta thấy Mặt Trời vì:", ["Mặt Trời phát ra ánh sáng mạnh", "Mặt Trăng phát sáng tự thân", "Trái Đất không quay", "Không khí tạo sao"], "Mặt Trời phát ra ánh sáng mạnh", "Nguồn sáng chính ban ngày."]
  ],
  g6_b53: [
    ["multiple_choice", "Mặt Trăng là:", ["Vệ tinh tự nhiên của Trái Đất", "Hành tinh thứ 9", "Ngôi sao giống Mặt Trời", "Tiểu hành tinh"], "Vệ tinh tự nhiên của Trái Đất", "Quay quanh Trái Đất."],
    ["multiple_choice", "Pha trăng thay đổi do:", ["Vị trí Mặt Trăng so với Trái Đất và Mặt Trời", "Mặt Trăng đổi kích thước thật", "Trái Đất ngừng quay", "Mưa nhiều"], "Vị trí Mặt Trăng so với Trái Đất và Mặt Trời", "Góc chiếu sáng thay đổi."],
    ["multiple_choice", "Ánh sáng Mặt Trăng ta thấy chủ yếu là:", ["Phản chiếu từ Mặt Trời", "Do Mặt Trăng tự phát ra", "Do đèn Trái Đất", "Do sao chổi"], "Phản chiếu từ Mặt Trời", "Mặt Trăng không tự sáng như Mặt Trời."]
  ],
  g6_b54: [
    ["multiple_choice", "Ở trung tâm Hệ Mặt Trời là:", ["Mặt Trời", "Trái Đất", "Mặt Trăng", "Ngân Hà"], "Mặt Trời", "Sao và là nguồn sáng chính."],
    ["multiple_choice", "Trái Đất trong Hệ Mặt Trời là:", ["Hành tinh", "Sao", "Vệ tinh của sao khác", "Thiên hà"], "Hành tinh", "Quay quanh Mặt Trời."],
    ["multiple_choice", "Hành tinh gần Mặt Trời nhất (theo SGK THCS) thường được nhắc là:", ["Sao Thủy", "Sao Hải Vương", "Sao Diêm Vương (nếu không tính)", "Sao Mộc"], "Sao Thủy", "Thứ tự từ Mặt Trời: Thủy, Kim, Trái Đất..."]
  ],
  g6_b55: [
    ["multiple_choice", "Ngân Hà là:", ["Thiên hà chứa Hệ Mặt Trời", "Một hành tinh", "Vệ tinh của Trái Đất", "Chỉ là đám mây"], "Thiên hà chứa Hệ Mặt Trời", "Dải sáng ban đêm là mặt phẳng Ngân Hà."],
    ["multiple_choice", "Mặt Trời nằm trong:", ["Ngân Hà", "Thiên hà Andromeda", "Chỉ quỹ đạo Mặt Trăng", "Không thuộc thiên hà nào"], "Ngân Hà", "Một trong hàng tỷ sao Ngân Hà."],
    ["multiple_choice", "Nhìn dải sáng ban đêm ta đang nhìn:", ["Mặt phẳng Ngân Hà (nhiều sao)", "Chỉ một ngôi sao", "Mặt Trăng", "Mặt Trời ban ngày"], "Mặt phẳng Ngân Hà (nhiều sao)", "Tập trung sao dày đặc."]
  ]
};

const errors = [
  ["g6_b02", "uoc", "safety_error", "Chạm tay ướt vào điện", "Không chạm tay ướt vào dây điện hoặc thiết bị đang cắm.", "Rút phích và báo giáo viên."],
  ["g6_b05", "1000 cm", "unit_error", "Nhầm đổi m và cm", "1 m = 100 cm, không phải 1000 cm.", "1 m = 100 cm = 1000 mm."],
  ["g6_b06", "n", "unit_error", "Nhầm khối lượng và lực", "Khối lượng đo bằng kg/g; Newton (N) là đơn vị lực.", "Trọng lượng mới có đơn vị N."],
  ["g6_b07", "3600 phut", "unit_error", "Nhầm đổi giờ và phút", "1 giờ = 60 phút, không phải 3600 phút.", "3600 giây = 1 giờ."],
  ["g6_b08", "0", "temp_error", "Nhầm nóng chảy và sôi", "0°C là nóng chảy băng, không phải sôi nước.", "Sôi nước khoảng 100°C."],
  ["g6_b40", "j", "unit_error", "Nhầm đơn vị lực", "Lực đo bằng N (Newton), không phải J (Joule).", "J là đơn vị năng lượng/công."],
  ["g6_b43", "kg", "concept_error", "Nhầm khối lượng và trọng lượng", "Khối lượng m (kg) khác trọng lượng P (N).", "P = m·g."],
  ["g6_b43", "p=m/g", "formula_error", "Sai công thức trọng lượng", "P = m·g, không phải m/g.", "g ≈ 10 N/kg."],
  ["g6_b44", "nhanh hon", "concept_error", "Ma sát luôn tăng tốc", "Ma sát trượt thường cản chuyển động.", "Ma sát có thể có lợi (phanh xe)."],
  ["g6_b48", "mat di", "concept_error", "Năng lượng mất hoàn toàn", "Năng lượng chuyển dạng, không tự mất trong hệ kín.", "Một phần thành nhiệt hao phí."],
  ["g6_b50", "than", "concept_error", "Nhầm tái tạo và hóa thạch", "Than đá là nhiên liệu hóa thạch, không tái tạo nhanh.", "Mặt trời, gió là tái tạo."],
  ["g6_b52", "mat troi quay", "concept_error", "Nhầm chuyển động Mặt Trời", "Mặt Trời mọc lặn do Trái Đất quay, không phải Mặt Trời quanh Trái Đất.", "Trái Đất quay quanh trục."],
  ["g6_b53", "tu sang", "concept_error", "Mặt Trăng tự phát sáng", "Mặt Trăng phản chiếu ánh sáng Mặt Trời.", "Pha trăng do góc chiếu sáng."],
  ["g6_b54", "mat trang", "concept_error", "Nhầm vệ tinh và hành tinh", "Mặt Trăng là vệ tinh; Trái Đất là hành tinh.", "Hành tinh quay quanh Mặt Trời."]
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

const grade6Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade6Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade6Questions = lessons.flatMap(questionObjects);
const grade6Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
  pattern,
  skill,
  errorType,
  title,
  message,
  hint,
  recommendation: skill
}));

const upper = JSON.parse(await readFile("data/skills.json", "utf8")).filter((s) => s.grade > 6);
const upperLessons = JSON.parse(await readFile("data/lessons.json", "utf8")).filter((l) => upper.some((s) => s.id === l.skill));
const upperQuestions = JSON.parse(await readFile("data/questions.json", "utf8")).filter((qItem) => upper.some((s) => s.id === qItem.skill));
const upperErrors = JSON.parse(await readFile("data/errors.json", "utf8")).filter((e) => e.skill && !e.skill.startsWith("g6_"));

const skills = [...grade6Skills, ...upper];
const lessonData = [...grade6Lessons, ...upperLessons];
const questions = [...grade6Questions, ...upperQuestions];
const allErrors = [...grade6Errors, ...upperErrors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 6 Vật lí KNTT: ${grade6Skills.length} skills, ${grade6Questions.length} questions, ${grade6Errors.length} error patterns.`);
console.log(`Total app: ${skills.length} skills, ${questions.length} questions.`);
