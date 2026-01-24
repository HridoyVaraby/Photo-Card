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

        // Grouped Content (Headline + CTA)
        const hasHeadline = !!state.headline;
        const hasCTA = !!state.ctaText;

        let headlineLines: string[] = [];
        let headlineFontSize = 0;
        let headlineHeight = 0;
        let ctaHeight = 0;
        let ctaFontSize = 0;
        const contentSpacing = hasHeadline && hasCTA ? overlayHeight * 0.05 : 0;

        if (hasHeadline) {
            const heightConstraint = hasCTA ? overlayHeight * 0.6 : overlayHeight * 0.8;

            headlineFontSize = calculateFontSize(
                ctx,
                state.headline,
                textMaxWidth,
                heightConstraint,
                state.settings.font,
                Math.floor(overlayHeight * 0.5),
                Math.floor(overlayHeight * 0.2),
            );

            ctx.font = `bold ${headlineFontSize}px ${state.settings.font}`;
            headlineLines = wrapText(ctx, state.headline, textMaxWidth);
            headlineHeight = headlineLines.length * (headlineFontSize * 1.2);
        }

        if (hasCTA) {
            const baseSize = hasHeadline ? headlineFontSize : Math.floor(overlayHeight * 0.25);
            ctaFontSize = Math.floor(baseSize * 0.7);
            if (ctaFontSize < 16) ctaFontSize = 16;
            const ctaPaddingY = ctaFontSize * 0.4;
            ctaHeight = ctaFontSize + ctaPaddingY * 2;
        }

        const totalContentHeight = headlineHeight + contentSpacing + ctaHeight;
        let startY = overlayY + (overlayHeight - totalContentHeight) / 2;

        if (hasHeadline) {
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
            ctx.shadowBlur = 6;
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

        if (hasCTA) {
            ctx.font = `bold ${ctaFontSize}px ${state.settings.font}`;
            const ctaPaddingX = ctaFontSize;
            const ctaPaddingY = ctaFontSize * 0.4;
            const ctaMeasure = ctx.measureText(state.ctaText!);
            const ctaWidth = ctaMeasure.width + ctaPaddingX * 2;
            const ctaRealHeight = ctaFontSize + ctaPaddingY * 2;

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(textX, startY, ctaWidth, ctaRealHeight, ctaRealHeight / 2);
            } else {
                ctx.rect(textX, startY, ctaWidth, ctaRealHeight);
            }
            ctx.fill();

            ctx.fillStyle = state.settings.brandColor;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "transparent";
            ctx.fillText(state.ctaText!, textX + ctaPaddingX, startY + ctaRealHeight / 2);
        }
    },
};
