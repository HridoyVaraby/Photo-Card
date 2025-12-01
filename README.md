# News Photo Card Generator

A modern web application for creating branded news photo cards perfect for social media sharing. Built with React, TypeScript, Vite, and Canvas API - completely browser-based with no backend required.

## Features

- **🖼️ Image Upload**: Upload main news image and optional company logo
- **📝 Custom Headlines**: Add text with support for English and Bengali languages
- **🎨 Brand Customization**: Choose colors, fonts, and layouts
- **📱 Multiple Resolutions**:
  - Twitter Card (1200×628)
  - Instagram Square (1080×1080)
  - Instagram Story (1080×1920)
- **📥 Export Options**: Download as PNG or JPEG with quality control
- **🔤 Font Support**: Inter, Montserrat, Noto Sans Bengali, Hind Siliguri
- **🎯 Live Preview**: Real-time canvas preview with DevicePixelRatio support
- **📱 Responsive Design**: Mobile-friendly interface

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **HTML5 Canvas API** - Image rendering and export
- **ESLint** - Code linting

## Installation

### Prerequisites

- Node.js 16+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd photo-card
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/           # React components
│   ├── UploadField.tsx  # File upload with drag & drop
│   ├── CanvasPreview.tsx # Live canvas preview
│   ├── Toolbar.tsx      # Main control panel
│   ├── ResolutionSelector.tsx  # Resolution picker
│   ├── FontSelector.tsx  # Font selection
│   └── ColorPicker.tsx   # Color picker with presets
├── hooks/               # Custom React hooks
│   ├── useImage.ts      # Image loading and validation
│   └── useCanvasRenderer.ts  # Canvas management
├── utils/               # Utility functions
│   ├── renderer.ts      # Canvas rendering functions
│   └── exportUtils.ts   # File export utilities
├── types/               # TypeScript type definitions
│   └── index.ts         # All type definitions
├── App.tsx              # Main application component
├── main.tsx             # React entry point
└── index.css            # Global styles and Tailwind
```

## Components Overview

### Core Components

1. **UploadField** - Handles file uploads with drag-and-drop support, validation, and preview
2. **CanvasPreview** - Real-time preview of the generated card with export functionality
3. **Toolbar** - Main control panel integrating all settings
4. **ResolutionSelector** - Choose between different social media dimensions
5. **FontSelector** - Font selection with live text preview
6. **ColorPicker** - Brand color selection with presets and custom colors

### Hooks

1. **useImage** - Manages image loading, validation, and preprocessing
2. **useCanvasRenderer** - Handles canvas rendering with DevicePixelRatio support

### Utils

1. **renderer.ts** - Core canvas rendering functions:
   - `renderCard()` - Main rendering function
   - `wrapText()` - Text wrapping with ellipsis
   - `calculateFontSize()` - Dynamic font sizing

2. **exportUtils.ts** - File export utilities:
   - `generateFilename()` - Creates timestamped filenames
   - `exportAndDownload()` - Handles file download
   - `slugify()` - Text slugification

## Usage

1. **Upload Images**:
   - Main image (required): Your news photo
   - Logo (optional): Company logo for top-right placement

2. **Add Headline**:
   - Enter your text (max 3 lines)
   - Supports English and Bengali characters

3. **Customize Design**:
   - Select resolution for target platform
   - Choose font that supports your language
   - Pick brand color for headline bar
   - Set export format and quality

4. **Export**:
   - Preview your card in real-time
   - Download as PNG (lossless) or JPEG (compressed)
   - Files are automatically named with headline and timestamp

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **Image Optimization**: Automatic downscaling of large images
- **DevicePixelRatio Support**: Crisp rendering on high-DPI displays
- **Debounced Rendering**: Optimized canvas updates
- **Lazy Loading**: Font loading via Google Fonts

## File Naming Convention

Exported files follow this pattern:
```
{slugified-headline}-{YYYYMMDD-HHMM}.{format}
```

Example: `breaking-news-20241201-1430.png`

## Development Notes

### Canvas Rendering

The application uses HTML5 Canvas API for image composition:
- Background image covers full canvas
- Logo positioned top-right (14% of canvas width)
- Headline bar at bottom (25% of canvas height)
- Text with shadow for contrast
- 32px safe margins around elements

### Image Processing

- Maximum file size: 10MB
- Automatic downscaling for images > 2048px
- JPEG compression at 90% quality
- Base64 encoding for browser storage

### TypeScript

Full TypeScript support with comprehensive type definitions:
- Strict mode enabled
- All components properly typed
- Interface definitions for all data structures

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the package.json file for details.

## Acknowledgments

- Google Fonts for font loading
- Tailwind CSS for styling
- Vite for fast development experience
- Canvas API for powerful image rendering