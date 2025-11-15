# Main Branch Documentation - Linera Flappy Game

## 📋 Overview
เอกสารนี้บันทึกโครงสร้าง, UI, และ Logic ของ branch `main` เพื่อใช้เป็นข้อมูลอ้างอิงเมื่อพัฒนา branch `wave2`

---

## 🏗️ Project Structure

```
linera-flappy-game/
├── src/
│   ├── main.js                    # Main game controller (FlappyGame class)
│   ├── game.js                    # Compatibility layer (imports main.js)
│   ├── bird.js                    # Bird class (game entity)
│   ├── pipe.js                    # Pipe class (obstacle)
│   ├── styles.css                 # Main stylesheet (comprehensive UI styles)
│   │
│   ├── auth/
│   │   └── AuthManager.js         # Authentication management
│   │
│   ├── blockchain/
│   │   └── LineraClient.js        # Linera blockchain integration
│   │
│   ├── components/
│   │   ├── LoadingSpinner.js      # Loading spinner component
│   │   └── LoadingSpinner.css     # Loading spinner styles
│   │
│   ├── constants/
│   │   └── GameConstants.js       # All game constants and configs
│   │
│   ├── game/
│   │   ├── GameEngine.js          # Core game loop and mechanics
│   │   └── GameState.js           # Game state management
│   │
│   ├── ui/
│   │   ├── GameUI.js              # UI management and rendering
│   │   └── TournamentModal.js    # Tournament leaderboard modal
│   │
│   └── utils/
│       ├── DOMUtils.js            # DOM utility functions
│       ├── LoadingManager.js      # Loading state management
│       └── TimeUtils.js           # Time calculation utilities
│
├── index.html                     # Main HTML structure
├── package.json                   # Dependencies
└── vite.config.ts                 # Vite configuration
```

---

## 🎮 Core Architecture

### Main Controller: `FlappyGame` (main.js)
- **Entry Point**: Initializes all modules and coordinates game flow
- **Key Responsibilities**:
  - Module initialization (LineraClient, AuthManager, GameEngine, GameState, GameUI)
  - Event handling and callbacks
  - Screen navigation
  - Loading process management
  - Authentication flow
  - Tournament management
  - Score submission

### Game Engine: `GameEngine` (game/GameEngine.js)
- **Core Game Loop**: Uses `requestAnimationFrame` for smooth rendering
- **Game Mechanics**:
  - Bird physics (gravity, jump)
  - Pipe generation and collision detection
  - Score tracking
  - Game over handling
- **Canvas Management**: Handles canvas rendering and scaling

### Game State: `GameState` (game/GameState.js)
- **State Management**: Centralized state with event system
- **Manages**:
  - Player authentication
  - Game mode (practice/tournament)
  - Current screen
  - Leaderboard data
  - Tournament data
  - Practice/tournament scores

### UI Manager: `GameUI` (ui/GameUI.js)
- **UI Rendering**: Handles all UI updates and screen transitions
- **Features**:
  - Screen management
  - Leaderboard rendering
  - Tournament list rendering
  - Mobile optimization
  - Canvas scaling

---

## 🖥️ UI Screens & Flow

### Screen Flow
```
1. Initial Loading Screen
   ↓
2. Auth Screen (if not logged in)
   ↓
3. Mode Selection Screen
   ├─→ Practice Mode → Game Screen
   └─→ Tournament Mode → Tournament List → Game Screen
```

### Screen Details

#### 1. Initial Loading Screen
- **Purpose**: Load assets, connect to blockchain, setup game
- **Steps**:
  1. Load game assets (images)
  2. Initialize Linera client (blockchain connection)
  3. Setup game configuration
- **UI**: Pixel art loading spinner with progress steps

#### 2. Auth Screen
- **Modal**: Centered modal with gradient background
- **Form**: Single form for login/register
  - Discord Username input
  - Password input (with toggle visibility)
  - Login/Register button
- **Features**:
  - Auto-registration for new users
  - Session persistence
  - Password validation (min 6 chars)

#### 3. Mode Selection Screen
- **Layout**: Two large buttons in vertical layout
- **Buttons**:
  - **Practice Mode**: Green button (#4CAF50)
    - Free play
    - Global leaderboard
  - **Tournament Mode**: Orange button (#FF6B35)
    - Time-limited tournaments
    - Tournament leaderboards

#### 4. Tournament List Screen
- **Layout**: Scrollable list of tournament cards
- **Tournament Card**:
  - Tournament name
  - Status (ACTIVE, REGISTRATION, ENDED)
  - Player count
  - Best score
  - Start/End dates
  - Actions: JOIN, VIEW LEADERBOARD
- **Admin Features** (if admin):
  - Pin/unpin tournaments
  - Edit tournament
  - Delete tournament
  - Create tournament button

#### 5. Game Screen
- **Layout**: Two-column layout (desktop) / stacked (mobile)
  - **Left**: Game canvas
  - **Right**: Info panel
    - Current mode indicator
    - Player info (name, role, best, rank)
    - Tournament info (if tournament mode)
    - Leaderboard panel
    - Chain info
- **Game Controls**:
  - START GAME button (initially visible)
  - RESTART button (after game over)
  - Space key or click/tap to jump

---

## 🎨 UI Styling Patterns

### Color Scheme
- **Primary**: Sky blue (#87CEEB)
- **Background**: Gradient (sky blue to cream)
- **Text**: Cream (#FFE4B5)
- **Success**: Green (#4CAF50)
- **Warning**: Orange (#FF6B35)
- **Error**: Red (#E74C3C)
- **Gold**: (#FFD700)

### Typography
- **Font**: 'Press Start 2P' (pixel art font)
- **Sizes**: 8px - 20px (responsive)

### Button Styles
- **3D Effect**: Multiple box-shadows for depth
- **Hover**: Translate up with enhanced shadow
- **Active**: Translate down with reduced shadow
- **Example**:
```css
box-shadow: 
  0 4px 0 #2E7D32, 
  0 8px 0 #1B5E20, 
  0 8px 12px rgba(0,0,0,0.3);
```

### Panel Styles
- **Border**: 3px solid with corner accents
- **Background**: Dark (#2C3E50) with transparency
- **Corner Accents**: Small colored squares at corners

### Modal Styles
- **Backdrop**: Dark overlay with blur
- **Content**: Centered, bordered panel
- **Animation**: Fade in + slide in

---

## 🔐 Authentication Flow

### Login Process
1. User enters username/password
2. Generate SHA-256 hash (username + password + username)
3. Call `lineraClient.loginOrRegister(username, hash)`
4. Get login result from blockchain
5. Store session in localStorage
6. Navigate to mode selection

### Session Management
- **Storage**: localStorage with expiry
- **Re-authentication**: Automatic on page load using stored hash
- **Expiry**: 24 hours

### User Roles
- **Player**: Default role
- **ADMIN**: Can create/edit/delete tournaments, pin tournaments

---

## 🏆 Tournament System

### Tournament States
- **REGISTRATION**: Players can join, but can't play yet
- **ACTIVE**: Tournament is live, players can submit scores
- **ENDED**: Tournament finished

### Tournament Features
- **Creation** (Admin only):
  - Name, description
  - Start/End date/time
  - Duration presets (1hr, 6hr, 1day, 3days, 1week)
- **Joining**: Players join tournaments
- **Scoring**: Scores submitted automatically on game over
- **Leaderboard**: Separate leaderboard per tournament
- **Pinning**: Admins can pin important tournaments

### Tournament Data Structure
```javascript
{
  id: string,
  name: string,
  description: string,
  status: "REGISTRATION" | "ACTIVE" | "ENDED",
  startTime: timestamp,
  endTime: timestamp,
  playerCount: number,
  maxScore: number,
  pinned: boolean,
  createdAt: timestamp
}
```

---

## 🎯 Game Mechanics

### Bird Physics
- **Gravity**: 0.3 per frame
- **Jump Strength**: -6 velocity
- **Max Fall Speed**: 8
- **Starting Position**: x=50, y=256 (center)

### Pipe Generation
- **Spawn Interval**: Every 120 frames
- **Gap**: 140 pixels
- **Speed**: 1.5 pixels per frame
- **Random Height**: Between 50-350 pixels

### Scoring
- **Point**: When bird passes a pipe
- **Best Score**: Tracked separately for practice and tournament modes
- **Submission**: 
  - Practice: Submit on high score
  - Tournament: Submit on ALL game overs (if in tournament)

### Collision Detection
- Bird vs Pipe: Rectangle collision
- Bird vs Ground: Y position check
- Bird vs Top: Y position check

---

## 📱 Mobile Optimization

### Canvas Scaling
- **Base Size**: 288x512 pixels
- **Mobile Scaling**:
  - Max 90% viewport width
  - Max 70% viewport height
  - Max 2.5x multiplier
  - Min 250px width
- **Desktop Scaling**:
  - Max 50% viewport width
  - Max 85% viewport height
  - Max 1.8x multiplier
  - Min 288px width

### Touch Targets
- **Minimum Size**: 44x44px (iOS HIG)
- **Spacing**: Adequate spacing between buttons
- **Touch Events**: Prevent zoom on double-tap

### Responsive Breakpoints
- **Mobile**: ≤ 768px
- **Tablet**: 769px - 1024px
- **Desktop**: > 1024px

### Mobile-Specific Features
- Prevent zoom (viewport meta tag)
- Touch-friendly button sizes
- Stacked layout on mobile
- Larger fonts for readability

---

## 🔗 Blockchain Integration

### Linera Client (`LineraClient.js`)
- **Initialization**: Creates wallet, claims chain from faucet
- **Operations**:
  - `setupGame()`: Setup game on blockchain
  - `loginOrRegister()`: User authentication
  - `submitPracticeScore()`: Submit practice scores
  - `submitTournamentScore()`: Submit tournament scores
  - `getPracticeLeaderboard()`: Get practice leaderboard
  - `getTournamentLeaderboard()`: Get tournament leaderboard
  - `createTournament()`: Create tournament (admin)
  - `joinTournament()`: Join tournament
  - `getTournaments()`: Get all tournaments

### GraphQL Queries
- All blockchain operations use GraphQL
- Queries sent to leaderboard chain URL
- Mutations for state changes
- Queries for data retrieval

---

## 🎬 Key Event Flows

### Game Start Flow
1. User clicks START GAME button
2. `gameEngine.enableGameControls()` called
3. Game loop starts
4. User can jump (space/click)
5. Pipes spawn and move
6. Score increases on pipe pass
7. Game over on collision
8. Score submitted (if high score or tournament)

### Tournament Join Flow
1. User clicks JOIN TOURNAMENT
2. Check if already participant
3. Call `gameState.joinTournament()`
4. If tournament is ACTIVE, enter game screen
5. If REGISTRATION, show message and wait
6. Load tournament leaderboard

### Score Submission Flow
1. Game over triggered
2. Check game mode:
   - **Practice**: Submit if new high score
   - **Tournament**: Submit ALL scores (if in tournament)
3. Update leaderboard
4. Update player's best score
5. Show restart button

---

## 🛠️ Utility Functions

### TimeUtils
- `calculateTimeLeft()`: Calculate time remaining
- `getTournamentStatus()`: Get tournament status
- `formatTournamentDate()`: Format dates for display

### LoadingManager
- `Loading.blockchain()`: Blockchain operations
- `Loading.tournament()`: Tournament operations
- `Loading.scoreSubmission()`: Score submission
- `Loading.custom()`: Custom loading

---

## 📝 Important Notes

### State Management
- GameState uses event system for state changes
- UI updates via event listeners
- Screen transitions managed by GameState

### Error Handling
- Try-catch blocks around blockchain operations
- Fallback to localStorage for development
- User-friendly error messages

### Performance
- Game loop uses requestAnimationFrame
- Canvas scaling via CSS (not context scaling)
- Image loading tracked for readiness

### Security
- Passwords hashed with SHA-256
- No hardcoded credentials
- Session expiry enforced

---

## 🎯 Key Files to Reference for wave2

1. **styles.css**: Complete UI styling (2946 lines)
2. **main.js**: Main game logic (1624 lines)
3. **GameUI.js**: UI management (884 lines)
4. **GameEngine.js**: Game mechanics (354 lines)
5. **GameState.js**: State management (638 lines)
6. **index.html**: HTML structure (347 lines)

---

## 🔄 Migration Checklist for wave2

When fixing wave2 branch, ensure:
- [ ] All screens match main branch layout
- [ ] Button styles match (3D effect, colors)
- [ ] Modal styles match (backdrop, animation)
- [ ] Canvas scaling works on mobile
- [ ] Tournament cards render correctly
- [ ] Leaderboard displays properly
- [ ] Authentication flow works
- [ ] Game mechanics unchanged
- [ ] Mobile optimizations applied
- [ ] Event system functional

---

*Documentation created: Based on main branch code analysis*
*Last updated: Current session*

