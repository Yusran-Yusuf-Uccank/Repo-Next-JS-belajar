'use client';
import React, { useRef, useState } from 'react';

interface DocumentViewerProps {
  showSignForm: boolean;
  onAtBottom: () => void;
  onScrollingUp: () => void;
  pdfUrl: string;
}

export const DocumentViewer = ({ showSignForm, onAtBottom, onScrollingUp, pdfUrl }: DocumentViewerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State untuk melacak apakah user benar-benar sudah di ujung bawah
  const [isAtVeryBottom, setIsAtVeryBottom] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      
      // Cek apakah scroll sudah mencapai batas paling bawah (toleransi 5px)
      const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5;
      setIsAtVeryBottom(isBottom);

      // Sembunyikan form jika user scroll ke atas cukup jauh
      if (scrollTop + clientHeight < scrollHeight - 150) {
        onScrollingUp();
      }
    }
  };

  // --- DETEKSI OVERSCROLL (MOUSE / TRACKPAD) ---
  const handleWheel = (e: React.WheelEvent) => {
    // e.deltaY > 0 artinya user sedang scroll ke arah bawah
    if (isAtVeryBottom && e.deltaY > 0) {
      onAtBottom();
    }
  };

  // --- DETEKSI OVERSCROLL (LAYAR SENTUH / HP) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAtVeryBottom) {
      const touchEndY = e.touches[0].clientY;
      // Jika jarak usapan ke atas (scroll ke bawah) lebih dari 30px
      if (touchStartY - touchEndY > 30) { 
        onAtBottom();
      }
    }
  };

  return (
    <div className={`transition-all duration-1000 ease-in-out border-2 border-blue-200 rounded-xl bg-white shadow-lg flex flex-col ${
      showSignForm ? 'h-[40vh]' : 'h-[85vh]'
    }`}>
      <div className="p-4 border-b bg-blue-50 rounded-t-xl flex justify-between items-center">
        <h1 className="font-bold text-lg text-blue-900">Dokumen Pasal & Ketentuan</h1>
        {!showSignForm && (
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full animate-pulse">
            Baca hingga akhir dokumen
          </span>
        )}
      </div>

      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        onWheel={handleWheel}             // Listener Mouse
        onTouchStart={handleTouchStart}   // Listener Touch
        onTouchMove={handleTouchMove}     // Listener Touch
        className="flex-1 overflow-y-auto bg-gray-500 p-2 scroll-smooth"
      >
        <div className="w-full h-[300%] bg-white shadow-md">
          <embed
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
            className="w-full h-full border-none pointer-events-none"
            title="Dokumen Pasal"
          />
        </div>
        
        {/* Footer PDF Dinamis */}
        <div className={`h-14 flex items-center justify-center border-t transition-colors duration-500 ${
          isAtVeryBottom && !showSignForm ? 'bg-blue-100' : 'bg-white'
        }`}>
          {isAtVeryBottom && !showSignForm ? (
            <p className="text-sm font-bold text-blue-800 animate-bounce">
              ↓ Scroll sekali lagi untuk Tanda Tangan ↓
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