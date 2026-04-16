# Wraeclast Cards

## Setup

This project is built with:

- Vite
- React
- TypeScript

## Styling

Styling is handled using:

- Tailwind CSS
- daisyUI

### Default theme

The default daisyUI theme is: **light**

## Development

Run the project:

```bash
pnpm install
pnpm dev
```

## Code Quality

This project uses Biome for linting and formatting.

Run checks:

```bash
pnpm check
```

## Project Structure

This project follows a structure inspired by Bulletproof React, adapted for this codebase.

```text
src/
  app/
  components/
  config/
  features/
  lib/
  routes/
  types/

content/
docs/
```

## Git Hooks

This project uses Lefthook to run Biome checks on staged files before each commit.

### Pre-commit behavior

Before each commit, Lefthook runs Biome on staged files to:

- format files automatically
- apply safe fixes where possible
- block the commit if errors remain

If hooks are not installed yet, run:

```bash
pnpm lefthook install
```
