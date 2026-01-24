export interface CardSettings {
  width: number;
  height: number;
  font: string;
  brandColor: string;
  format: 'png' | 'jpeg';
  quality?: number;
  layout?: 'default' | 'facebook-modern' | 'facebook-minimal' | 'durbin-news';
}

export interface ImagePosition {
  x: number;
  y: number;
  scale: number;
}

export interface CardState {
  mainImage: string | null;
  logo: string | null;
  headline: string;
  date?: string;
  backgroundImage?: string | null;
  settings: CardSettings;
  imagePosition?: ImagePosition; // New field for panning/zooming
}

export interface ImageFile {
  file: File;
  url: string;
  width: number;
  height: number;
}

export interface FontOption {
  name: string;
  value: string;
  family: string;
}

export interface ResolutionOption {
  name: string;
  width: number;
  height: number;
}

export interface CanvasRenderState {
  isRendering: boolean;
  error: string | null;
  scale: number;
}

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality?: number;
  filename: string;
}