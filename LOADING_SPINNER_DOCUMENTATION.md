# LoadingSpinner Component Documentation - Main Branch

## 📋 Overview
เอกสารนี้อธิบายการทำงานของ `LoadingSpinner` component และ CSS ที่เกี่ยวข้องใน branch `main`

---

## 🏗️ Component Structure

### LoadingSpinner.js

#### Class Properties
```javascript
class LoadingSpinner {
  constructor() {
    this.element = null;        // DOM element ของ loading overlay
    this.currentMessage = "";    // ข้อความ loading ปัจจุบัน
    this.isVisible = false;      // สถานะการแสดงผล
  }
}
```

#### Main Methods

##### 1. `create(message, context)`
- **หน้าที่**: สร้าง HTML structure ของ loading spinner
- **Parameters**:
  - `message`: ข้อความ loading (default: "Loading...")
  - `context`: context ของ loading (blockchain, tournament, score, etc.)
- **Returns**: HTMLElement (loading overlay div)
- **HTML Structure**:
  ```
  .linera-loading-overlay
    └── .linera-loading-container
        ├── .linera-logo-spinner.{context}
        │   ├── .pixel-logo-container
        │   │   ├── .pixel-text-linera (LINERA text in pixels)
        │   │   ├── .pixel-text-flappy (FLAPPY text in pixels)
        │   │   └── .pixel-blockchain (blockchain animation)
        │   └── ...
        └── .loading-text-container
            ├── .loading-message (ข้อความ loading)
            └── .loading-progress
                └── .progress-dots (8 dots animation)
  ```

##### 2. `show(message, context, container)`
- **หน้าที่**: แสดง loading spinner
- **Parameters**:
  - `message`: ข้อความ loading
  - `context`: context ของ loading
  - `container`: container element (default: document.body)
- **Flow**:
  1. ตรวจสอบว่า spinner กำลังแสดงอยู่หรือไม่
  2. ถ้าแสดงอยู่แล้ว → เรียก `updateMessage()` แทน
  3. ถ้ายังไม่แสดง → สร้าง element ใหม่ด้วย `create()`
  4. Append element ไปยัง container
  5. ใช้ `requestAnimationFrame` เพื่อเพิ่ม class `visible` (fade-in animation)

##### 3. `hide()`
- **หน้าที่**: ซ่อน loading spinner
- **Flow**:
  1. เพิ่ม class `hiding` (fade-out animation)
  2. หลังจาก 300ms → ลบ element ออกจาก DOM
  3. Reset properties

##### 4. `updateMessage(message)`
- **หน้าที่**: อัพเดทข้อความ loading
- **Parameters**: `message` - ข้อความใหม่
- **Flow**:
  1. หา element `#loading-message` ใน DOM
  2. อัพเดท `textContent`

##### 5. `animateProgress(messages, interval)`
- **หน้าที่**: แสดงข้อความ loading แบบต่อเนื่อง
- **Parameters**:
  - `messages`: Array ของข้อความ
  - `interval`: ระยะเวลาระหว่างข้อความ (ms, default: 1500)
- **Flow**: Loop ผ่าน messages และเรียก `updateMessage()` ทีละข้อความ

##### 6. `static show(message, context, container)`
- **หน้าที่**: Static method สำหรับสร้างและแสดง spinner ทันที
- **Returns**: LoadingSpinner instance
- **Usage**: `LoadingSpinner.show("Loading...", "blockchain")`

---

## 🎨 CSS Structure (LoadingSpinner.css)

### Main Container

#### `.linera-loading-overlay`
- **Position**: `fixed` (fullscreen overlay)
- **Background**: `rgba(0, 0, 0, 0.9)` (dark overlay)
- **Z-index**: `10000` (สูงสุด)
- **Initial State**: `opacity: 0` (ซ่อนอยู่)
- **Visible State**: `.visible` class → `opacity: 1`
- **Hiding State**: `.hiding` class → `opacity: 0`
- **Transition**: `opacity 0.2s ease`

#### `.linera-loading-container`
- **Layout**: Flexbox (column, center)
- **Max-width**: 500px
- **Padding**: 2rem

### Pixel Art Logo

#### `.pixel-text-linera` & `.pixel-text-flappy`
- **Animation**: `pixelGlow` (2s infinite alternate)
- **Gap**: 8px between letters
- **Structure**: แต่ละตัวอักษรเป็น `.pixel-letter` → `.pixel-row` → `.pixel`

#### `.pixel`
- **Size**: 8px × 8px (desktop), 6px × 6px (mobile), 5px × 5px (small mobile)
- **States**:
  - `.pixel.on`: สีแดง (#de2a02) + glow effect + `pixelPulse` animation
  - `.pixel.off`: สีดำ (#2a0a05) + inset shadow

#### `.pixel-blockchain`
- **Animation**: `blockchainFloat` (3s infinite)
- **Structure**: 3 blocks + 2 connections

#### `.pixel-block`
- **Animation**: `blockPulse` (2s infinite)
- **Delays**: block-1 (0s), block-2 (0.7s), block-3 (1.4s)

#### `.block-pixel.active`
- **Color**: #de2a02 (red)
- **Animation**: `activePixelPulse` (1s infinite alternate)

#### `.connection-pixel`
- **Size**: 3px × 2px
- **Animation**: `connectionFlow` (1.5s infinite)
- **Delays**: 0s, 0.2s, 0.4s

### Loading Message

#### `.loading-message`
- **Font**: 'Press Start 2P' (monospace)
- **Size**: 0.7rem (desktop), 0.6rem (mobile), 0.55rem (small mobile)
- **Color**: #e2e8f0 (light gray)
- **Animation**: `messageSlide` (0.3s ease)

### Progress Dots

#### `.progress-dots`
- **Layout**: Flexbox (row, center)
- **Gap**: 8px (desktop), 6px (mobile), 5px (small mobile)
- **Max-width**: 300px (desktop), 250px (mobile), 200px (small mobile)

#### `.progress-dots .dot`
- **Size**: 12px × 12px (desktop), 10px × 10px (mobile), 8px × 8px (small mobile)
- **Color**: #de2a02 (red)
- **Animation**: `pixelDotBounce` (1.4s infinite)
- **Delays**: -0.56s, -0.48s, -0.40s, -0.32s, -0.24s, -0.16s, -0.08s, 0s

### Context-Specific Styling

#### `.linera-logo-spinner.{context} .pixel.on`
- **blockchain**: #de2a02 (red)
- **tournament**: #ff3d1a (bright red)
- **score**: #de2a02 (red)
- **leaderboard**: #fbbf24 (yellow)
- **auth**: #ef4444 (red)

---

## 🎬 Animations

### 1. `pixelPulse`
- **Type**: Scale + Brightness
- **Duration**: 1.5s
- **Effect**: Pulsing glow effect

### 2. `pixelGlow`
- **Type**: Brightness + Contrast
- **Duration**: 2s
- **Effect**: Glowing text effect

### 3. `blockchainFloat`
- **Type**: TranslateY
- **Duration**: 3s
- **Effect**: Floating animation

### 4. `blockPulse`
- **Type**: Scale + Brightness
- **Duration**: 2s
- **Effect**: Block pulsing

### 5. `activePixelPulse`
- **Type**: Opacity + Brightness
- **Duration**: 1s
- **Effect**: Active pixel pulsing

### 6. `connectionFlow`
- **Type**: Opacity + ScaleX
- **Duration**: 1.5s
- **Effect**: Connection flow animation

### 7. `titleFlicker`
- **Type**: Opacity + Text-shadow
- **Duration**: 3s
- **Effect**: Title flickering

### 8. `messageSlide`
- **Type**: Opacity + TranslateY
- **Duration**: 0.3s
- **Effect**: Message slide-in

### 9. `pixelDotBounce`
- **Type**: Scale + Brightness
- **Duration**: 1.4s
- **Effect**: Dot bouncing animation

### 10. `scanlines` (Desktop only)
- **Type**: Background position
- **Duration**: 0.1s
- **Effect**: CRT scanlines effect

---

## 📱 Responsive Design

### Mobile (max-width: 768px)
- Pixel size: 8px → 6px
- Block pixel size: 6px → 5px
- Font sizes: ลดลง 20%
- Gaps: ลดลง 25%

### Small Mobile (max-width: 480px)
- Pixel size: 6px → 5px
- Block pixel size: 5px → 4px
- Font sizes: ลดลงอีก 10%
- Gaps: ลดลงอีก 20%

---

## ♿ Accessibility

### High Contrast Mode
- Background: `rgba(0, 0, 0, 0.95)` (darker)
- Text: #ffffff (white)
- Pixel glow: เพิ่มขึ้น

### Reduced Motion
- **Disable animations**: `pixelPulse`, `blockPulse`, `connectionFlow`, `pixelDotBounce`
- **Disable text animations**: `pixelGlow`, `blockchainFloat`, `titleFlicker`
- **Static brightness**: เพิ่ม brightness เป็น 1.2

---

## 🔌 Integration

### Usage in main.js
```javascript
import { Loading } from "./utils/LoadingManager.js";

// Create custom loading
const spinner = Loading.custom("Initializing LINERA FLAPPY...", "blockchain");

// Update message
spinner.updateMessage("Loading Chain...");

// Hide loading
spinner.hide();
```

### Usage via LoadingManager
```javascript
// Blockchain loading
const spinner = await Loading.blockchain();

// Tournament loading
const spinner = Loading.tournament();

// Score submission loading
const spinner = Loading.scoreSubmission("practice");

// Custom loading
const spinner = Loading.custom("Custom message", "context");
```

---

## 🎯 Key Features

1. **Pixel Art Design**: ใช้ pixel-based design สำหรับ retro aesthetic
2. **Context-Aware**: เปลี่ยนสีตาม context (blockchain, tournament, etc.)
3. **Smooth Animations**: หลาย animations ทำงานพร้อมกัน
4. **Responsive**: รองรับ mobile และ desktop
5. **Accessible**: รองรับ high contrast และ reduced motion
6. **Performance**: ใช้ CSS animations แทน JavaScript animations

---

## 📝 Notes

- Loading spinner ใช้ `z-index: 10000` เพื่อแสดงเหนือทุก element
- Initial state เป็น `opacity: 0` และต้องเพิ่ม class `visible` เพื่อแสดง
- Animation delays ถูกคำนวณเพื่อให้เกิด wave effect
- CRT scanlines effect แสดงเฉพาะบน desktop (min-width: 769px)

---

*เอกสารนี้สร้างขึ้นเพื่ออธิบายการทำงานของ LoadingSpinner component ใน branch main*

