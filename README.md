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

## App Providers

The app uses:

- TanStack Router for routing
- TanStack Query for server-state management

The root app providers are defined in `src/app/providers.tsx`.
The router bootstrap lives in `src/router.tsx`.

## Architecture

This project follows a structure inspired by [bulletproof-react](https://github.com/alan2207/bulletproof-react), adapted to the needs of this codebase.

The goal is to keep the project predictable and easy to navigate, especially for new contributors.

### Core stack

- **TanStack Router** for routing
- **TanStack Query** for server-state management
- **Biome** for formatting and linting

### Project structure

```text
src/
  app/         # app-level setup, providers, bootstrap
  components/  # shared and reusable UI components
  config/      # app configuration and constants
  features/    # domain-specific feature modules
  lib/         # shared utilities and technical helpers
  routes/      # route definitions and routing-related files
  types/       # shared TypeScript types

content/       # static markdown or content files
docs/          # internal project documentation
```

## Responsibilities

### `src/app`

Contains app-level wiring and bootstrap code.

Examples:

- app providers
- router and query setup
- top-level app entry composition

### `src/components`

Contains shared UI components used across multiple features.

Examples:

- buttons
- cards
- layout primitives
- shared form UI

### `src/features`

Contains domain-specific logic grouped by feature.

Each feature should keep its own UI, hooks, state, and business logic together.

Examples:

- `src/features/cards`
- `src/features/auth`
- `src/features/search`

### `src/lib`

Contains shared utilities and technical helpers not tied to a single feature.

Examples:

- utility functions
- formatters
- API helpers
- shared helper modules

### `src/routes`

Contains route-related files and routing bootstrap.

### `src/config`

Contains configuration, constants, and environment setup.

### `src/types`

Contains shared TypeScript types used across the app.

### `content`

Contains static markdown or content files outside of the app code.

### `docs`

Contains internal project documentation.

## Architecture Rules

### Placement rules

- Put shared UI in `src/components`
- Put shared utilities in `src/lib`
- Put domain logic in `src/features/<feature-name>`
- Put static markdown content under `content`

### Import boundary rules

- `features` may import from `components`, `lib`, `config`, and `types`
- `components` must **not** import from `features`
- Shared code must **not** depend on feature-specific code

### Data and API rules

- API code must **not** live inside UI components
- Server-state management should use **TanStack Query**
- Routing should use **TanStack Router**
- Do **not** introduce `react-router-dom`

### Tooling rules

- Formatting and linting are handled by **Biome**
- Do **not** introduce **ESLint**
- Do **not** introduce **Prettier**

### General guidance

- Keep app-level setup in `src/app`
- Keep features isolated and cohesive
- Prefer small, reusable shared components over duplicated UI
- Avoid placing new code in random top-level files under `src`

## UI Components

This project uses the `@navali/fated-connections` package.

Example:

```tsx
import { Button } from "@navali/fated-connections";
```
