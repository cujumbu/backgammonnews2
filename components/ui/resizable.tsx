import * as React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onResize'>;

interface ResizableProps extends BaseProps {
  direction?: "horizontal" | "vertical";
  onResize?: (sizes: number[]) => void;
  defaultSizes?: number[];
  minSizes?: number[];
}

const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  ({ className, children, direction = "horizontal", onResize, defaultSizes, minSizes, ...props }, ref) => {
    const [sizes, setSizes] = React.useState<number[]>(defaultSizes || []);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);
    const startPos = React.useRef(0);
    const startSizes = React.useRef<number[]>([]);

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      isDragging.current = true;
      startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      startSizes.current = [...sizes];
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        
        const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
        const delta = currentPos - startPos.current;
        const containerSize = direction === "horizontal" 
          ? containerRef.current.offsetWidth 
          : containerRef.current.offsetHeight;
        
        const newSizes = startSizes.current.map((size, i) => {
          if (i === index) {
            const newSize = size + (delta / containerSize) * 100;
            return Math.max(minSizes?.[i] || 0, newSize);
          }
          if (i === index + 1) {
            const newSize = size - (delta / containerSize) * 100;
            return Math.max(minSizes?.[i] || 0, newSize);
          }
          return size;
        });
        
        setSizes(newSizes);
        onResize?.(newSizes);
      };
      
      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          
          return (
            <React.Fragment key={index}>
              <div
                style={{ 
                  flexBasis: `${sizes[index] || 100 / React.Children.count(children)}%` 
                }}
                className="relative flex-grow"
              >
                {child}
              </div>
              {index < React.Children.count(children) - 1 && (
                <div
                  onMouseDown={(e) => handleMouseDown(e, index)}
                  className={cn(
                    "flex items-center justify-center",
                    direction === "horizontal"
                      ? "cursor-col-resize border-x w-1 hover:bg-border"
                      : "cursor-row-resize border-y h-1 hover:bg-border"
                  )}
                >
                  <GripVertical className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Resizable.displayName = "Resizable";

export { Resizable };
