import { LayoutStrategy } from "./types";
import { loadImage } from "../imageUtils";
import { calculateFontSize, wrapText } from "../textUtils";

export const DurbinNewsLayout: LayoutStrategy = {
    draw: async ({ ctx, state, width, height }) => {
        // Durbin Layout Logic moved here
        // For brevity, inheriting exact logic from original renderer but cleaned up

        // 1. Draw Background (done in main renderer or here? 
        // Main renderer handles background image logic usually, but Durbin handles it specifically.
        // We will assume Main renderer handles MAIN background, but Durbin has its own specific background logic.
        // Actually the original renderer had a special check: if durbin, drawOverlayElements called diff logic.
        // AND renderer.ts main function had `if (layout === 'durbin-news') { await drawOverlayElements... } else { drawBackground... }`
        // So Durbin Draws its OWN background.

        // Draw background - prioritize backgroundImage > brandColor > default red
        if (state.backgroundImage) {
            try {
                const bgImg = await loadImage(state.backgroundImage);
                const bgAspect = bgImg.width / bgImg.height;
                const canvasAspect = width / height;
                let drawWidth = width, drawHeight = height, drawX = 0, drawY = 0;

                if (bgAspect > canvasAspect) {
                    drawHeight = height;
                    drawWidth = height * bgAspect;
                    drawX = (width - drawWidth) / 2;
                } else {
                    drawWidth = width;
                    drawHeight = width / bgAspect;
                    drawY = (height - drawHeight) / 2;
                }
                ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
            } catch (error) {
                ctx.fillStyle = state.settings.brandColor || "#8B1538";
                ctx.fillRect(0, 0, width, height);
            }
        } else {
            ctx.fillStyle = state.settings.brandColor || "#8B1538";
            ctx.fillRect(0, 0, width, height);
        }

        // Dynamic sizing based on percentages
        const headerHeight = height * 0.22;
        const footerHeight = height * 0.25;
        const imageAreaHeight = height - headerHeight - footerHeight;

        // Image dimensions
        const imgMargin = width * 0.05;
        const imgWidth = width - imgMargin * 2;
        const maxImgHeight = imageAreaHeight * 0.95;

        const imgX = imgMargin;
        const imgY = headerHeight + (imageAreaHeight - maxImgHeight) / 2;
        const imgHeight = maxImgHeight;

        // Draw white border around image
        const borderSize = Math.max(4, width * 0.005);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            imgX - borderSize,
            imgY - borderSize,
            imgWidth + borderSize * 2,
            imgHeight + borderSize * 2,
        );

        // Draw main image (INNER FRAME)
        if (state.mainImage) {
            try {
                const imgImg = await loadImage(state.mainImage);

                // --- NEW: Apply Pan/Zoom ---
                // Defaults
                const scale = state.imagePosition?.scale ?? 1;
                const panX = state.imagePosition?.x ?? 0;
                const panY = state.imagePosition?.y ?? 0;

                // Calculate aspect ratio and use cover scaling
                const imgAspect = imgImg.width / imgImg.height;
                const containerAspect = imgWidth / imgHeight;

                // Standard Cover Logic (Simplified for current draw strategy)
                // We use destination-based scaling below, so source cropping is handled naturally by drawImage scaling or we could improve it later.
                // For now, removing unused source rect calculations to fix lint errors.

                // Apply transformations (simple implementation for MVP: modify draw coords)
                // Note: Real panning usually adjusts source rect. 
                // For simplicity, we'll clip the context and draw with transform.

                ctx.save();
                ctx.beginPath();
                ctx.rect(imgX, imgY, imgWidth, imgHeight);
                ctx.clip();

                // Translate to center of image area
                const centerX = imgX + imgWidth / 2;
                const centerY = imgY + imgHeight / 2;

                ctx.translate(centerX + panX, centerY + panY);
                ctx.scale(scale, scale);
                ctx.translate(-centerX, -centerY);

                // Draw the image "covered" relative to the box
                // We need to re-calculate drawing coords to FILL the box first

                // Simplified approach: Draw image covering the rect, centered
                let drawW = imgWidth;
                let drawH = imgHeight;
                if (imgAspect > containerAspect) {
                    // Image wider
                    drawW = imgHeight * imgAspect;
                    drawH = imgHeight;
                } else {
                    // Image taller
                    drawW = imgWidth;
                    drawH = imgWidth / imgAspect;
                }

                ctx.drawImage(imgImg, imgX + (imgWidth - drawW) / 2, imgY + (imgHeight - drawH) / 2, drawW, drawH);

                ctx.restore();

            } catch (error) {
                ctx.fillStyle = "#f3f4f6";
                ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
            }
        } else {
            ctx.fillStyle = "#f3f4f6";
            ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
        }

        // Header & Footer
        await drawDurbinDetails(ctx, state, width, height, headerHeight, footerHeight);
    },
};

async function drawDurbinDetails(ctx: CanvasRenderingContext2D, state: any, width: number, height: number, headerHeight: number, footerHeight: number) {
    const fontFamily = state.settings.font;

    // Logo Top Left
    if (state.logo) {
        try {
            const logoImg = await loadImage(state.logo);
            const logoPadding = width * 0.03;
            const maxLogoHeight = headerHeight * 0.7;
            const maxLogoWidth = width * 0.4;

            let dw = logoImg.width;
            let dh = logoImg.height;

            if (dh > maxLogoHeight) {
                const s = maxLogoHeight / dh;
                dh = maxLogoHeight;
                dw = dw * s;
            }
            if (dw > maxLogoWidth) {
                const s = maxLogoWidth / dw;
                dw = maxLogoWidth;
                dh = dh * s;
            }
            ctx.drawImage(logoImg, logoPadding, logoPadding, dw, dh);
        } catch (e) { }
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.floor(width * 0.05)}px sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("DURBIN", width * 0.03, width * 0.03);
    }

    // Date Top Right
    const rightPadding = width * 0.03;
    const topPadding = width * 0.03;
    const dateText = state.date || "৩০ নভেম্বর, ২০২৫";
    const dateFontSize = Math.floor(width * 0.035);
    ctx.font = `bold ${dateFontSize}px ${fontFamily}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(dateText, width - rightPadding, topPadding);

    // Badge
    const badgeText = "সর্বশেষ সংবাদ";
    const badgeFontSize = Math.floor(width * 0.03);
    ctx.font = `bold ${badgeFontSize}px ${fontFamily}`;
    const bm = ctx.measureText(badgeText);
    const bw = bm.width + badgeFontSize * 1.6;
    const bh = badgeFontSize + badgeFontSize * 0.8;
    const bx = width - rightPadding - bw;
    const by = topPadding + dateFontSize * 1.2 + width * 0.01;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = state.settings.brandColor || "#8B1538";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, bx + bw / 2, by + bh / 2);

    // Headline Bottom
    if (state.headline) {
        const headlineY = height - footerHeight;
        const headlinePadding = width * 0.05;
        const headlineMaxWidth = width - headlinePadding * 2;
        const maxFontSize = Math.floor(footerHeight * 0.4);

        ctx.fillStyle = "#FFD700";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // 1. Calculate optimal font size ensuring it fits both width (wrapped) and height
        const availableHeight = footerHeight * 0.8; // Leave 10% padding top/bottom
        const fontSize = calculateFontSize(
            ctx,
            state.headline,
            headlineMaxWidth,
            availableHeight, // New argument: Max Height Constraint
            fontFamily,
            maxFontSize,
            20
        );

        // 2. Apply the calculated font
        ctx.font = `bold ${fontSize}px ${fontFamily}`;

        // 3. Wrap text using the CORRECT font
        const lines = wrapText(ctx, state.headline, headlineMaxWidth);

        // 4. Draw
        const lineHeight = fontSize * 1.3;
        const totalH = lines.length * lineHeight;
        const startY = headlineY + footerHeight / 2 - totalH / 2 + fontSize / 2;

        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, startY + i * lineHeight);
        });
    }
}
