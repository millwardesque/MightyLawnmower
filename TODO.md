# Scaffolding

- ESLint config

# Bugs

- Clicking the very right/bottom edge of the grid computes a cell that doesn't exist
- Grass-grower doesn't reset timer when game restarts.

# Prototype: Cut the grass

- Trigger Game Over state when all patches are overgrown
- Clicking dirt exposes lava, which can't grow again
- Expand grid size over time (every 10 points?)
- Start game state

# Engine stuff

- Refactor GameCanvas to Game / GameGrid components and logic
- Separate game states into separate game state components
- Probably state manager

## Out of scope:

- Sprite images
- Loading progress
- Sound
- Keyboard input
- Animation
