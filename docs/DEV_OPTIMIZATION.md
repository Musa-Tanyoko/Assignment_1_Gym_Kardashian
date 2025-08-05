# Development Optimization Guide

## Current Issue
The `pnpm run dev` command is taking too long because it's building the UI package every time, which includes TypeScript compilation and DTS generation.

## Available Development Commands

### 1. Standard Development (Current)
```bash
pnpm run dev
```
- Builds all packages including UI components
- Includes TypeScript DTS generation
- Slower startup time (~8-10 seconds)

### 2. Fast Development (Recommended)
```bash
pnpm run dev:fast
```
- Only runs the web app in development mode
- Uses pre-built UI components
- Much faster startup time (~2-3 seconds)
- Best for most development work

### 3. UI Development Only
```bash
pnpm run dev:ui
```
- Only builds and watches UI components
- Use when working on UI components specifically

## Optimization Strategies

### Option 1: Use Fast Development Mode
For most development work, use:
```bash
pnpm run dev:fast
```

This will start the web app much faster since it doesn't rebuild the UI package every time.

### Option 2: Pre-build UI Package
If you need the full development experience, you can pre-build the UI package:
```bash
# Build UI package once
pnpm run build --filter=@fitness-app/ui

# Then run dev normally
pnpm run dev
```

### Option 3: Use UI Fast Mode
For UI development with faster builds:
```bash
pnpm run dev:ui
```

## Performance Comparison

| Command | Startup Time | Use Case |
|---------|-------------|----------|
| `pnpm run dev` | ~8-10 seconds | Full development with all features |
| `pnpm run dev:fast` | ~2-3 seconds | Web app development (recommended) |
| `pnpm run dev:ui` | ~3-4 seconds | UI component development |

## Recommendations

1. **For web app development**: Use `pnpm run dev:fast`
2. **For UI component development**: Use `pnpm run dev:ui`
3. **For full development**: Use `pnpm run dev` but pre-build UI first

## Troubleshooting

If you encounter issues with the fast development mode:
1. Make sure the UI package is built: `pnpm run build --filter=@fitness-app/ui`
2. Check that all dependencies are installed: `pnpm install`
3. Clear cache if needed: `pnpm run clean`

## Future Optimizations

Consider these additional optimizations:
1. Use SWC instead of Babel for faster compilation
2. Implement incremental builds
3. Use module federation for better caching 