# Nx Integration for NuralyUI

This document explains the Nx setup for the NuralyUI monorepo and how to use it.

## What is Nx?

Nx is a powerful build system with first-class monorepo support. It provides:

- **Smart Caching**: Never rebuild the same code twice
- **Dependency Graph**: Understand your project structure
- **Affected Commands**: Only build/test what changed
- **Task Orchestration**: Run tasks in the right order automatically
- **Parallel Execution**: Run independent tasks simultaneously

## Setup Overview

The NuralyUI workspace now uses Nx to manage builds across:
- 4 main packages: `@nuralyui/common`, `@nuralyui/forms`, `@nuralyui/layout`, `@nuralyui/themes`
- Root workspace compilation and tasks

## Key Files

- `nx.json` - Nx workspace configuration
- `project.json` - Root workspace project configuration
- `packages/*/project.json` - Package-level project configurations
- `.nxignore` - Files to exclude from Nx file watching

## Common Commands

### Building

```bash
# Build all packages
nx run @nuralyui/workspace:build

# Build a specific package
nx run @nuralyui/common:build
nx run @nuralyui/forms:build
nx run @nuralyui/layout:build
nx run @nuralyui/themes:build

# Build multiple packages
nx run-many -t build --projects=@nuralyui/forms,@nuralyui/layout

# Build all packages in parallel
nx run-many -t build --all
```

### Testing

```bash
# Run tests
nx run @nuralyui/workspace:test

# Run tests in watch mode
nx run @nuralyui/workspace:test:watch
```

### Linting

```bash
# Run linters
nx run @nuralyui/workspace:lint
```

### Storybook

```bash
# Start Storybook dev server
nx run @nuralyui/workspace:storybook

# Build Storybook
nx run @nuralyui/workspace:build-storybook
```

### Compilation

```bash
# Compile TypeScript for workspace
nx run @nuralyui/workspace:compile

# Compile common package
nx run @nuralyui/common:compile
```

## Caching

Nx automatically caches task outputs. When you run a build:

1. **First run**: Nx executes the task and caches the output
2. **Subsequent runs**: If inputs haven't changed, Nx retrieves from cache

You'll see `[local cache]` next to tasks that were restored from cache.

### Clear Cache

```bash
# Clear Nx cache
nx reset
```

### Skip Cache

```bash
# Force rebuild without using cache
nx run @nuralyui/common:build --skip-nx-cache
```

## Dependency Graph

Visualize your project's dependency structure:

```bash
# Generate and open dependency graph
nx graph
```

This creates an interactive HTML visualization showing:
- Which packages depend on each other
- Task dependencies
- Build order

## Affected Commands

Only build/test what changed since a base commit:

```bash
# Build only affected projects
nx affected -t build

# Test only affected projects
nx affected -t test

# Lint only affected projects
nx affected -t lint
```

## Build Flow

The build process follows this dependency chain:

1. **@nuralyui/common:compile** - Compiles packages/common TypeScript
2. **@nuralyui/workspace:compile** - Compiles src/ TypeScript (depends on common:compile)
3. **@nuralyui/common:build** - Builds common package
4. **@nuralyui/themes:build** - Builds themes (independent)
5. **@nuralyui/forms:build** - Builds forms (depends on workspace:compile, common:build)
6. **@nuralyui/layout:build** - Builds layout (depends on workspace:compile, common:build)

Nx ensures these run in the correct order and in parallel where possible.

## Performance Benefits

### Before Nx
- Manual build orchestration via npm scripts
- No caching - always rebuild everything
- Sequential builds
- No way to know what's affected by changes

### With Nx
- Automatic dependency resolution
- Local computation caching (60-80% faster rebuilds)
- Parallel task execution
- Smart `affected` commands
- Dependency graph visualization
- Ready for Nx Cloud (distributed caching)

## Configuration Details

### Target Defaults (nx.json)

All build targets are configured to:
- Cache outputs automatically
- Depend on upstream builds (`^build`)
- Include production files only (excludes tests, stories, etc.)

### Project Structure

Each package has a `project.json` defining:
- **name**: Package identifier
- **sourceRoot**: Where source files live
- **targets**: Available commands (build, test, lint, etc.)
- **tags**: Organizational metadata

## Future Enhancements

Consider adding:
- **Nx Cloud**: Distributed caching across team/CI
- **Generators**: Scaffolding for new components
- **Executors**: Custom build tools
- **Module boundaries**: Enforce architectural constraints

## Troubleshooting

### Build fails after Nx setup

Run a clean build:
```bash
rm -rf dist
nx reset
nx run @nuralyui/workspace:build
```

### Cache issues

Clear the cache and rebuild:
```bash
nx reset
```

### Dependencies not building in order

Check `dependsOn` in `project.json` files to ensure correct dependency chain.

## Migration Notes

### Changes Made

1. Added Nx dependencies to package.json
2. Created nx.json for workspace configuration
3. Added project.json for each package
4. Fixed TypeScript import issue in iconpicker/react.ts
5. Added symlink in compile task (dist/components → dist/src/components)
6. Configured caching for build, test, and lint tasks

### Backward Compatibility

The original npm scripts still work:
```bash
npm run build
npm run test
npm run lint
```

But using Nx directly provides better performance and features.
