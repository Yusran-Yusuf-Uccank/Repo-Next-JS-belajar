'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/app/ui/button';

export default function SignaturePage() {
  const [showSignForm, setShowSignForm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Ganti BASE_URL dengan folder tempat kamu simpan 18 gambar tadi
  // Contoh: https://raw.githubusercontent.com/username/repo/main/public/pasal/
  const imageBaseUrl = "https://link-hosting-kamu.com/pasal/";
  
  const totalPages = 18;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      
      // Deteksi halaman ke-18 (paling bawah)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isAtBottom && !showSignForm) {
        setShowSignForm(true);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
        
        {/* Kontainer Dokumen */}
        <div className={`transition-all duration-700 border-2 border-blue-200 rounded-xl bg-white shadow-lg flex flex-col ${showSignForm ? 'h-[40vh]' : 'h-[85vh]'}`}>
          
          <div className="p-4 border-b bg-blue-50 rounded-t-xl flex justify-between items-center">
            {/*<h1 className="font-bold text-blue-900">Dokumen Pasal (18 Halaman)</h1>*/}
            {!showSignForm && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full animate-pulse">Scroll sampai halaman terakhir</span>}
          </div>

          {/* Area Scroll Gambar */}
          <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto bg-gray-400 p-2 space-y-1">
            <div className="max-w-2xl mx-auto shadow-2xl">
              {pages.map((num) => (
                <img 
                  key={num}
                  src={`${imageBaseUrl}halaman-${num}.jpg`} 
                  alt={`Halaman ${num}`}
                  className="w-full h-auto block bg-white"
                  loading="lazy" // Penting: Agar client tidak berat saat loading awal
                />
              ))}
            </div>

            <div className="h-20 flex items-center justify-center bg-white border-t mt-4">
               <p className="text-sm font-bold text-blue-600">--- AKHIR HALAMAN 18 ---</p>
            </div>
          </div>
        </div>

        {/* Form Tanda Tangan */}
        <div className={`transition-all duration-1000 transform ${showSignForm ? 'opacity-100 scale-100 h-auto' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow-xl">
            <label className="block text-sm font-bold text-gray-700 mb-2">Tanda Tangan Digital:</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4 h-48">
              <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{className: 'sigCanvas w-full h-full'}} />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => sigCanvas.current?.clear()} variant="outline" className="flex-1">Ulangi</Button>
              <Button className="flex-[2] bg-blue-700 text-white font-bold">Kirim Persetujuan</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}