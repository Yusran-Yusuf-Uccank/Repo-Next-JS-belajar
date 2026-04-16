'use client';
import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { DocumentViewer } from '@/app/ui/dashboard/DocumentViewer';
import { SignatureForm } from '@/app/ui/dashboard/SignatureForm';

export default function SignaturePage() {
  const [showSignForm, setShowSignForm] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const PDF_URL = "https://drive.google.com/uc?id=1MNvVCYDXzTXpxCgL2g9eEElQJJGeG7KQ";

  const handleAtBottom = () => {
    if (!showSignForm) {
      setTimeout(() => {
        setShowSignForm(true);
        // Scroll halus ke bawah agar form tanda tangan langsung terlihat
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 500);
    }
  };

  const handleSubmit = async (data: string | null) => {
    if (!data || sigCanvas.current?.isEmpty()) {
      alert("Silakan tanda tangan terlebih dahulu");
      return;
    }

    try {
      console.log("Mengirim Tanda Tangan...", data);
      // Simulasi proses pengiriman
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Persetujuan berhasil dikirim!");
    } catch (error) {
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        
        {/* Konten Utama */}
        <DocumentViewer 
          pdfUrl={PDF_URL}
          showSignForm={showSignForm}
          onAtBottom={handleAtBottom}
          onScrollingUp={() => setShowSignForm(false)}
        />

        <SignatureForm 
          isVisible={showSignForm}
          sigRef={sigCanvas}
          onClear={() => sigCanvas.current?.clear()}
          onSubmit={handleSubmit}
        />

        {/* Footer Minimalis */}
        <p className="text-center text-[10px] text-gray-400 mt-2 uppercase tracking-widest">
          Digital Signature Verification System
        </p>

      </div>
    </div>
  );
}