# PhyFlow VN

Ứng dụng web học **Vật lý THCS** (lớp 6–9): micro-learning, mô phỏng trực quan và phân tích lỗi sai. Frontend-only, offline-first.

## Chạy thử

```bash
cd phyflow
python3 -m http.server 8080
```

Mở trình duyệt: `http://localhost:8080`

## Cấu trúc

- `index.html` — shell SPA
- `assets/` — CSS, JS (router, state)
- `components/` — navbar, lesson/quiz card, modal
- `modules/` — lesson, quiz, error, visualization, simulation, gamification, progress
- `data/` — `skills.json`, `lessons.json`, `questions.json`, `errors.json`

## Tính năng

- **Lesson Engine** — bài học theo vi kỹ năng, tiến độ mastery
- **Quiz Engine** — trắc nghiệm và nhập đáp án
- **Error Analysis** — phân loại lỗi: FORMULA_ERROR, UNIT_ERROR, CONCEPT_ERROR, LOGIC_ERROR
- **Simulation Engine** — mô phỏng Canvas (Định luật Ohm — Bài 11 lớp 9)
- **Gamification** — XP, level, badge, daily quest, streak

## Lộ trình nội dung

- **Lớp 6 (KNTT):** 22 bài Vật lí — Mở đầu & đo lường (Bài 1–2, 5–8), Lực (40–45), Năng lượng (46–51), Trái Đất và bầu trời (52–55)
- **Lớp 7 (KNTT):** 13 bài Vật lí — Tốc độ (8–11), Âm thanh (12–14), Ánh sáng (15–17), Từ (18–20)
- **Lớp 8 (KNTT):** 17 bài Vật lí — Khối lượng riêng & áp suất (13–17), Moment lực (18–19), Điện (20–25), Nhiệt (26–29)
- **Lớp 9 (KNTT):** 16 bài Vật lí — Cơ năng (2–4), Ánh sáng (5–10), Điện (11–13), Điện từ (14–15), Năng lượng (16–17); mô phỏng Định luật Ohm tại Bài 11

Tạo lại nội dung:

```bash
node scripts/generate-grade6-kntt.mjs   # Lớp 6 Vật lí KNTT
node scripts/generate-grade7-kntt.mjs   # Lớp 7 Vật lí KNTT
node scripts/generate-grade8-kntt.mjs   # Lớp 8 Vật lí KNTT
node scripts/generate-grade9-kntt.mjs   # Lớp 9 Vật lí KNTT (merge lớp 6–8)
```

Giao diện dùng cùng bảng màu với [MathFlow](../mathflow) (`#20a36b`, nền `#f7fbff`).

---

## Tác giả

- **Nguyễn Anh Vũ**
- Email: [navuitag@gmail.com](mailto:navuitag@gmail.com)
- Điện thoại: [0986201079](tel:+84986201079)
