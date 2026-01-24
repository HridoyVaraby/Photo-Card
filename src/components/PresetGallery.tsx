import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PresetGalleryProps {
    onSelect: (url: string) => void;
}

const PRESETS = [
    { id: 'news', src: '/presets/news.png', label: 'News' },
    { id: 'tech', src: '/presets/tech.png', label: 'Technology' },
    { id: 'city', src: '/presets/city.png', label: 'City' },
    { id: 'nature', src: '/presets/nature.png', label: 'Nature' },
    { id: 'office', src: '/presets/office.png', label: 'Business' },
    { id: 'sports', src: '/presets/sports.png', label: 'Sports' },
];

export const PresetGallery: React.FC<PresetGalleryProps> = ({
    onSelect
}) => {
    const handleSelect = async (src: string) => {
        // Fetch the blob to treat it like a file upload if needed, or just pass URL
        // For this app, simply passing the URL string works if CardState supports it, 
        // but UploadField usually returns a File object or data URL.
        // CardState.mainImage is string | null. So URL is fine.

        // However, to ensure cross-origin safety if drawn on canvas, 
        // we might need to convert to dataURL (base64) to avoid tainting 
        // if these were external. Since they are local /public, it's safer.
        // But standard renderer.ts uses `loadImage` which handles crossOrigin anonymous.
        // Local files are fine.
        onSelect(src);
    };

    return (
        <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <ImageIcon className="w-3 h-3" />
                <span>Quick Select</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelect(preset.src)}
                        className="group relative aspect-square rounded-md overflow-hidden border border-border hover:border-accent transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                        title={preset.label}
                    >
                        <img
                            src={preset.src}
                            alt={preset.label}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                            <span className="text-[10px] font-medium text-white truncate w-full text-center">
                                {preset.label}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
