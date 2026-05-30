# TÀI LIỆU THIẾT KẾ CHI TIẾT
# ỨNG DỤNG WEB HỌC VẬT LÝ THCS

---

# 1. Kiến trúc Frontend

```text
Application Core
 ├── Router
 ├── State Store
 ├── Event Bus
 ├── UI Components
 ├── Simulation Layer
 ├── Visualization Layer
 ├── Quiz Layer
 ├── Error Analysis Layer
 └── Storage Layer
```

---

# 2. Router SPA

```javascript
const routes = {
    '/home': HomePage,
    '/lesson': LessonPage,
    '/simulation': SimulationPage,
    '/quiz': QuizPage
}
```

---

# 3. State Management

```javascript
const store = {
    user: {},
    lessons: [],
    currentLesson: null,
    quizState: {},
    simulationState: {}
}
```

---

# 4. Component System

```text
App
 ├── Header
 ├── Sidebar
 ├── MainContent
 └── BottomNavigation
```

---

# 5. Visualization Engine

## Rendering Pipeline

```text
Data
 ↓
Physics Mapper
 ↓
Render Objects
 ↓
Canvas Renderer
 ↓
Animation Loop
```

## Canvas Layers

```text
Canvas
 ├── Background Layer
 ├── Simulation Layer
 ├── Interaction Layer
 └── UI Overlay Layer
```

---

# 6. Physics Simulation Engine

```javascript
class PhysicsObject {
    constructor(){
        this.position = {x:0,y:0}
        this.velocity = {x:0,y:0}
        this.acceleration = {x:0,y:0}
    }

    update(){}
    render(){}
}
```

---

# 7. Quiz Engine

## Quiz Lifecycle

```text
Load Quiz
 ↓
Render Question
 ↓
Receive Answer
 ↓
Analyze Error
 ↓
Generate Feedback
```

---

# 8. Error Analysis Engine

## Pipeline

```text
Student Answer
 ↓
Normalize Data
 ↓
Pattern Matching
 ↓
Error Classification
 ↓
Diagnostic Feedback
```

## Error Database

```javascript
const errorDatabase = {
    FORMULA_ERROR: {
        explanation: 'Sai công thức'
    },
    UNIT_ERROR: {
        explanation: 'Sai đơn vị'
    }
}
```

---

# 9. Gamification

| Hành động | XP |
|---|---|
| Hoàn thành bài | +20 |
| Đúng liên tiếp | +10 |
| Không sai | +15 |

---

# 10. Responsive Design

| Device | Width |
|---|---|
| Mobile | <768px |
| Tablet | 768–1024px |
| Desktop | >1024px |

---

# 11. MVP

## Chủ đề MVP
Định luật Ôm lớp 9

## MVP gồm
- Simulation
- Quiz
- Error Analysis
- XP System

---

# 12. Sprint Development Plan

## Sprint 1
- setup SPA
- router
- layout

## Sprint 2
- lesson engine
- quiz engine

## Sprint 3
- simulation engine
- visualization engine

## Sprint 4
- error analysis engine
