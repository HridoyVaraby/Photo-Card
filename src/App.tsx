import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Palette, Type, Image as ImageIcon } from "lucide-react";
import { CardState } from "./types";
import { Toolbar } from "./components/Toolbar";
import { CanvasPreview } from "./components/CanvasPreview";
import { renderCard } from "./utils/renderer";
import { exportAndDownload } from "./utils/exportUtils";
import { Button } from "./components/ui/button";

const initialState: CardState = {
  mainImage: null,
  logo: null,
  headline: "",
  ctaText: "বিস্তারিত কমেন্টে",
  date: "৩০ নভেম্বর, ২০২৫",
  settings: {
    width: 1080,
    height: 1080,
    font: "Tiro Bangla",
    brandColor: "#be123c", // Updated to new accent default
    format: "png",
    quality: 90,
    layout: "durbin-news",
  },
};

function App() {
  const [state, setState] = useState<CardState>(initialState);
  const [isExporting, setIsExporting] = useState(false);

  const handleStateChange = useCallback((updates: Partial<CardState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  }, []);

  const handleExport = useCallback(async () => {
    if (!state.mainImage || !state.headline.trim()) {
      alert("Please add an image and headline before exporting.");
      return;
    }

    setIsExporting(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = state.settings.width;
      canvas.height = state.settings.height;

      await renderCard(canvas, state, 1);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) requestAnimationFrame(() => resolve(blob));
            else reject(new Error("Failed to create blob"));
          },
          `image/${state.settings.format}`,
          state.settings.format === "jpeg"
            ? (state.settings.quality || 90) / 100
            : undefined,
        );
      });

      await exportAndDownload(blob, state.headline, state.settings.format);
    } catch (error) {
      console.error("Export failed:", error);
      alert(
        `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsExporting(false);
    }
  }, [state]);

  const isReadyToExport = state.mainImage && state.headline.trim() !== "";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-red-900 flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
              N
            </div>
            <h1 className="text-lg font-serif font-semibold tracking-tight text-primary">
              News Card Generator
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleExport}
              disabled={!isReadyToExport || isExporting}
              variant="default" // Explicit variant
              className={`transition-all duration-300 ${!isReadyToExport ? 'opacity-50' : 'hover:scale-105'}`}
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-lg">⟳</span> Exporting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export Card
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-full">

          {/* Left Column - Controls (Sticky Sidebar) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-hide pr-2">
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-serif font-semibold">Design Studio</h2>
              <p className="text-sm text-muted-foreground">Customize your asset details below.</p>
            </div>

            <Toolbar state={state} onStateChange={handleStateChange} />
          </div>

          {/* Right Column - Preview (Art Gallery) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-secondary/30 rounded-2xl border border-border/50 p-8 flex items-center justify-center min-h-[600px] shadow-sm relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

              <motion.div
                layout
                className="relative shadow-2xl rounded-sm overflow-hidden ring-1 ring-black/5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <CanvasPreview
                  state={state}
                  onExport={handleExport}
                  isLoading={isExporting}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-accent font-medium mb-2">
                  <ImageIcon className="w-4 h-4" /> <span>High Res</span>
                </div>
                <p className="text-xs text-muted-foreground">Always upload images at least 2x target resolution for crisp text.</p>
              </div>
              <div className="bg-card border border-border/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-accent font-medium mb-2">
                  <Type className="w-4 h-4" /> <span>Typography</span>
                </div>
                <p className="text-xs text-muted-foreground">Keep headlines concise. 2-3 lines work best for social impact.</p>
              </div>
              <div className="bg-card border border-border/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-accent font-medium mb-2">
                  <Palette className="w-4 h-4" /> <span>Color</span>
                </div>
                <p className="text-xs text-muted-foreground">Use your official brand color hex code for consistency.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
