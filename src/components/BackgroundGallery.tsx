import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface BackgroundGalleryProps {
    onSelect: (url: string) => void;
}

const BACKGROUNDS = [
    { id: 'geometric', src: '/presets/backgrounds/geometric.png', label: 'Geometric' },
    { id: 'paper', src: '/presets/backgrounds/paper.png', label: 'Paper' },
    { id: 'gradient', src: '/presets/backgrounds/gradient.png', label: 'Gradient' },
    { id: 'tech', src: '/presets/backgrounds/tech.png', label: 'Tech' },
    { id: 'waves', src: '/presets/backgrounds/waves.png', label: 'Waves' },
    { id: 'news', src: '/presets/backgrounds/news.png', label: 'Broadcast' },
];

export const BackgroundGallery: React.FC<BackgroundGalleryProps> = ({
    onSelect
}) => {
    return (
        <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <ImageIcon className="w-3 h-3" />
                <span>Quick Backgrounds</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {BACKGROUNDS.map((bg) => (
                    <button
                        key={bg.id}
                        type="button"
                        onClick={() => onSelect(bg.src)}
                        className="group relative aspect-video rounded-md overflow-hidden border border-border hover:border-accent transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                        title={bg.label}
                    >
                        <img
                            src={bg.src}
                            alt={bg.label}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                            <span className="text-[10px] font-medium text-white truncate w-full text-center">
                                {bg.label}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
