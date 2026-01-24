import { LayoutStrategy } from "./types";
import { loadImage } from "../imageUtils";
import { calculateFontSize, wrapText } from "../textUtils";

export const DefaultLayout: LayoutStrategy = {
    draw: async ({ ctx, state, width, height, logoSize, padding }) => {
        // Draw logo if available
        if (state.logo) {
            try {
                const logoImg = await loadImage(state.logo);

                // Draw logo in top-right with padding
                const logoX = width - logoSize - padding;
                const logoY = padding;

                // Create rounded rectangle for logo background
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.beginPath();
                // @ts-ignore - roundRect is well supported in modern browsers but TS might need newer lib
                if (ctx.roundRect) {
                    ctx.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 8);
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

        // Draw headline bar
        const barHeight = Math.floor(height * 0.28);
        const barY = height - barHeight;

        // Draw semi-transparent overlay bar
        ctx.fillStyle = state.settings.brandColor + "e6"; // 90% opacity (hex e6)
        ctx.fillRect(0, barY, width, barHeight);

        // Setup text properties
        const textMaxWidth = width - padding * 2;
        const textX = padding; // Left align
        const textY = barY + barHeight / 2;

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 4;
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
                Math.floor(barHeight * 0.6),
                Math.floor(barHeight * 0.3),
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
