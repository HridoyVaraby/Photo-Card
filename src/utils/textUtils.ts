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
    fontFamily: string,
    maxFontSize: number = 48,
    minFontSize: number = 16,
): number => {
    let fontSize = maxFontSize;

    ctx.font = `bold ${fontSize}px ${fontFamily}`;

    while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
    }

    return fontSize;
};
