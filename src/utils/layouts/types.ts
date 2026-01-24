import { CardState } from "../../types";

export interface LayoutContext {
    ctx: CanvasRenderingContext2D;
    state: CardState;
    width: number;
    height: number;
    logoSize: number;
    padding: number;
}

export interface LayoutStrategy {
    draw: (context: LayoutContext) => Promise<void>;
}
