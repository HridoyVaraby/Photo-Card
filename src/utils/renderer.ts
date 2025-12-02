import { CardState } from "../types";

export const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Limit to 3 lines maximum, add ellipsis if more
  if (lines.length > 3) {
    return lines.slice(0, 3).map((line, index) => {
      if (index === 2) {
        // Truncate third line if it's too long
        while (
          ctx.measureText(line + "...").width > maxWidth &&
          line.length > 0
        ) {
          line = line.slice(0, -1);
        }
        return line + "...";
      }
      return line;
    });
  }

  return lines;
};

export const calculateFontSize = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxFontSize: number = 48,
  minFontSize: number = 16,
): number => {
  let fontSize = maxFontSize;

  ctx.font = `bold ${fontSize}px ${ctx.font.split(" ").pop()}`;

  while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px ${ctx.font.split(" ").pop()}`;
  }

  return fontSize;
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS for images
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
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

  // Set canvas size with device pixel ratio
  canvas.width = width * scale * dpr;
  canvas.height = height * scale * dpr;

  // Scale context for device pixel ratio
  ctx.scale(scale * dpr, scale * dpr);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // For Durbin News layout, handle background differently
  if (state.settings.layout === "durbin-news") {
    await drawOverlayElements(ctx, state, width, height);
  } else {
    // Draw background image for other layouts
    if (state.mainImage) {
      try {
        const bgImg = await loadImage(state.mainImage);

        // Calculate cover scaling
        const imgAspect = bgImg.width / bgImg.height;
        const canvasAspect = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let drawX = 0;
        let drawY = 0;

        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          drawWidth = width;
          drawHeight = width / imgAspect;
          drawY = (height - drawHeight) / 2;
        } else {
          // Image is taller than canvas
          drawHeight = height;
          drawWidth = height * imgAspect;
          drawX = (width - drawWidth) / 2;
        }

        ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
      } catch (error) {
        console.error("Failed to load background image:", error);
        // Fallback
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      // Draw placeholder background
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, width, height);
    }

    // Continue with other elements after background is drawn
    await drawOverlayElements(ctx, state, width, height);
  }
};

const drawOverlayElements = async (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
): Promise<void> => {
  const padding = 32;
  const logoSize = Math.floor(width * 0.14); // 14% of canvas width

  // Choose layout based on settings
  const layout = state.settings.layout || "default";

  switch (layout) {
    case "facebook-modern":
      await drawFacebookModernLayout(
        ctx,
        state,
        width,
        height,
        padding,
        logoSize,
      );
      break;
    case "facebook-minimal":
      await drawFacebookMinimalLayout(
        ctx,
        state,
        width,
        height,
        padding,
        logoSize,
      );
      break;
    case "durbin-news":
      await drawDurbinNewsLayout(ctx, state, width, height, padding, logoSize);
      break;
    default:
      await drawDefaultLayout(ctx, state, width, height, padding, logoSize);
  }
};

const drawDefaultLayout = async (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  logoSize: number,
): Promise<void> => {
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
      ctx.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 8);
      ctx.fill();

      // Draw logo
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    } catch (error) {
      console.error("Failed to load logo:", error);
    }
  }

  // Draw headline bar
  drawHeadlineBar(ctx, state, width, height, padding);
};

const drawFacebookModernLayout = async (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  logoSize: number,
): Promise<void> => {
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
      ctx.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 12);
      ctx.fill();

      // Draw logo
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    } catch (error) {
      console.error("Failed to load logo:", error);
    }
  }

  // Draw headline in bottom overlay
  drawFacebookHeadlineOverlay(ctx, state, width, height, padding);
};

const drawFacebookMinimalLayout = async (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  logoSize: number,
): Promise<void> => {
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

  // Draw minimalist headline bar
  drawMinimalistHeadlineBar(ctx, state, width, height, padding, logoSize);
};

const drawFacebookHeadlineOverlay = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  _padding: number,
): void => {
  const overlayHeight = Math.floor(height * 0.35); // Increased from 30% to 35% - more gap between image and headline
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
      Math.floor(overlayHeight * 0.5),
      Math.floor(overlayHeight * 0.25),
    );

    ctx.font = `bold ${fontSize}px ${ctx.font.split(" ").pop()}`;

    // Draw each line
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = textY - totalHeight / 2 + fontSize / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, textX, startY + index * lineHeight);
    });
  }
};

const drawMinimalistHeadlineBar = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  _logoSize: number,
): void => {
  const barHeight = Math.floor(height * 0.18); // Increased from 15% to 18% - more gap between image and headline
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
      Math.floor(barHeight * 0.6),
      Math.floor(barHeight * 0.3),
    );

    ctx.font = `600 ${fontSize}px ${ctx.font.split(" ").pop()}`;

    // Draw each line
    const lineHeight = fontSize * 1.1;
    const totalHeight = lines.length * lineHeight;
    const startY = textY - totalHeight / 2 + fontSize / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, textX, startY + index * lineHeight);
    });
  }
};

const drawHeadlineBar = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
): void => {
  const barHeight = Math.floor(height * 0.28); // Increased from 25% to 28% - more gap between image and headline
  const barY = height - barHeight;

  // Draw semi-transparent overlay bar
  ctx.fillStyle = state.settings.brandColor + "e6"; // 90% opacity (hex e6)
  ctx.fillRect(0, barY, width, barHeight);

  // Setup text properties
  const textMaxWidth = width - padding * 2;
  const textX = padding;
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

    ctx.font = `bold ${fontSize}px ${ctx.font.split(" ").pop()}`;

    // Draw each line
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = textY - totalHeight / 2 + fontSize / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, textX, startY + index * lineHeight);
    });
  }
};

async function drawDurbinNewsLayout(
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  _padding: number,
  _logoSize: number,
): Promise<void> {
  // Draw background - prioritize backgroundImage > brandColor > default red
  if (state.backgroundImage) {
    try {
      const bgImg = await loadImage(state.backgroundImage);

      // Calculate cover scaling for background
      const bgAspect = bgImg.width / bgImg.height;
      const canvasAspect = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let drawX = 0;
      let drawY = 0;

      if (bgAspect > canvasAspect) {
        // Image is wider - fit height
        drawHeight = height;
        drawWidth = height * bgAspect;
        drawX = (width - drawWidth) / 2;
      } else {
        // Image is taller - fit width
        drawWidth = width;
        drawHeight = width / bgAspect;
        drawY = (height - drawHeight) / 2;
      }

      ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
    } catch (error) {
      console.error("Failed to load background image:", error);
      // Fallback to brand color
      ctx.fillStyle = state.settings.brandColor || "#8B1538";
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    // Use brand color or default red
    ctx.fillStyle = state.settings.brandColor || "#8B1538";
    ctx.fillRect(0, 0, width, height);
  }

  // Dynamic sizing based on percentages
  const headerHeight = height * 0.22; // Reduced from 28% to 22% - less gap between header and image
  const footerHeight = height * 0.25; // Increased from 20% to 25% - more gap between image and headline
  const imageAreaHeight = height - headerHeight - footerHeight;

  // Image dimensions
  const imgMargin = width * 0.05; // 5% margin
  const imgWidth = width - imgMargin * 2;
  // Calculate max image height that fits in the middle area
  const maxImgHeight = imageAreaHeight * 0.95; // Use 95% of available space

  const imgX = imgMargin;
  // Center image vertically in the available space between header and footer
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

  // Draw main image
  if (state.mainImage) {
    try {
      const imgImg = await loadImage(state.mainImage);

      // Calculate aspect ratio and use cover scaling
      const imgAspect = imgImg.width / imgImg.height;
      const containerAspect = imgWidth / imgHeight;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = imgImg.width;
      let sourceHeight = imgImg.height;

      if (imgAspect > containerAspect) {
        // Image is wider - crop sides
        sourceWidth = imgImg.height * containerAspect;
        sourceX = (imgImg.width - sourceWidth) / 2;
      } else {
        // Image is taller - crop top/bottom
        sourceHeight = imgImg.width / containerAspect;
        sourceY = (imgImg.height - sourceHeight) / 2;
      }

      ctx.drawImage(
        imgImg,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        imgX,
        imgY,
        imgWidth,
        imgHeight,
      );
    } catch (error) {
      console.error("Failed to load main image:", error);
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
    }
  } else {
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
  }

  // Draw other elements
  await drawDurbinNewsElements(
    ctx,
    state,
    width,
    height,
    headerHeight,
    footerHeight,
  );
}

async function drawDurbinNewsElements(
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  headerHeight: number,
  footerHeight: number,
): Promise<void> {
  const fontFamily = state.settings.font
    ? `'${state.settings.font}', sans-serif`
    : "'Noto Sans Bengali', 'Hind Siliguri', 'Arial', sans-serif";

  // --- LOGO (Top Left) ---
  if (state.logo) {
    try {
      const logoImg = await loadImage(state.logo);

      const logoPadding = width * 0.03;
      const logoX = logoPadding;
      const logoY = logoPadding;

      // Constrain logo to fit within header height with some padding
      const maxLogoHeight = headerHeight * 0.7;
      const maxLogoWidth = width * 0.4; // Max 40% of width

      let drawLogoWidth = logoImg.width;
      let drawLogoHeight = logoImg.height;

      // Scale down if too tall
      if (drawLogoHeight > maxLogoHeight) {
        const scale = maxLogoHeight / drawLogoHeight;
        drawLogoHeight = maxLogoHeight;
        drawLogoWidth = drawLogoWidth * scale;
      }

      // Scale down if too wide (after height check)
      if (drawLogoWidth > maxLogoWidth) {
        const scale = maxLogoWidth / drawLogoWidth;
        drawLogoWidth = maxLogoWidth;
        drawLogoHeight = drawLogoHeight * scale;
      }

      ctx.drawImage(logoImg, logoX, logoY, drawLogoWidth, drawLogoHeight);
    } catch (error) {
      console.error("Failed to load logo:", error);
    }
  } else {
    // Text logo fallback
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.floor(width * 0.05)}px ${fontFamily}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("DURBIN", width * 0.03, width * 0.03);
    ctx.fillText("NEWS", width * 0.03, width * 0.08);
  }

  // --- DATE & BADGE (Top Right) ---
  const topPadding = width * 0.03;
  const rightPadding = width * 0.03;

  // 1. Date (Top Right)
  const dateText = state.date || "৩০ নভেম্বর, ২০২৫";
  const dateFontSize = Math.floor(width * 0.035); // Responsive font size
  ctx.font = `bold ${dateFontSize}px ${fontFamily}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";

  // Measure date width
  const dateHeight = dateFontSize * 1.2;

  // Draw Date Text
  ctx.fillStyle = "#ffffff";
  ctx.fillText(dateText, width - rightPadding, topPadding);

  // 2. "Latest News" Badge (Below Date)
  const badgeText = "সর্বশেষ সংবাদ";
  const badgeFontSize = Math.floor(width * 0.03);
  ctx.font = `bold ${badgeFontSize}px ${fontFamily}`;
  const badgeMetrics = ctx.measureText(badgeText);
  const badgePaddingX = badgeFontSize * 0.8;
  const badgePaddingY = badgeFontSize * 0.4;
  const badgeWidth = badgeMetrics.width + badgePaddingX * 2;
  const badgeHeight = badgeFontSize + badgePaddingY * 2;

  const badgeX = width - rightPadding - badgeWidth;
  const badgeY = topPadding + dateHeight + width * 0.01; // Spacing below date

  // Badge Background (White)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);

  // Badge Text (Red)
  ctx.fillStyle = "#8B1538";
  ctx.textAlign = "left"; // Reset alignment for badge text drawing
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, badgeX + badgePaddingX, badgeY + badgeHeight / 2);

  // --- HEADLINE (Bottom) ---
  if (state.headline) {
    const headlineY = height - footerHeight;

    // Headline Background (Brand Color - already drawn as main background, but we can darken it or add gradient if needed)
    // For now, we rely on the main red background.

    // Setup headline text
    ctx.fillStyle = "#FFD700"; // Gold color
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const headlinePadding = width * 0.05;
    const headlineMaxWidth = width - headlinePadding * 2;

    // Calculate optimal font size to fit text in footer area
    // Max 3 lines
    const maxFontSize = Math.floor(footerHeight * 0.4);
    const minFontSize = Math.floor(footerHeight * 0.15);

    // Wrap text
    ctx.font = `bold ${maxFontSize}px ${fontFamily}`;
    let lines = wrapText(ctx, state.headline, headlineMaxWidth);
    let fontSize = maxFontSize;

    // Reduce font size if too many lines or text too wide
    // We want to fit within footerHeight with some padding
    const maxTextHeight = footerHeight * 0.8;

    while (
      (lines.length * fontSize * 1.3 > maxTextHeight || lines.length > 3) &&
      fontSize > minFontSize
    ) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      lines = wrapText(ctx, state.headline, headlineMaxWidth);
    }

    // Draw lines
    const lineHeight = fontSize * 1.3;
    const totalTextHeight = lines.length * lineHeight;
    const startY =
      headlineY + footerHeight / 2 - totalTextHeight / 2 + fontSize / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });
  }
}
