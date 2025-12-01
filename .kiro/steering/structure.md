# Project Structure & Architecture

## Folder Organization

```
src/
├── components/          # React UI components
├── hooks/              # Custom React hooks
├── utils/              # Pure utility functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # React entry point
└── index.css           # Global styles + Tailwind imports
```

## Component Architecture

### Core Components
- **App.tsx** - Main container with state management and layout
- **Toolbar.tsx** - Main control panel integrating all settings
- **CanvasPreview.tsx** - Real-time canvas preview with export functionality
- **UploadField.tsx** - File upload with drag-and-drop support

### Specialized Components
- **ResolutionSelector.tsx** - Social media format picker
- **FontSelector.tsx** - Font selection with live preview
- **LayoutSelector.tsx** - Layout style selector
- **ColorPicker.tsx** - Brand color selection with presets

## State Management Pattern

- **Centralized state** in App.tsx using useState
- **CardState interface** defines complete application state
- **Callback-based updates** via handleStateChange
- **Immutable updates** using spread operator
- **No external state management** (Redux/Zustand not needed)

## Custom Hooks Pattern

- **useImage.ts** - Image loading, validation, and preprocessing
- **useCanvasRenderer.ts** - Canvas management and rendering logic
- Hooks encapsulate complex logic and provide clean APIs
- Return objects with data and handler functions

## Utility Functions

- **renderer.ts** - Core canvas rendering functions
  - `renderCard()` - Main rendering function
  - `wrapText()` - Text wrapping with ellipsis
  - `calculateFontSize()` - Dynamic font sizing
- **exportUtils.ts** - File export utilities
  - `generateFilename()` - Timestamped filename generation
  - `exportAndDownload()` - File download handling
  - `slugify()` - Text slugification

## Type System

- **Centralized types** in `src/types/index.ts`
- **Interface-based** type definitions
- **Strict typing** for all props and state
- **Export interfaces** for reusability across components

## File Naming Conventions

- **PascalCase** for React components (`CanvasPreview.tsx`)
- **camelCase** for hooks (`useCanvasRenderer.ts`)
- **camelCase** for utilities (`exportUtils.ts`)
- **kebab-case** for generated filenames (`news-headline-20241201.png`)

## Import/Export Patterns

- **Named exports** for utilities and hooks
- **Default exports** for React components
- **Barrel exports** from types/index.ts
- **Relative imports** within src/ directory