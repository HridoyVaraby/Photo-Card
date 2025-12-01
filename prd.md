📑 Project Description: News Photo Card Generator

🎯 Purpose

A lightweight React + Vite web app that allows users to upload:

A main news image

A company logo

A headline/title

The app then composes these elements into a branded photo card suitable for sharing on social media. The user can preview the card live and download it as a PNG/JPEG.

🧩 Core Features

Upload Inputs

Drag-and-drop or file upload for main image

Upload for logo

Text input for headline

Card Generator

Canvas-based rendering

Logo positioned top-right

Headline in a bottom overlay bar

Brand color and font customization

Output

Download as PNG (default) or JPEG (optional quality slider)

Default resolution: 1200×628 (Twitter card size)

Options for 1080×1080 (Instagram) and 1080×1920 (Stories)

🖼️ Layout Rules

Background Image: Full bleed, scaled to cover canvas

Logo: Top-right corner, auto-resized to ~12–16% of canvas width

Headline Bar: Bottom overlay strip, brand color at ~90% opacity

Headline Text: Bold, readable font (support Bengali + English), white text with shadow for contrast

Safe Margins: 32px padding around elements

⚙️ User Flow

User uploads image, logo, and enters headline

Live preview updates instantly

User customizes brand color, font, resolution

User clicks Download → exports card as PNG/JPEG

📦 Tech Stack

Frontend: React + Vite + TypeScript

Canvas Rendering: HTML5 Canvas API (or Konva.js/Fabric.js if needed)

Styling: Tailwind CSS for rapid UI

Fonts: Inter, Montserrat, plus Bengali fonts (Noto Sans Bengali, Hind Siliguri)

🚀 MVP Scope

One default template (logo top-right, headline bar bottom)

No backend, all client-side

Export/download only

Minimal UI with clean controls

🔮 Future Extensions

Multiple templates

Drag-and-drop positioning

Saved presets (logo + brand color)

Social media share buttons

AI-powered headline suggestions

