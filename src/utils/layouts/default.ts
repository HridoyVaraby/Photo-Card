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

        // Content Group (Headline + CTA)
        const hasHeadline = !!state.headline;
        const hasCTA = !!state.ctaText;

        let headlineLines: string[] = [];
        let headlineFontSize = 0;
        let headlineHeight = 0;
        let ctaHeight = 0;
        let ctaFontSize = 0;
        const contentSpacing = hasHeadline && hasCTA ? barHeight * 0.05 : 0;

        // 1. Calculate Headline Specs
        if (hasHeadline) {
            const heightConstraint = hasCTA ? barHeight * 0.6 : barHeight * 0.8;

            headlineFontSize = calculateFontSize(
                ctx,
                state.headline,
                textMaxWidth,
                heightConstraint,
                state.settings.font,
                Math.floor(barHeight * 0.6),
                Math.floor(barHeight * 0.3)
            );

            ctx.font = `bold ${headlineFontSize}px ${state.settings.font}`;
            headlineLines = wrapText(ctx, state.headline, textMaxWidth);
            headlineHeight = headlineLines.length * (headlineFontSize * 1.2);
        }

        // 2. Calculate CTA Specs
        if (hasCTA) {
            const baseSize = hasHeadline ? headlineFontSize : Math.floor(barHeight * 0.25);
            ctaFontSize = Math.floor(baseSize * 0.6);
            if (ctaFontSize < 16) ctaFontSize = 16;
            const ctaPaddingY = ctaFontSize * 0.4;
            ctaHeight = ctaFontSize + ctaPaddingY * 2;
        }

        // 3. Calculate Vertical Center in Bar
        const totalContentHeight = headlineHeight + contentSpacing + ctaHeight;
        let startY = barY + (barHeight - totalContentHeight) / 2;

        // 4. Draw Headline
        if (hasHeadline) {
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.font = `bold ${headlineFontSize}px ${state.settings.font}`;

            const lineHeight = headlineFontSize * 1.2;
            let currentY = startY + lineHeight / 2;

            headlineLines.forEach((line) => {
                ctx.fillText(line, textX, currentY);
                currentY += lineHeight;
            });

            startY += headlineHeight + contentSpacing;
        }

        // 5. Draw CTA
        if (hasCTA) {
            ctx.font = `bold ${ctaFontSize}px ${state.settings.font}`;
            const ctaPaddingX = ctaFontSize;
            const ctaPaddingY = ctaFontSize * 0.4;
            const ctaMeasure = ctx.measureText(state.ctaText!);
            const ctaWidth = ctaMeasure.width + ctaPaddingX * 2;
            const ctaRealHeight = ctaFontSize + ctaPaddingY * 2;

            // Draw pill
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(textX, startY, ctaWidth, ctaRealHeight, ctaRealHeight / 2);
            } else {
                ctx.rect(textX, startY, ctaWidth, ctaRealHeight);
            }
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.fillText(state.ctaText!, textX + ctaPaddingX, startY + ctaRealHeight / 2);
        }
    },
};
