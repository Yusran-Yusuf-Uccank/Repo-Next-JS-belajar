'use client';
import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/app/ui/button';

interface SignatureFormProps {
  isVisible: boolean;
  onClear: () => void;
  onSubmit: (signatureData: string | null) => void;
  sigRef: React.RefObject<SignatureCanvas>;
}

export const SignatureForm = ({ isVisible, onClear, onSubmit, sigRef }: SignatureFormProps) => {
  const [isAgreed, setIsAgreed] = useState(false);

  // Otomatis centang jika form ini muncul (karena user sudah klik "Setujui" di tahap sebelumnya)
  useEffect(() => {
    if (isVisible) {
      setIsAgreed(true);
    }
  }, [isVisible]);

  return (
    <div className={`transition-all duration-1000 transform ${
      isVisible ? 'opacity-100 translate-y-0 scale-100 h-auto' : 'opacity-0 translate-y-10 scale-95 h-0 overflow-hidden'
    }`}>
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
        
        {/* --- Bagian Konfirmasi Hukum --- */}
        <div className={`mb-6 p-4 rounded-lg border transition-all ${
          isAgreed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            />
            <span className={`text-sm leading-relaxed ${isAgreed ? 'text-green-800' : 'text-amber-900'}`}>
              Saya menyatakan telah membaca seluruh isi dokumen dan dengan sadar **menyetujui segala hukum, syarat, dan ketentuan** yang berlaku.
            </span>
          </label>
        </div>

        {/* --- Area Tanda Tangan --- */}
        <div className={`transition-opacity duration-500 ${isAgreed ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-blue-600">✍️</span>
            Tanda Tangan Digital:
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4 h-48 relative overflow-hidden">
            {!isAgreed && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-[1px] z-10 rounded-lg">
                <p className="text-gray-500 text-sm font-medium text-center px-4">
                  Centang persetujuan di atas untuk mengaktifkan kanvas
                </p>
              </div>
            )}
            <SignatureCanvas
              ref={sigRef}
              penColor="black"
              canvasProps={{ 
                className: 'sigCanvas w-full h-full cursor-crosshair',
                // Pastikan canvas memiliki ID jika diperlukan untuk debugging
              }}
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={onClear} 
              variant="outline" 
              className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
              disabled={!isAgreed}
            >
              Hapus
            </Button>
            <Button 
              onClick={() => onSubmit(sigRef.current?.toDataURL() || null)}
              className="flex-[2] bg-blue-700 hover:bg-blue-800 text-white font-bold disabled:bg-gray-400"
              disabled={!isAgreed}
            >
              Kirim Dokumen
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};