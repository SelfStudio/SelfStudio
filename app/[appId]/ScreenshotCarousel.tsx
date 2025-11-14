'use client';

import { useState, useEffect, useRef } from 'react';

type ScreenshotCarouselProps = {
  screenshots: string[];
};

export default function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 为无限滚动创建扩展的截图数组
  // 在开头添加最后一张图片，在末尾添加第一张图片作为虚拟图片
  const extendedScreenshots = [];
  if (screenshots.length > 1) {
    extendedScreenshots.push(screenshots[screenshots.length - 1]); // 添加最后一张图片到开头
  }
  extendedScreenshots.push(...screenshots); // 添加原始图片
  if (screenshots.length > 1) {
    extendedScreenshots.push(screenshots[0]); // 添加第一张图片到末尾
  }

  // 处理滚动事件，更新当前索引
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.clientWidth;
      let newIndex = Math.round(scrollPosition / containerWidth);
      
      // 处理无限滚动的边界情况
      if (newIndex >= extendedScreenshots.length - 1 && screenshots.length > 1) {
        // 滚动到虚拟最后一张，立即跳转到实际第一张图片（在extended数组中是索引1）
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              left: containerWidth,
              behavior: 'auto'
            });
            setCurrentIndex(0); // 实际上是第一张图片
          }
        }, 50);
        newIndex = 0;
      } else if (newIndex <= 0 && screenshots.length > 1) {
        // 滚动到虚拟第一张，立即跳转到实际最后一张图片
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              left: (screenshots.length) * containerWidth,
              behavior: 'auto'
            });
            setCurrentIndex(screenshots.length - 1); // 实际是最后一张图片
          }
        }, 50);
        newIndex = screenshots.length - 1;
      } else {
        // 调整newIndex以匹配实际截图索引
        if (screenshots.length > 1) {
          newIndex = newIndex - 1; // 因为extended数组开头有一个虚拟图片
        }
        // 确保newIndex在实际截图范围内
        if (newIndex >= screenshots.length) {
          newIndex = screenshots.length - 1;
        } else if (newIndex < 0) {
          newIndex = 0;
        }
      }
      
      setCurrentIndex(newIndex);
    }
  };

  // 滚动到指定索引
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      // 因为extended数组开头有一个虚拟图片，所以需要+1
      const actualIndex = screenshots.length > 1 ? index + 1 : index;
      scrollContainerRef.current.scrollTo({
        left: actualIndex * containerWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
      // 用户手动滚动时暂停自动播放
      setIsAutoPlaying(false);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
      // 3秒后重新开始自动播放
      setTimeout(() => {
        setIsAutoPlaying(true);
      }, 3000);
    }
  };

  // 打开放大图片模态框
  const openModal = (index: number) => {
    // 调整索引以匹配实际截图索引
    const actualIndex = screenshots.length > 1 ? index - 1 : index;
    if (actualIndex >= 0 && actualIndex < screenshots.length) {
      setModalImageIndex(actualIndex);
      setIsModalOpen(true);
      // 暂停自动播放
      setIsAutoPlaying(false);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
    // 3秒后重新开始自动播放
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  // 切换到下一张图片
  const nextImage = () => {
    setModalImageIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
  };

  // 切换到上一张图片
  const prevImage = () => {
    setModalImageIndex((prevIndex) => (prevIndex - 1 + screenshots.length) % screenshots.length);
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, screenshots.length]);

  // 自动轮播
  useEffect(() => {
    if (isAutoPlaying && screenshots.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const containerWidth = scrollContainerRef.current.clientWidth;
          const nextIndex = (currentIndex + 1) % screenshots.length;
          // 因为extended数组开头有一个虚拟图片，所以需要+1
          const actualIndex = nextIndex + 1;
          scrollContainerRef.current.scrollTo({
            left: actualIndex * containerWidth,
            behavior: 'smooth'
          });
          setCurrentIndex(nextIndex);
        }
      }, 5000);
    }
    
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, screenshots.length]);

  // 添加滚动事件监听器
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [screenshots.length]);

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold mb-6 text-center">Screenshots</h2>
      <div className="relative overflow-hidden rounded-xl">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-mandatory snap-x scrollbar-hide gap-4 pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {extendedScreenshots.map((screenshot, index) => (
            <div 
              key={index} 
              className="snap-start flex-shrink-0 w-full"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div 
                className="aspect-[16/9] bg-gray-200 border-2 border-dashed rounded-xl w-full cursor-pointer"
                onClick={() => openModal(index)}
              >
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

      {/* 图片放大模态框 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl z-10"
              onClick={closeModal}
            >
              ×
            </button>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
              onClick={prevImage}
            >
              ‹
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
              onClick={nextImage}
            >
              ›
            </button>
            <img
              src={screenshots[modalImageIndex]}
              alt={`Screenshot ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {modalImageIndex + 1} / {screenshots.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}