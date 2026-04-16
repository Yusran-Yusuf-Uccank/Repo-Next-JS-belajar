'use client';
import React, { useRef, useState } from 'react';

interface DocumentViewerProps {
  isCompact: boolean; // Menggantikan showSignForm
  onOverscroll: () => void;
  onScrollUp: () => void;
  pdfUrl: string;
}

export const DocumentViewer = ({ isCompact, onOverscroll, onScrollUp, pdfUrl }: DocumentViewerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtVeryBottom, setIsAtVeryBottom] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5;
      setIsAtVeryBottom(isBottom);

      if (scrollTop + clientHeight < scrollHeight - 150) {
        onScrollUp();
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isAtVeryBottom && e.deltaY > 0) onOverscroll();
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartY(e.touches[0].clientY);
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAtVeryBottom && (touchStartY - e.touches[0].clientY > 30)) { 
      onOverscroll();
    }
  };

  return (
    <div className={`transition-all duration-1000 ease-in-out border-2 border-blue-200 rounded-xl bg-white shadow-lg flex flex-col ${
      isCompact ? 'h-[40vh]' : 'h-[85vh]'
    }`}>
      <div className="p-4 border-b bg-blue-50 rounded-t-xl flex justify-between items-center">
        <h1 className="font-bold text-lg text-blue-900">Dokumen Pasal & Ketentuan</h1>
        {!isCompact && (
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full animate-pulse">
            Baca hingga akhir dokumen
          </span>
        )}
      </div>

      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="flex-1 overflow-y-auto bg-gray-500 p-2 scroll-smooth"
      >
        <div className="w-full h-[300%] bg-white shadow-md">
          <embed
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
            className="w-full h-full border-none pointer-events-none"
            title="Dokumen Pasal"
          />
        </div>
        
        <div className={`h-14 flex items-center justify-center border-t transition-colors duration-500 ${
          isAtVeryBottom && !isCompact ? 'bg-blue-100' : 'bg-white'
        }`}>
          {isAtVeryBottom && !isCompact ? (
            <p className="text-sm font-bold text-blue-800 animate-bounce">
              ↓ Scroll sekali lagi untuk Keputusan ↓
            </p>
          ) : (
            <p className="text-sm font-bold text-gray-400 italic">
              --- Akhir Dokumen ---
            </p>
          )}
        </div>
      </div>
    </div>
  );
};