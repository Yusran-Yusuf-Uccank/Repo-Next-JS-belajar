'use client';
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/app/ui/button';

interface SignatureFormProps {
  isVisible: boolean;
  onClear: () => void;
  onSubmit: (signatureData: string | null) => void;
  sigRef: React.RefObject<SignatureCanvas>;
}

export const SignatureForm = ({ isVisible, onClear, onSubmit, sigRef }: SignatureFormProps) => {
  return (
    <div className={`transition-all duration-1000 transform ${
      isVisible ? 'opacity-100 translate-y-0 scale-100 h-auto' : 'opacity-0 translate-y-10 scale-95 h-0 overflow-hidden'
    }`}>
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
        <label className="block text-sm font-bold text-gray-700 mb-2">Tanda Tangan Digital:</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4 h-48">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{ className: 'sigCanvas w-full h-full cursor-crosshair' }}
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={onClear} variant="outline" className="flex-1 border-red-500 text-red-600 hover:bg-red-50">
            Ulangi
          </Button>
          <Button 
            onClick={() => onSubmit(sigRef.current?.toDataURL() || null)}
            className="flex-[2] bg-blue-700 hover:bg-blue-800 text-white font-bold"
          >
            Kirim Persetujuan
          </Button>
        </div>
      </div>
    </div>
  );
};
