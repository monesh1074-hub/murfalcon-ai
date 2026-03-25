// client/src/components/ExportPDFButton.jsx
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ExportPDFButton({ elementId, filename, className }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    
    try {
      // Force hardware rendering delay to assure UI stability
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Temporarily inject raw dark background to prevent transparent alpha artifacts on the canvas
      const originalBg = element.style.background;
      element.style.background = '#09090b'; 

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution scaling
        useCORS: true,
        backgroundColor: '#09090b',
        logging: false,
        onclone: (clonedDoc) => {
           // We can manipulate the cloned DOM before painting if needed securely here
        }
      });

      // Restore UI back to native glassmorphism transparency immediately
      element.style.background = originalBg;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename || 'Falcon_Interview_Report'}.pdf`);
      
    } catch (error) {
      console.error('Failed to parse DOM to PDF canvas:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={className || "group relative flex-1 bg-cyan-600 border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-cyan-500 py-4 px-6 rounded-2xl transition-all duration-300 text-sm font-bold tracking-widest uppercase overflow-hidden hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <span className="relative z-10 text-white flex items-center justify-center gap-2">
        <i className={`fas ${isExporting ? 'fa-spinner fa-spin text-cyan-200' : 'fa-file-pdf'} text-xs`}></i>
        {isExporting ? 'PROCESSING...' : 'EXPORT PDF'}
      </span>
    </button>
  );
}
