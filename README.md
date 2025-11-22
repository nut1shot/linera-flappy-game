# 🎮 Linera Flappy - Game Frontend

A pixel-art Flappy Bird game with blockchain integration built on microchain [Linera blockchain](https://linera.dev)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Configure environment
.env
# Edit .env with your blockchain credentials

# Start development server
pnpm dev

# Build for production
pnpm build
```

## ✨ Features

### Game Modes

- **Practice Mode**: Free play with global top 100 leaderboard
- **Tournament Mode**: Time-limited competitive events with live rankings

### Anti-Cheat System

- **Proof-of-Play**: Every game session verified on blockchain
- **Session Tracking**: Jump count, timing, and score validation
- **Proof History**: View all verified game sessions with status badges
- **Filter System**: Filter proofs by status (Accepted/Rejected/Pending) and mode (Practice/Tournament)

### UI/UX

- **Pixel Art Design**: Retro gaming aesthetic with Press Start 2P font
- **Loading Spinners**: Context-aware loading for all blockchain operations
- **Mobile Responsive**: Full mobile support with touch controls
- **Info Overlay**: Leaderboards, tournaments, proof history, and chain info

## 🎯 How to Play

1. **Login/Register**: Authenticate with username and password
2. **Start Game**: Click "Start" to begin a verified session
3. **Controls**: Tap screen, click mouse, or press SPACE to flap
4. **Avoid Pipes**: Navigate through gaps to score points
5. **Submit Score**: Game automatically submits verified proof on game over

## 🏗 Architecture

```
src/
├── main.js                   # Application orchestration
├── game/
│   ├── GameEngine.js        # Core game loop & rendering
│   └── GameState.js         # State management
├── ui/
│   ├── GameUI.js            # DOM manipulation
│   ├── TournamentModal.js   # Tournament interface
│   └── ProofHistoryModal.js # Proof verification UI
├── auth/
│   └── AuthManager.js       # User authentication
├── blockchain/
│   └── LineraClient.js      # Blockchain operations
├── components/
│   └── LoadingSpinner/      # Custom loading UI
├── constants/
│   └── GameConstants.js     # Configuration
└── utils/
    ├── LoadingManager.js    # Loading state management
    ├── TimeUtils.js         # Time formatting
    └── DOMUtils.js          # DOM helpers
```

## 🔐 Authentication

- **Secure Hashing**: SHA-256 with salt for passwords
- **Session Management**: Persistent sessions with auto-expiration
- **Role-Based Access**: Admin and Player roles
- **Blockchain Sessions**: Linked to Linera chain IDs

## 🎨 Proof History

View and filter all your verified game sessions:

- **Status Filters**: All / Accepted / Rejected / Pending
- **Mode Filters**: All Modes / Practice / Tournament
- **Detailed Info**: Score, pipes, jumps, duration, timestamps
- **Rejection Reasons**: See why proofs were rejected (if applicable)

## 📊 Leaderboards

### Practice Leaderboard

- Top 100 global players
- Real-time rank updates
- Personal best tracking

### Tournament Leaderboards

- Live rankings during tournaments
- Historical tournament results
- Participant tracking

## ⚙️ Configuration

### Environment Variables (.env)

```env
VITE_APP_ID=<your-app-id>
VITE_APP_URL=http://localhost:8079
VITE_LEADERBOARD_CHAIN_ID=<leaderboard-chain-id>
VITE_LEADERBOARD_CHAIN_URL=http://localhost:8080
```

### Game Constants

Customize in `src/constants/GameConstants.js`:

- Canvas dimensions
- Bird physics (gravity, jump force)
- Pipe spawn rate and gaps
- Audio settings

## 🛠 Tech Stack

- **Frontend**: Vanilla JavaScript (ESM)
- **Build Tool**: Vite 6
- **Blockchain**: Linera WebAssembly Client
- **Rendering**: HTML5 Canvas API
- **Styling**: Custom CSS with retro pixel art theme
- **Package Manager**: pnpm

## 🎮 Game Constants

```javascript
CANVAS: { BASE_WIDTH: 320, BASE_HEIGHT: 480 }
BIRD: { SIZE: 30, GRAVITY: 0.5, JUMP_FORCE: -8 }
PIPES: { WIDTH: 50, GAP: 120, SPAWN_INTERVAL: 90 }
AUDIO: { ENABLED: true, VOLUME: 0.5 }
```

## 📱 Mobile Support

- Responsive canvas scaling
- Touch controls for flapping
- Mobile-optimized UI layout
- Viewport meta tags for proper rendering

## 🚀 Deployment

### Production Build

```bash
pnpm build
```

### Deploy to Vercel (Recommended)

**Quick Deploy:**
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Required Environment Variables:**
```env
VITE_APP_ID=your_app_id
VITE_APP_URL=your_app_url
VITE_LEADERBOARD_CHAIN_ID=your_chain_id
VITE_LEADERBOARD_CHAIN_URL=your_chain_url
```

**📚 Complete Guide:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions

### Deploy to Netlify

```bash
# Build output in dist/
# Add environment variables in Netlify dashboard
# Use same VITE_* variables as Vercel
```

## 🎨 Customization

### Add New Bird Sprites

1. Place sprite in `public/assets/`
2. Update `src/bird.js` with new sprite paths
3. Adjust `BIRD_CONFIG` in `GameConstants.js`

### Modify Validation Rules

Edit smart contract in `linera-flappy` repo:

- `src/contract.rs` - Validation logic
- Rebuild and redeploy contract

## 📝 Scripts

```bash
pnpm dev       # Development server (port 5173)
pnpm build     # Production build
pnpm preview   # Preview production build
pnpm ci        # CI build with frozen lockfile
```

## 🔗 Links

- **Smart Contract**: [linera-flappy](https://github.com/nut1shot/linera-flappyy)
- **Linera Docs**: [linera.dev/developers](https://linera.dev/developers)
- **Game Demo**: [linera-flappy-game.vercel.app](https://linera-flappy-game.vercel.app)

## 📝 License

MIT License

---

**Built with**: [Linera Protocol](https://linera.dev) | **Author**: [@nut1shot](https://github.com/nut1shot)
