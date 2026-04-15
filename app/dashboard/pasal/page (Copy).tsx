'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/app/ui/button';

export default function SignaturePage() {
  const [hasRead, setHasRead] = useState(false);
  const [showSignForm, setShowSignForm] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

 const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      
      // Karena PDF biasanya berat, kita beri toleransi lebih besar (misal 30px)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30;
      const isScrollingUp = scrollTop + clientHeight < scrollHeight - 150;

      if (isAtBottom && !showSignForm) {
        setHasRead(true);
        setTimeout(() => {
          setShowSignForm(true);
        }, 1000);
      } 
      else if (isScrollingUp && showSignForm) {
        setShowSignForm(false);
      }
    }
  };

  const clear = () => sigCanvas.current?.clear();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
        
        {/* Kontainer Pasal */}
<div 
  className={`transition-all duration-1000 ease-in-out border-2 border-blue-200 rounded-xl bg-white shadow-lg flex flex-col ${
    showSignForm ? 'h-[40vh]' : 'h-[85vh]'
  }`}
>
  <div className="p-4 border-b bg-blue-50 rounded-t-xl flex justify-between items-center">
    <h1 className="font-bold text-lg text-blue-900">Dokumen Pasal & Ketentuan</h1>
    {!showSignForm && (
      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full animate-pulse">
        Scroll PDF sampai bawah untuk tanda tangan
      </span>
    )}
  </div>

  {/* Area PDF */}
 <div 
  ref={scrollRef}
  onScroll={handleScroll}
  className="flex-1 overflow-y-auto bg-gray-500 p-2"
>
  <div className="w-full h-[300%] bg-white shadow-md"> 
    <embed
      src={`https://docs.google.com/viewer?url=${encodeURIComponent("https://drive.google.com/uc?id=1MNvVCYDXzTXpxCgL2g9eEElQJJGeG7KQ")}&embedded=true`}
  className="w-full h-full border-none pointer-events-none"
  title="Dokumen Pasal"
    />
  </div>

  <div className="h-10 flex items-center justify-center bg-white border-t">
     <p className="text-sm font-bold text-blue-600 italic">--- Akhir Dokumen ---</p>
  </div>
</div>
</div>

        {/* Form Tanda Tangan - Akan muncul perlahan setelah hasRead true */}
        <div 
          className={`transition-all duration-1000 transform ${
            showSignForm 
              ? 'opacity-100 translate-y-0 scale-100 h-auto' 
              : 'opacity-0 translate-y-10 scale-95 h-0 overflow-hidden'
          }`}
        >
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tanda Tangan Digital:
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4 h-48">
              <SignatureCanvas 
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  className: 'sigCanvas w-full h-full cursor-crosshair'
                }} 
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={clear} 
                variant="outline" 
                className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
              >
                Ulangi
              </Button>
              <Button className="flex-[2] bg-blue-700 hover:bg-blue-800 text-white font-bold">
                Kirim Persetujuan
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}