import * as React from "react"
import { cn } from "../../lib/utils"

// A simple styled range input for now, replacing the default browser one.
// Professional look requires removing default appearance.

export interface SliderProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                type="range"
                className={cn(
                    "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
