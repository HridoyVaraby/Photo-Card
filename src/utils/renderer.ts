import { CardState } from "../types";
import { LayoutStrategy } from "./layouts/types";
import { DefaultLayout } from "./layouts/default";
import { FacebookModernLayout } from "./layouts/facebookModern";
import { FacebookMinimalLayout } from "./layouts/facebookMinimal";
import { DurbinNewsLayout } from "./layouts/durbinNews";
import { loadImage } from "./imageUtils";

const LAYOUTS: Record<string, LayoutStrategy> = {
  default: DefaultLayout,
  "facebook-modern": FacebookModernLayout,
  "facebook-minimal": FacebookMinimalLayout,
  "durbin-news": DurbinNewsLayout,
};

export const renderCard = async (
  canvas: HTMLCanvasElement,
  state: CardState,
  scale: number = 1,
): Promise<void> => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const { width, height } = state.settings;
  const dpr = window.devicePixelRatio || 1;

  // Set canvas size
  canvas.width = width * scale * dpr;
  canvas.height = height * scale * dpr;

  // Scale context
  ctx.scale(scale * dpr, scale * dpr);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // --- Background Rendering (Shared Logic) ---
  // Note: Durbin layout handles its own background interactions, but standard layouts
  // use a common full-bleed background strategy.

  if (state.settings.layout !== "durbin-news") {
    if (state.mainImage) {
      try {
        const bgImg = await loadImage(state.mainImage);

        // Default Scaling Logic
        const imgAspect = bgImg.width / bgImg.height;
        const canvasAspect = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let drawX = 0;
        let drawY = 0;

        if (imgAspect > canvasAspect) {
          drawWidth = width;
          drawHeight = width / imgAspect;
          drawY = (height - drawHeight) / 2;
        } else {
          drawHeight = height;
          drawWidth = height * imgAspect;
          drawX = (width - drawWidth) / 2;
        }

        ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
      } catch (error) {
        console.error("Failed to load background image:", error);
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, width, height);
    }
  }

  // --- Layout Strategy Execution ---
  const layoutId = state.settings.layout || "default";
  const strategy = LAYOUTS[layoutId] || DefaultLayout;

  const padding = 32;
  const logoSize = Math.floor(width * 0.14);

  await strategy.draw({
    ctx,
    state,
    width,
    height,
    logoSize,
    padding,
  });
};
