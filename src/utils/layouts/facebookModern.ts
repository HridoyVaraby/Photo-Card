import { LayoutStrategy } from "./types";
import { loadImage } from "../imageUtils";
import { calculateFontSize, wrapText } from "../textUtils";

export const FacebookModernLayout: LayoutStrategy = {
    draw: async ({ ctx, state, width, height, logoSize, padding }) => {
        // Facebook modern layout: logo top-left, headline in semi-transparent overlay box
        if (state.logo) {
            try {
                const logoImg = await loadImage(state.logo);

                // Draw logo in top-left
                const logoX = padding;
                const logoY = padding;

                // Create rounded rectangle for logo background
                ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 12);
                } else {
                    ctx.rect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16);
                }
                ctx.fill();

                // Draw logo
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            } catch (error) {
                console.error("Failed to load logo:", error);
            }
        }

        const overlayHeight = Math.floor(height * 0.35);
        const overlayY = height - overlayHeight;
        const overlayPadding = 40;

        // Draw semi-transparent overlay background with gradient
        const gradient = ctx.createLinearGradient(0, overlayY, 0, height);
        gradient.addColorStop(0, state.settings.brandColor + "00");
        gradient.addColorStop(0.5, state.settings.brandColor + "40");
        gradient.addColorStop(1, state.settings.brandColor + "cc");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, overlayY, width, overlayHeight);

        // Setup text properties
        const textMaxWidth = width - overlayPadding * 2;
        const textX = overlayPadding;
        const textY = overlayY + overlayHeight / 2;

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Set font
        ctx.font = `bold ${state.settings.font}`;

        if (state.headline) {
            // Wrap text and calculate font size
            const lines = wrapText(ctx, state.headline, textMaxWidth);
            const fontSize = calculateFontSize(
                ctx,
                state.headline,
                textMaxWidth,
                state.settings.font,
                Math.floor(overlayHeight * 0.5),
                Math.floor(overlayHeight * 0.25),
            );

            ctx.font = `bold ${fontSize}px ${state.settings.font}`;

            // Draw each line
            const lineHeight = fontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            const startY = textY - totalHeight / 2 + fontSize / 2;

            lines.forEach((line, index) => {
                ctx.fillText(line, textX, startY + index * lineHeight);
            });
        }
    },
};
