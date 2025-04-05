# 🐤 Slappy Bird

A fun and challenging twist on the classic Flappy Bird game, where you not only navigate through pipes but also slap emoji faces to earn points! Built with React and TypeScript.

## 🎮 Play Now!

Try the game live at: [Slappy Bird Demo](https://slappy-bird-olxg03atw-anjaleenarens-projects.vercel.app)

https://github.com/user-attachments/assets/3586dabe-6762-4de3-85ae-cebe26f0525d

## 🎮 Game Features

- **Classic Flappy Bird Mechanics**: Navigate through pipes by jumping
- **Unique Slapping Mechanic**: Slap emoji faces to earn extra points
- **Progressive Difficulty**: Game speed increases and pipe gaps narrow as your score rises
- **High Score System**: Local storage-based high score tracking
- **Responsive Design**: Playable on both desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/slappy-bird.git
cd slappy-bird
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play!

## 🎯 How to Play

### Controls
- Press `Space` or `↑` to make the bird jump
- Click/tap the game area to jump
- The bird automatically moves forward

### Objectives
- Navigate through the green pipes without hitting them
- Slap the emoji faces (😮, 😯, etc.) to earn points
- Try to beat your high score!

### Game Mechanics
- Your bird (🐤) turns into a fist (✊) when slapping faces
- Game speed increases as your score goes up
- Gaps between pipes get smaller at higher scores
- Game ends if you hit pipes or touch the ground/ceiling

## 🛠️ Technical Details

### Built With
- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety and better developer experience
- [Tailwind CSS](https://tailwindcss.com/) - Styling and responsive design

### Key Features Implementation
- **Game Loop**: RequestAnimationFrame for smooth animations
- **Collision Detection**: Precise hitbox calculations for pipes and faces
- **State Management**: React useState and useEffect for game state
- **Local Storage**: Persistent high score tracking
- **Responsive Design**: Playable on various screen sizes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎨 Customization

You can customize various game parameters in `src/components/Game.tsx`:

```typescript
const GRAVITY = 0.8;
const JUMP_FORCE = -10;
const INITIAL_PIPE_SPEED = 5;
const INITIAL_PIPE_GAP = 150;
const MIN_PIPE_GAP = 100;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const GAME_HEIGHT = 500;
```
