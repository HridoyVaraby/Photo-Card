const imageCache = new Map<string, HTMLImageElement>();

export const loadImage = (src: string): Promise<HTMLImageElement> => {
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src)!);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Enable CORS for images
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
};
