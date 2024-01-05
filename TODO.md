# Scaffolding

- ESLint config
- CI/CD
- Itch.io

# Prototype: Cut the grass

- Move grassTimer to state
- Keep grid centered on screen
- Scale expand requirements by current level
- Unit tests for expand
- Unit tests for generateGameTiles
- Move setGrassTimer(Math.max(100, grassTimer \* GRASS_GROW_TIMER_REDUCTION)); to state management as 'reduceTimer' util

# Engine stuff

- Make game-state logic into headless components (e.g. useGameOverState, useInGameState, etc);

## Out of scope:

- Sprite images
- Loading progress
- Sound
- Keyboard input
- Animation
