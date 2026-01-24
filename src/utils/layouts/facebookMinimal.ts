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

        // Grouped Content (Headline + CTA)
        const hasHeadline = !!state.headline;
        const hasCTA = !!state.ctaText;

        let headlineLines: string[] = [];
        let headlineFontSize = 0;
        let headlineHeight = 0;
        let ctaHeight = 0;
        let ctaFontSize = 0;
        const contentSpacing = hasHeadline && hasCTA ? barHeight * 0.05 : 0;

        if (hasHeadline) {
            const heightConstraint = hasCTA ? barHeight * 0.6 : barHeight * 0.8;
            headlineFontSize = calculateFontSize(
                ctx,
                state.headline,
                textMaxWidth,
                heightConstraint,
                state.settings.font,
                Math.floor(barHeight * 0.6),
                Math.floor(barHeight * 0.3),
            );

            ctx.font = `600 ${headlineFontSize}px ${state.settings.font}`;
            headlineLines = wrapText(ctx, state.headline, textMaxWidth);
            headlineHeight = headlineLines.length * (headlineFontSize * 1.1);
        }

        if (hasCTA) {
            const baseSize = hasHeadline ? headlineFontSize : Math.floor(barHeight * 0.25);
            ctaFontSize = Math.floor(baseSize * 0.65);
            if (ctaFontSize < 16) ctaFontSize = 16;
            ctaHeight = ctaFontSize * 1.5; // Text height
        }

        const totalContentHeight = headlineHeight + contentSpacing + ctaHeight;
        let startY = barY + (barHeight - totalContentHeight) / 2;

        if (hasHeadline) {
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            ctx.font = `600 ${headlineFontSize}px ${state.settings.font}`;
            const lineHeight = headlineFontSize * 1.1;
            let currentY = startY + lineHeight / 2;

            headlineLines.forEach((line) => {
                ctx.fillText(line, textX, currentY);
                currentY += lineHeight;
            });

            startY += headlineHeight + contentSpacing;
        }

        if (hasCTA) {
            ctx.font = `600 ${ctaFontSize}px ${state.settings.font}`;
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.shadowColor = "rgba(0,0,0,0.2)";
            ctx.fillText(`👉 ${state.ctaText}`, textX, startY);
        }
    },
};
