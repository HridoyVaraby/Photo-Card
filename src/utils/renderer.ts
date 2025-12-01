import { CardState } from '../types';

export const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;

    if (width < maxWidth) {
      currentLine += ' ' + word;
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
        while (ctx.measureText(line + '...').width > maxWidth && line.length > 0) {
          line = line.slice(0, -1);
        }
        return line + '...';
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
  minFontSize: number = 16
): number => {
  let fontSize = maxFontSize;

  ctx.font = `bold ${fontSize}px ${ctx.font.split(' ').pop()}`;

  while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px ${ctx.font.split(' ').pop()}`;
  }

  return fontSize;
};

export const renderCard = (
  canvas: HTMLCanvasElement,
  state: CardState,
  scale: number = 1
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const { width, height } = state.settings;
  const dpr = window.devicePixelRatio || 1;

  // Set canvas size with device pixel ratio
  canvas.width = width * scale * dpr;
  canvas.height = height * scale * dpr;

  // Scale context for device pixel ratio
  ctx.scale(scale * dpr, scale * dpr);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background image
  if (state.mainImage) {
    const bgImg = new Image();
    bgImg.onload = () => {
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

      // Continue with other elements after background is drawn
      drawOverlayElements(ctx, state, width, height);
    };
    bgImg.src = state.mainImage;
  } else {
    // Draw placeholder background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    drawOverlayElements(ctx, state, width, height);
  }
};

const drawOverlayElements = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number
): void => {
  const padding = 32;
  const logoSize = Math.floor(width * 0.14); // 14% of canvas width

  // Choose layout based on settings
  const layout = state.settings.layout || 'default';

  switch (layout) {
    case 'facebook-modern':
      drawFacebookModernLayout(ctx, state, width, height, padding, logoSize);
      break;
    case 'facebook-minimal':
      drawFacebookMinimalLayout(ctx, state, width, height, padding, logoSize);
      break;
    default:
      drawDefaultLayout(ctx, state, width, height, padding, logoSize);
  }
};

const drawDefaultLayout = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  logoSize: number
): void => {
  // Draw logo if available
  if (state.logo) {
    const logoImg = new Image();
    logoImg.onload = () => {
      // Draw logo in top-right with padding
      const logoX = width - logoSize - padding;
      const logoY = padding;

      // Create rounded rectangle for logo background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 8);
      ctx.fill();

      // Draw logo
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

      // Draw headline bar after logo is drawn
      drawHeadlineBar(ctx, state, width, height, padding);
    };
    logoImg.src = state.logo;
  } else {
    // Draw headline bar immediately if no logo
    drawHeadlineBar(ctx, state, width, height, padding);
  }
};

const drawFacebookModernLayout = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  logoSize: number
): void => {
  // Facebook modern layout: logo top-left, headline in semi-transparent overlay box
  if (state.logo) {
    const logoImg = new Image();
    logoImg.onload = () => {
      // Draw logo in top-left
      const logoX = padding;
      const logoY = padding;

      // Create rounded rectangle for logo background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 12);
      ctx.fill();

      // Draw logo
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

      // Draw headline in bottom overlay
      drawFacebookHeadlineOverlay(ctx, state, width, height, padding);
    };
    logoImg.src = state.logo;
  } else {
    // Draw headline immediately if no logo
    drawFacebookHeadlineOverlay(ctx, state, width, height, padding);
  }
};

const drawFacebookMinimalLayout = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  _padding: number,
  _logoSize: number
): void => {
  // Facebook minimal layout: clean typography with subtle branding
  const padding = 32;
  if (state.logo) {
    const logoImg = new Image();
    logoImg.onload = () => {
      // Small logo in top-right corner
      const smallLogoSize = Math.floor(width * 0.08);
      const logoX = width - smallLogoSize - padding;
      const logoY = padding;

      // Draw logo without background for minimal look
      ctx.globalAlpha = 0.8;
      ctx.drawImage(logoImg, logoX, logoY, smallLogoSize, smallLogoSize);
      ctx.globalAlpha = 1.0;

      // Draw minimalist headline bar
      drawMinimalistHeadlineBar(ctx, state, width, height, padding);
    };
    logoImg.src = state.logo;
  } else {
    // Draw headline bar immediately if no logo
    drawMinimalistHeadlineBar(ctx, state, width, height, padding);
  }
};

const drawFacebookHeadlineOverlay = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  _padding: number
): void => {
  const overlayHeight = Math.floor(height * 0.3); // 30% of canvas height
  const overlayY = height - overlayHeight;
  const overlayPadding = 40;

  // Draw semi-transparent overlay background with gradient
  const gradient = ctx.createLinearGradient(0, overlayY, 0, height);
  gradient.addColorStop(0, state.settings.brandColor + '00');
  gradient.addColorStop(0.5, state.settings.brandColor + '40');
  gradient.addColorStop(1, state.settings.brandColor + 'cc');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, overlayY, width, overlayHeight);

  // Setup text properties
  const textMaxWidth = width - (overlayPadding * 2);
  const textX = overlayPadding;
  const textY = overlayY + (overlayHeight / 2);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
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
      Math.floor(overlayHeight * 0.25)
    );

    ctx.font = `bold ${fontSize}px ${ctx.font.split(' ').pop()}`;

    // Draw each line
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = textY - (totalHeight / 2) + (fontSize / 2);

    lines.forEach((line, index) => {
      ctx.fillText(line, textX, startY + (index * lineHeight));
    });
  }
};

const drawMinimalistHeadlineBar = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number
): void => {
  const barHeight = Math.floor(height * 0.15); // 15% for minimal look
  const barY = height - barHeight;

  // Draw subtle bottom bar with gradient
  const gradient = ctx.createLinearGradient(0, barY, 0, height);
  gradient.addColorStop(0, state.settings.brandColor + 'ee'); // 93% opacity
  gradient.addColorStop(1, state.settings.brandColor); // 100% opacity

  ctx.fillStyle = gradient;
  ctx.fillRect(0, barY, width, barHeight);

  // Setup text properties
  const textMaxWidth = width - (padding * 2);
  const textX = padding;
  const textY = barY + (barHeight / 2);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
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
      Math.floor(barHeight * 0.3)
    );

    ctx.font = `600 ${fontSize}px ${ctx.font.split(' ').pop()}`;

    // Draw each line
    const lineHeight = fontSize * 1.1;
    const totalHeight = lines.length * lineHeight;
    const startY = textY - (totalHeight / 2) + (fontSize / 2);

    lines.forEach((line, index) => {
      ctx.fillText(line, textX, startY + (index * lineHeight));
    });
  }
};

const drawHeadlineBar = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number
): void => {
  const barHeight = Math.floor(height * 0.25); // 25% of canvas height
  const barY = height - barHeight;

  // Draw semi-transparent overlay bar
  ctx.fillStyle = state.settings.brandColor + 'e6'; // 90% opacity (hex e6)
  ctx.fillRect(0, barY, width, barHeight);

  // Setup text properties
  const textMaxWidth = width - (padding * 2);
  const textX = padding;
  const textY = barY + (barHeight / 2);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
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
      Math.floor(barHeight * 0.3)
    );

    ctx.font = `bold ${fontSize}px ${ctx.font.split(' ').pop()}`;

    // Draw each line
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = textY - (totalHeight / 2) + (fontSize / 2);

    lines.forEach((line, index) => {
      ctx.fillText(line, textX, startY + (index * lineHeight));
    });
  }
};