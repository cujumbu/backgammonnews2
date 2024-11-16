"use client";

import * as React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  showArrows?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  interval?: number;
}

export function Carousel({
  children,
  className,
  showArrows = true,
  showDots = true,
  autoplay = false,
  interval = 5000,
  ...props
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const totalSlides = React.Children.count(children);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  React.useEffect(() => {
    if (autoplay) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [autoplay, interval]);

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${totalSlides * 100}%`,
        }}
      >
        {React.Children.map(children, (child) => (
          <div className="w-full flex-shrink-0">{child}</div>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                index === currentSlide
                  ? "bg-foreground"
                  : "bg-foreground/50 hover:bg-foreground/75"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
