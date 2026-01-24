import { LayoutStrategy } from "./types";
import { loadImage } from "../imageUtils";
import { calculateFontSize, wrapText } from "../textUtils";

export const FacebookMinimalLayout: LayoutStrategy = {
    draw: async ({ ctx, state, width, height, padding }) => {
        // Facebook minimal layout: clean typography with subtle branding
        if (state.logo) {
            try {
                const logoImg = await loadImage(state.logo);

                // Small logo in top-right corner
                const smallLogoSize = Math.floor(width * 0.08);
                const logoX = width - smallLogoSize - padding;
                const logoY = padding;

                // Draw logo without background for minimal look
                ctx.globalAlpha = 0.8;
                ctx.drawImage(logoImg, logoX, logoY, smallLogoSize, smallLogoSize);
                ctx.globalAlpha = 1.0;
            } catch (error) {
                console.error("Failed to load logo:", error);
            }
        }

        const barHeight = Math.floor(height * 0.18);
        const barY = height - barHeight;

        // Draw subtle bottom bar with gradient
        const gradient = ctx.createLinearGradient(0, barY, 0, height);
        gradient.addColorStop(0, state.settings.brandColor + "ee"); // 93% opacity
        gradient.addColorStop(1, state.settings.brandColor); // 100% opacity

        ctx.fillStyle = gradient;
        ctx.fillRect(0, barY, width, barHeight);

        // Setup text properties
        const textMaxWidth = width - padding * 2;
        const textX = padding;
        const textY = barY + barHeight / 2;

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Set font
        ctx.font = `600 ${state.settings.font}`;

        if (state.headline) {
            // Wrap text and calculate font size
            const lines = wrapText(ctx, state.headline, textMaxWidth);
            const fontSize = calculateFontSize(
                ctx,
                state.headline,
                textMaxWidth,
                state.settings.font,
                Math.floor(barHeight * 0.6),
                Math.floor(barHeight * 0.3),
            );

            ctx.font = `600 ${fontSize}px ${state.settings.font}`;

            // Draw each line
            const lineHeight = fontSize * 1.1;
            const totalHeight = lines.length * lineHeight;
            const startY = textY - totalHeight / 2 + fontSize / 2;

            lines.forEach((line, index) => {
                ctx.fillText(line, textX, startY + index * lineHeight);
            });
        }
    },
};
