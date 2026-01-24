export const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number | null = 3,
    ellipsis: boolean = true,
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

    // Handle truncation if maxLines is set
    if (maxLines !== null && lines.length > maxLines) {
        return lines.slice(0, maxLines).map((line, index) => {
            if (index === maxLines - 1) {
                // Truncate last permitted line if needed
                if (ellipsis) {
                    while (
                        ctx.measureText(line + "...").width > maxWidth &&
                        line.length > 0
                    ) {
                        line = line.slice(0, -1);
                    }
                    return line + "...";
                }
            }
            return line;
        });
    }

    return lines;
};

export const calculateMultiLineFontSize = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxHeight: number,
    fontFamily: string,
    maxFontSize: number = 48,
    minFontSize: number = 14, // Lowered minimal size as requested
    lineHeightMultiplier: number = 1.2,
    maxLines: number | null = 3 // Enforce line limit during calculation
): number => {
    let fontSize = maxFontSize;

    // Linear search down from maxFontSize
    while (fontSize >= minFontSize) {
        ctx.font = `bold ${fontSize}px ${fontFamily}`;

        // Wrap text WITHOUT truncation to see true size, unless we want to fit proper lines
        // Actually, we want to know if the FULL text fits into maxLines lines.
        // So we wrap without limit first, measure, and check count.
        const lines = wrapText(ctx, text, maxWidth, null);

        const totalHeight = lines.length * (fontSize * lineHeightMultiplier);

        // It fits if:
        // 1. Total height is within bounds
        // 2. AND number of lines does not exceed maxLines (if specified)
        const fitsHeight = totalHeight <= maxHeight;
        const fitsLines = maxLines === null || lines.length <= maxLines;

        if (fitsHeight && fitsLines) {
            return fontSize;
        }

        fontSize -= 2;
    }

    return minFontSize;
};
// Re-export old name for backward compatibility during refactor, but it uses new logic
export const calculateFontSize = calculateMultiLineFontSize;
