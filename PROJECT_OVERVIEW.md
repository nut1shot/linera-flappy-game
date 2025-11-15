# Linera Flappy Game - ภาพรวมโปรเจกต์

## 📋 ข้อมูลทั่วไป

**Linera Flappy Game** เป็นเกม Flappy Bird ที่ทำงานบน Linera Blockchain โดยมีฟีเจอร์:
- เกม Flappy Bird แบบคลาสสิก
- การเชื่อมต่อกับ Linera Blockchain สำหรับเก็บคะแนนและ leaderboard
- ระบบ Authentication (Login/Register)
- โหมด Practice และ Tournament
- ระบบ Leaderboard แบบ real-time
- รองรับ Mobile และ Desktop

## 🏗️ สถาปัตยกรรมโปรเจกต์

### โครงสร้างไฟล์หลัก

```
linera-flappy-game/
├── src/
│   ├── main.js              # Entry point หลัก - FlappyGame class
│   ├── game.js              # Compatibility layer
│   │
│   ├── game/                # Game Logic
│   │   ├── GameEngine.js    # เกม engine, game loop, physics
│   │   └── GameState.js     # State management, events
│   │
│   ├── blockchain/         # Blockchain Integration
│   │   └── LineraClient.js  # Linera blockchain client
│   │
│   ├── auth/               # Authentication
│   │   └── AuthManager.js   # Login, Register, Session management
│   │
│   ├── ui/                 # UI Management
│   │   ├── GameUI.js       # UI controller
│   │   └── TournamentModal.js
│   │
│   ├── components/         # UI Components (Component-based)
│   │   ├── AuthModal/
│   │   ├── ModeSelection/
│   │   ├── TournamentCreation/
│   │   ├── TournamentList/
│   │   ├── PlayerInfo/
│   │   ├── LeaderboardPanel/
│   │   ├── TournamentInfo/
│   │   └── TournamentLeaderboardModal/
│   │
│   ├── constants/          # Configuration
│   │   └── GameConstants.js # Game config, constants
│   │
│   ├── utils/              # Utilities
│   │   ├── DOMUtils.js
│   │   ├── LoadingManager.js
│   │   └── TimeUtils.js
│   │
│   ├── styles/             # CSS Styles
│   │   ├── base.css
│   │   ├── game.css
│   │   ├── utilities.css
│   │   └── variables.css
│   │
│   ├── bird.js            # Bird class
│   └── pipe.js            # Pipe class
│
├── public/                # Static assets
│   ├── assets/           # Images, sounds
│   └── js/               # Linera client library
│
├── index.html            # HTML entry point
├── package.json          # Dependencies
└── vite.config.ts       # Vite configuration
```

## 🔑 คลาสหลัก

### 1. **FlappyGame** (`src/main.js`)
คลาสหลักที่จัดการทุกอย่าง:
- เริ่มต้นระบบทั้งหมด
- จัดการ lifecycle ของแอป
- เชื่อมต่อระหว่าง components
- จัดการ authentication flow
- จัดการ game modes (Practice/Tournament)

**หน้าที่หลัก:**
- `initialize()` - เริ่มต้นแอป
- `startLoadingProcess()` - โหลด assets และเชื่อมต่อ blockchain
- `handleLogin()` / `handleRegister()` - จัดการ authentication
- `selectPracticeMode()` / `selectTournamentMode()` - เปลี่ยนโหมดเกม
- `startGame()` / `restartGame()` - เริ่ม/เริ่มใหม่เกม
- `submitScoreToLeaderboard()` - ส่งคะแนนไปยัง blockchain

### 2. **GameEngine** (`src/game/GameEngine.js`)
จัดการเกม logic:
- Game loop (requestAnimationFrame)
- Physics (gravity, collision)
- Rendering (canvas drawing)
- Bird และ Pipe management
- Score calculation

**หน้าที่หลัก:**
- `startGameLoop()` - เริ่ม game loop
- `stopGameLoop()` - หยุด game loop
- `handleJump()` - จัดการการกระโดด
- `update()` - อัพเดท game state
- `draw()` - วาดเกมบน canvas

### 3. **GameState** (`src/game/GameState.js`)
จัดการ state ของแอป:
- Player information
- Authentication state
- Game mode (Practice/Tournament)
- Leaderboard data
- Tournament data
- Event system (screenChange, modeChange, etc.)

**หน้าที่หลัก:**
- `setCurrentScreen()` - เปลี่ยนหน้าจอ
- `setGameMode()` - เปลี่ยนโหมดเกม
- `setAuthenticatedUser()` - ตั้งค่า user ที่ login
- `setLeaderboard()` - อัพเดท leaderboard
- Event listeners สำหรับ component communication

### 4. **LineraClient** (`src/blockchain/LineraClient.js`)
เชื่อมต่อกับ Linera Blockchain:
- สร้าง wallet และ chain
- ส่งคะแนนไปยัง blockchain
- ดึง leaderboard
- จัดการ tournaments
- Authentication operations

**หน้าที่หลัก:**
- `initialize()` - เชื่อมต่อ blockchain
- `setupGame()` - ตั้งค่าเกมบน blockchain
- `submitScore()` - ส่งคะแนน
- `getLeaderboard()` - ดึง leaderboard
- `submitPracticeScore()` / `submitTournamentScore()` - ส่งคะแนนตามโหมด
- `loginOrRegister()` - Login/Register บน blockchain

### 5. **AuthManager** (`src/auth/AuthManager.js`)
จัดการ authentication:
- Login/Register
- Session management
- Password hashing
- User validation

**หน้าที่หลัก:**
- `login()` - Login user
- `logout()` - Logout user
- `loadSession()` - โหลด session จาก localStorage
- `isSessionValid()` - ตรวจสอบ session

### 6. **GameUI** (`src/ui/GameUI.js`)
จัดการ UI:
- แสดง/ซ่อน screens
- อัพเดท UI elements
- จัดการ canvas scaling
- Component coordination

## 🎮 Game Flow

### 1. **Initialization Flow**
```
1. Load game assets (images, sounds)
2. Connect to Linera blockchain
3. Setup game configuration
4. Check existing session
   - ถ้ามี session → ไปที่ mode selection
   - ถ้าไม่มี → แสดง auth screen
```

### 2. **Authentication Flow**
```
1. User กรอก username/password
2. AuthManager สร้าง hash
3. LineraClient ส่งไปยัง blockchain (loginOrRegister)
4. Blockchain สร้าง/verify user
5. เก็บ session ใน localStorage
6. Setup blockchain game
7. ไปที่ mode selection screen
```

### 3. **Game Modes**

#### **Practice Mode**
- เล่นเกมแบบอิสระ
- คะแนนจะถูกส่งไปยัง Practice Leaderboard
- ไม่มีเวลา限制

#### **Tournament Mode**
- เลือก tournament จากรายการ
- Join tournament
- เล่นเกมใน tournament
- คะแนนจะถูกส่งไปยัง Tournament Leaderboard
- มีเวลาเริ่มต้นและสิ้นสุด

### 4. **Gameplay Flow**
```
1. User กด START GAME
2. GameEngine เริ่ม game loop
3. User กด space/click เพื่อกระโดด
4. Bird ชน pipe หรือพื้น → Game Over
5. ส่งคะแนนไปยัง blockchain (ถ้าเป็น high score หรือ tournament)
6. อัพเดท leaderboard
7. แสดง restart button
```

## 🔧 Configuration

### Environment Variables (`.env`)
```env
VITE_APP_URL=<Linera service URL>
VITE_APP_ID=<Application ID>
VITE_LEADERBOARD_CHAIN_ID=<Leaderboard chain ID>
VITE_LEADERBOARD_CHAIN_URL=<Leaderboard chain URL>
```

### Game Constants (`src/constants/GameConstants.js`)
- `GAME_CONFIG` - การตั้งค่าเกม (canvas, bird, pipes)
- `AUTH_CONFIG` - การตั้งค่า authentication
- `TOURNAMENT_CONFIG` - การตั้งค่า tournament
- `BLOCKCHAIN_CONFIG` - การตั้งค่า blockchain

## 📦 Dependencies

```json
{
  "@linera/client": "0.15.5",    // Linera blockchain client
  "@linera/signer": "0.15.5",   // Linera signing
  "ethers": "^6.15.0"           // Ethereum utilities
}
```

## 🎨 UI Components

โปรเจกต์ใช้ **Component-based architecture**:

1. **AuthModal** - Modal สำหรับ login/register
2. **ModeSelection** - เลือกโหมด (Practice/Tournament)
3. **TournamentList** - รายการ tournaments
4. **TournamentCreation** - สร้าง tournament (Admin only)
5. **PlayerInfo** - ข้อมูลผู้เล่น
6. **LeaderboardPanel** - แสดง leaderboard
7. **TournamentInfo** - ข้อมูล tournament ปัจจุบัน
8. **TournamentLeaderboardModal** - Modal แสดง tournament leaderboard

แต่ละ component มี:
- `.js` file - Component logic
- `.css` file - Component styles

## 🔄 Event System

GameState ใช้ Event-driven architecture:

```javascript
// Listen to events
gameState.addEventListener("screenChange", (data) => {
  // Handle screen change
});

gameState.addEventListener("modeChange", (data) => {
  // Handle mode change
});

// Emit events
gameState.setCurrentScreen("game-screen"); // Triggers screenChange event
```

## 🚀 การรันโปรเจกต์

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## 📝 สิ่งที่ควรรู้

1. **Blockchain Integration**: เกมใช้ Linera blockchain สำหรับเก็บข้อมูลทั้งหมด (scores, leaderboard, tournaments)

2. **Session Management**: Session ถูกเก็บใน localStorage และมี expiry time (24 hours)

3. **Mobile Support**: รองรับ mobile ด้วย canvas scaling และ touch controls

4. **Admin Role**: มี role "ADMIN" สำหรับสร้าง/แก้ไข/ลบ tournaments

5. **Component Communication**: Components สื่อสารผ่าน callbacks และ events

6. **Loading States**: มี loading spinners สำหรับ async operations (blockchain calls)

## 🔍 จุดสำคัญในการแก้ไข/เพิ่มฟีเจอร์

- **Game Logic**: `src/game/GameEngine.js`
- **State Management**: `src/game/GameState.js`
- **Blockchain Operations**: `src/blockchain/LineraClient.js`
- **UI Components**: `src/components/`
- **Game Configuration**: `src/constants/GameConstants.js`
- **Main Flow**: `src/main.js` (FlappyGame class)

