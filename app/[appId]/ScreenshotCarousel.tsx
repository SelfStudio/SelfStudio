'use client';

import { useState, useEffect, useRef } from 'react';

type ScreenshotCarouselProps = {
  screenshots: string[];
};

export default function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 处理滚动事件，更新当前索引
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / containerWidth);
      
      // 确保索引在有效范围内
      if (newIndex >= 0 && newIndex < screenshots.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  // 滚动到指定索引
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * containerWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  // 添加滚动事件监听器
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold mb-6 text-center">Screenshots</h2>
      <div className="relative overflow-hidden rounded-xl">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-mandatory snap-x scrollbar-hide gap-4 pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {screenshots.map((screenshot, index) => (
            <div 
              key={index} 
              className="snap-start flex-shrink-0 w-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="aspect-[16/9] bg-gray-200 border-2 border-dashed rounded-xl w-full">
                <img 
                  src={screenshot} 
                  alt={`Screenshot ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to screenshot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}