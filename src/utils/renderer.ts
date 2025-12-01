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

  // For Durbin News layout, handle background differently
  if (state.settings.layout === 'durbin-news') {
    drawOverlayElements(ctx, state, width, height);
  } else {
    // Draw background image for other layouts
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
    case 'durbin-news':
      drawDurbinNewsLayout(ctx, state, width, height, padding, logoSize);
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
  padding: number,
  logoSize: number
): void => {
  // Facebook minimal layout: clean typography with subtle branding
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
      drawMinimalistHeadlineBar(ctx, state, width, height, padding, logoSize);
    };
    logoImg.src = state.logo;
  } else {
    // Draw headline bar immediately if no logo
    drawMinimalistHeadlineBar(ctx, state, width, height, padding, logoSize);
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
  padding: number,
  _logoSize: number
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

const drawDurbinNewsLayout = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  logoSize: number
): void => {
  // Draw red background
  ctx.fillStyle = '#8B1538'; // Deep red color matching the screenshot
  ctx.fillRect(0, 0, width, height);

  // Calculate image dimensions - centered with margins
  const imgMargin = 80;
  const imgWidth = width - (imgMargin * 2);
  const imgHeight = Math.floor(height * 0.55); // 55% of canvas height
  const imgX = imgMargin;
  const imgY = 160; // Position below header area

  // Draw white border around image
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(imgX - 8, imgY - 8, imgWidth + 16, imgHeight + 16);

  // Draw main image in center with border (FIXED: Use cover scaling to fill full space)
  if (state.mainImage) {
    const imgImg = new Image();
    imgImg.onload = () => {
      // Calculate aspect ratio and use cover scaling (fill entire space)
      const imgAspect = imgImg.width / imgImg.height;
      const containerAspect = imgWidth / imgHeight;

      const drawWidth = imgWidth;
      const drawHeight = imgHeight;
      const drawX = imgX;
      const drawY = imgY;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = imgImg.width;
      let sourceHeight = imgImg.height;

      if (imgAspect > containerAspect) {
        // Image is wider - crop sides to fit height
        sourceWidth = imgImg.height * containerAspect;
        sourceX = (imgImg.width - sourceWidth) / 2;
      } else {
        // Image is taller - crop top/bottom to fit width
        sourceHeight = imgImg.width / containerAspect;
        sourceY = (imgImg.height - sourceHeight) / 2;
      }

      ctx.drawImage(imgImg, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, drawWidth, drawHeight);
    };
    imgImg.src = state.mainImage;
  } else {
    // Draw placeholder
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
  }

  // Draw other elements immediately
  drawDurbinNewsElements(ctx, state, width, height, padding, logoSize);
};

const drawDurbinNewsElements = (
  ctx: CanvasRenderingContext2D,
  state: CardState,
  width: number,
  height: number,
  padding: number,
  logoSize: number
): void => {
  // Draw DURBIN NEWS logo in top-left (FIXED: Proper size, contained in header area)
  if (state.logo) {
    const logoImg = new Image();
    logoImg.onload = () => {
      const logoX = padding + 20;
      const logoY = padding + 20;
      // Keep logo contained within header area (before image starts at y=160)
      const maxLogoHeight = 120; // Max height to stay above image area
      const logoWidth = logoSize * 1.8; // Reasonable width
      const logoHeight = Math.min(logoSize * 0.8, maxLogoHeight); // Constrain height

      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
    };
    logoImg.src = state.logo;
  } else {
    // Draw text logo if no image provided (contained size)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('DURBIN', padding + 20, padding + 20);
    ctx.fillText('NEWS', padding + 20, padding + 55);
  }

  // Draw date in top-right (Bengali style) - aligned with logo height
  const dateText = state.date || '৩০ নভেম্বর, ২০২৫';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  
  // Draw date background - aligned with logo position
  const dateWidth = ctx.measureText(dateText).width + 20;
  const dateHeight = 40;
  const dateX = width - dateWidth - padding;
  const dateY = padding + 20; // Same Y position as logo
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(dateX - 10, dateY - 5, dateWidth + 20, dateHeight);
  
  // Draw date text
  ctx.fillStyle = '#000000';
  ctx.fillText(dateText, width - padding - 10, padding + 30);

  // Draw additional text - positioned below date, staying in header area
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('সর্বশেষ সংবাদ', width - padding - 10, padding + 75);

  // Draw headline at bottom (FIXED: Use brand color for background)
  if (state.headline) {
    const headlineY = height - 120;
    const headlineHeight = 100;
    
    // Draw headline background using brand color
    ctx.fillStyle = state.settings.brandColor;
    ctx.fillRect(0, headlineY, width, headlineHeight);
    
    // Setup headline text
    ctx.fillStyle = '#FFD700'; // Gold color for text
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Wrap text for headline
    const headlineMaxWidth = width - (padding * 2);
    const lines = wrapText(ctx, state.headline, headlineMaxWidth);
    
    // Calculate font size
    const fontSize = calculateFontSize(
      ctx,
      state.headline,
      headlineMaxWidth,
      48,
      24
    );

    ctx.font = `bold ${fontSize}px Arial`;

    // Draw each line centered
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = headlineY + (headlineHeight / 2) - (totalHeight / 2) + (fontSize / 2);

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + (index * lineHeight));
    });
  }
};