# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Testing and Quality
No test framework is currently configured. When adding tests, consider setting up Jest or Vitest.

## Architecture Overview

This is a **client-side only** React application that generates branded news photo cards using the HTML5 Canvas API. No backend server is required - all image processing happens in the browser.

### Core Architecture

**Component Structure:**
- `App.tsx` - Main application container with toolbar and canvas preview
- `Toolbar.tsx` - Central control panel managing all user inputs and state
- Individual components handle specific functionality (`UploadField`, `ResolutionSelector`, etc.)

**Canvas Rendering Pipeline:**
- `useCanvasRenderer.ts` hook manages canvas rendering with DevicePixelRatio support
- `utils/renderer.ts` contains all canvas drawing logic with multiple layout algorithms
- Rendering is fully client-side using Base64-encoded images

**State Management:**
- All state managed through React hooks (no external state library)
- `CardState` interface defines the complete application state
- Real-time canvas updates trigger on any state change

### Key Technical Details

**Layout System:**
The renderer supports 4 distinct layout algorithms in `utils/renderer.ts:129-154`:
- `default` - Classic layout with logo top-right, headline bar bottom
- `facebook-modern` - Logo top-left, semi-transparent overlay box
- `facebook-minimal` - Typography-focused with subtle branding
- `durbin-news` - News-style layout with red background and Bengali date support

**Image Processing:**
- Images automatically downscaled if >2048px width/height to optimize performance
- Cover scaling algorithm maintains aspect ratios while filling containers
- All images converted to Base64 for browser storage

**Canvas Rendering:**
- DevicePixelRatio support for crisp rendering on high-DPI displays
- Text wrapping with ellipsis truncation (max 3 lines)
- Dynamic font sizing based on container dimensions
- Shadow effects for text contrast on various backgrounds

**File Structure:**
- `components/` - React UI components with TypeScript
- `hooks/` - Custom React hooks for image processing and canvas rendering
- `utils/` - Pure utility functions for rendering and export
- `types/` - TypeScript interface definitions

### Key Functions

**Core Rendering (`utils/renderer.ts`):**
- `renderCard()` - Main entry point for canvas rendering at `utils/renderer.ts:64`
- `wrapText()` - Text wrapping with ellipsis at `utils/renderer.ts:3`
- `calculateFontSize()` - Dynamic font sizing at `utils/renderer.ts:45`

**Canvas Management:**
- `useCanvasRenderer.ts` - Main hook handling canvas lifecycle and re-rendering
- Automatic canvas resizing with DevicePixelRatio scaling
- Debounced rendering to optimize performance

**Export Functionality (`utils/exportUtils.ts`):**
- `exportAndDownload()` - Handles file download with format and quality options
- `generateFilename()` - Creates timestamped filenames with slugified headlines

### Development Notes

- The app is completely self-contained with no external API calls
- All image processing happens client-side using Canvas API
- TypeScript strict mode is enabled with comprehensive type definitions
- Uses Tailwind CSS for styling with responsive design
- Font loading via Google Fonts for multi-language support (English/Bengali)