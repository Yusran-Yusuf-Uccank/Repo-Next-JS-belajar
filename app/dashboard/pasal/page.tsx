'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { DocumentViewer } from '@/app/ui/dashboard/DocumentViewer';
import { SignatureForm } from '@/app/ui/dashboard/SignatureForm';

type FlowState = 'reading' | 'decision' | 'signing';

export default function SignaturePage() {
  const router = useRouter(); // Inisialisasi router
  const [flowState, setFlowState] = useState<FlowState>('reading');
  const sigCanvas = useRef<SignatureCanvas>(null) as React.RefObject<SignatureCanvas>;
  
  const PDF_URL = "https://drive.google.com/uc?id=1MNvVCYDXzTXpxCgL2g9eEElQJJGeG7KQ";

  const handleOverscroll = () => {
    if (flowState === 'reading') {
      setFlowState('decision');
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleReject = () => {
    const confirmReject = confirm("Apakah Anda yakin ingin menolak dokumen ini?");
    if (confirmReject) {
      alert("Anda telah menolak dokumen ini.");
      setFlowState('reading'); 
    }
  };

  const handleApprove = () => {
    setFlowState('signing');
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

 const handleSubmitSignature = async (data: string | null) => {
  if (!data || sigCanvas.current?.isEmpty()) {
    alert("Silakan tanda tangan terlebih dahulu");
    return;
  }

  try {
    // 1. DOWNLOAD SEBAGAI PNG (Opsional, jika ingin user punya salinannya)
    const link = document.createElement('a');
    link.href = data; // 'data' sudah dalam format image/png oleh signature-canvas
    link.download = `tanda-tangan-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. KONVERSI KE BLOB/FILE (Untuk dikirim ke Server/API)
    // Ini mengubah string Base64 menjadi file PNG biner yang sesungguhnya
    const blob = await fetch(data).then((res) => res.blob());
    const file = new File([blob], "signature.png", { type: "image/png" });

    // Contoh jika ingin dikirim via FormData ke API
    // const formData = new FormData();
    // formData.append('file', file);
    // await axios.post('/api/upload', formData);

    console.log("File PNG siap dikirim:", file);
    alert("Tanda tangan berhasil diunduh sebagai PNG!");
    router.replace('/dashboard');
  } catch (error) {
    console.error("Gagal memproses PNG:", error);
    alert("Terjadi kesalahan saat memproses gambar.");
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        
        {/* PDF VIEWER - Sekarang menggunakan Default Export */}
        <DocumentViewer 
          pdfUrl={PDF_URL}
          isCompact={flowState !== 'reading'} 
          onOverscroll={handleOverscroll}
          onScrollUp={() => setFlowState('reading')}
        />

        {/* --- KOTAK KEPUTUSAN --- */}
        <div className={`transition-all duration-700 transform origin-top ${
          flowState === 'decision' 
            ? 'opacity-100 scale-100 h-auto' 
            : 'opacity-0 scale-95 h-0 overflow-hidden'
        }`}>
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg text-center flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Persetujuan Dokumen</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Apakah Anda menyetujui seluruh pasal dan ketentuan yang tertera di dalam dokumen di atas?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              {/* Tombol Reject Tanpa Lucide */}
              <button 
                onClick={handleReject}
                className="flex-1 flex justify-center items-center gap-2 max-w-[200px] px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-lg transition-colors"
              >
                <span>✕</span> Tolak
              </button>
              
              {/* Tombol Approve Tanpa Lucide */}
              <button 
                onClick={handleApprove}
                className="flex-1 flex justify-center items-center gap-2 max-w-[200px] px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <span>✓</span> Setujui
              </button>
            </div>
          </div>
        </div>

        {/* --- KANVAS TANDA TANGAN --- */}
        <SignatureForm 
          isVisible={flowState === 'signing'}
          sigRef={sigCanvas}
          onClear={() => sigCanvas.current?.clear()}
          onSubmit={handleSubmitSignature}
        />

        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Proto Tanda Tangan Digital
        </p>

      </div>
    </div>
  );
}