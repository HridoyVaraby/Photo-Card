# Technology Stack & Build System

## Core Technologies

- **React 18** - UI framework with hooks-based architecture
- **TypeScript** - Strict type safety throughout codebase
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **HTML5 Canvas API** - Image rendering and composition

## Development Dependencies

- **ESLint** - Code linting with TypeScript support
- **PostCSS & Autoprefixer** - CSS processing
- **@vitejs/plugin-react** - React integration for Vite

## Common Commands

```bash
# Development
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build
npm run lint         # Run ESLint with TypeScript rules

# Installation
npm install          # Install all dependencies
```

## Code Style & Linting

- ESLint configuration extends recommended TypeScript rules
- React Refresh plugin for hot module replacement
- Strict TypeScript mode enabled
- Browser and ES2020 environment targets
- Zero tolerance for linting warnings in build process

## Font Integration

- Google Fonts API for web font loading
- Supported fonts: Inter, Montserrat, Noto Sans Bengali, Hind Siliguri
- Dynamic font loading for multilingual support

## Canvas Rendering

- DevicePixelRatio support for high-DPI displays
- Client-side image processing and composition
- Base64 encoding for browser-based file handling
- Maximum 10MB file size limit with automatic downscaling

## Build Configuration

- Vite server configured for host access on port 5173
- TypeScript strict mode with comprehensive type checking
- Tailwind CSS configured for all HTML and React files
- Production builds include TypeScript compilation step