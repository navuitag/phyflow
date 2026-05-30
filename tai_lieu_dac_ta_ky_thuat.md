# TÀI LIỆU ĐẶC TẢ KỸ THUẬT
# ỨNG DỤNG WEB HỌC VẬT LÝ THCS
## Ý tưởng: “Phân tích lỗi sai” + “Trực quan hóa kiến thức”

---

# 1. Mục tiêu
Xây dựng ứng dụng web SPA bằng:
- HTML5
- CSS3
- JavaScript ES6

Ứng dụng hỗ trợ:
- mô phỏng vật lý,
- quiz tương tác,
- phân tích lỗi sai,
- adaptive learning,
- gamification.

---

# 2. Kiến trúc hệ thống

```text
Browser
 ├── UI Layer
 ├── Lesson Engine
 ├── Visualization Engine
 ├── Simulation Engine
 ├── Quiz Engine
 ├── Error Analysis Engine
 ├── Adaptive Learning Engine
 ├── Gamification Engine
 └── Storage Layer
```

---

# 3. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| UI | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Animation | Canvas API |
| Storage | localStorage / IndexedDB |
| Routing | Hash Router |

---

# 4. Module chính

## Lesson Engine
Quản lý:
- bài học,
- level,
- tiến độ.

## Visualization Engine
Hiển thị:
- animation,
- đồ thị,
- mô phỏng realtime.

## Simulation Engine
Mô phỏng:
- điện học,
- lực,
- ánh sáng,
- âm thanh.

## Quiz Engine
Các dạng:
- Multiple Choice,
- Drag & Drop,
- Draw Interaction,
- Error Correction.

## Error Analysis Engine
Phân loại lỗi:
- FORMULA_ERROR
- UNIT_ERROR
- CONCEPT_ERROR
- LOGIC_ERROR

## Adaptive Learning
Điều chỉnh độ khó theo năng lực học sinh.

## Gamification
- XP
- Level
- Badge
- Streak

---

# 5. Thiết kế dữ liệu

```javascript
UserProgress {
    completedLessons,
    xp,
    level,
    streak,
    weakTopics,
    errorHistory
}
```

---

# 6. Cấu trúc thư mục

```text
/src
 ├── index.html
 ├── css/
 ├── js/
 ├── assets/
 └── data/
```

---

# 7. Roadmap

## Phase 1
- Lesson Engine
- Quiz Engine
- Error Analysis

## Phase 2
- Simulation realtime
- Adaptive Learning

## Phase 3
- AI Tutor
- Teacher Dashboard
