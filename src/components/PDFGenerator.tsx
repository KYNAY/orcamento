import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate, calculateTotal } from '../utils/formatters';
import { MaterialType } from '../types';
import { File as FilePdf, Share2 } from 'lucide-react';

const PDFGenerator: React.FC = () => {
  const { quotation } = useQuotation();

  const generatePDF = () => {
    const doc = new jsPDF();
    // Group, sort, calculate as before
    const groupedMaterials = quotation.materials.reduce((acc, material) => {
      if (!acc[material.type]) acc[material.type] = [];
      acc[material.type].push(material);
      return acc;
    }, {} as Record<MaterialType, typeof quotation.materials>);
    const sortedTypes = Object.keys(groupedMaterials).sort() as MaterialType[];
    const total = quotation.materials.reduce((sum, m) => sum + calculateTotal(m.pricePerUnit, m.quantity), 0);

    // PDF setup...
    doc.setFont("helvetica", "bold"); doc.setFontSize(18);
    doc.text(`Orçamento - ${quotation.company}`, 15, 20);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(`Data: ${formatDate(new Date())}`, 15, 30);
    doc.text(`Validade: ${formatDate(quotation.validUntil)} às 00:00`, 15, 35);
    // Header sections...
    let yPos = 78;
    sortedTypes.forEach((type) => {
      doc.setFont("helvetica", "bold"); doc.setFontSize(11);
      doc.text(type, 15, yPos); yPos += 6;

      doc.setFont("helvetica", "bold"); doc.setFontSize(9);
      doc.text("Material", 15, yPos);
      doc.text("Preço/m²", 60, yPos);
      doc.text("Área (m²)", 90, yPos);
      doc.text("Medida líquida", 120, yPos);
      doc.text("Qtd", 150, yPos);
      doc.text("Total", 170, yPos);
      doc.text("Detalhes", 190, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      groupedMaterials[type].forEach((material) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        const grossArea = material.dimensions.width * material.dimensions.height * material.quantity;
        const netW = (material.dimensions.width - 0.05).toFixed(2);
        const netH = (material.dimensions.height - 0.05).toFixed(2);
        doc.text(material.name, 15, yPos);
        doc.text(formatCurrency(material.pricePerUnit), 60, yPos);
        doc.text(grossArea.toFixed(2), 90, yPos);
        doc.text(`${netW} x ${netH}`, 120, yPos);
        doc.text(String(material.quantity), 150, yPos);
        doc.text(formatCurrency(calculateTotal(material.pricePerUnit, material.quantity)), 170, yPos);
        doc.text(material.details || "-", 190, yPos);
        yPos += 6;
      });
      yPos += 4;
    });

    if (yPos > 240) { doc.addPage(); yPos = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(`Valor Total: ${formatCurrency(total)}`, 130, yPos); yPos += 10;

    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(`Forma de Pagamento: ${quotation.paymentMethod}`, 15, yPos); yPos += 6;
    if (quotation.installments && quotation.installments > 1) {
      doc.text(`${quotation.installments}x de ${formatCurrency(total / quotation.installments)}`, 15, yPos);
      yPos += 6;
    }
    if (quotation.showBankDetails && quotation.bankDetails) {
      yPos += 4;
      doc.setFont("helvetica", "bold"); doc.text("Dados para Depósito:", 15, yPos); yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Banco: ${quotation.bankDetails.bank}`, 15, yPos); yPos += 5;
      doc.text(`Agência: ${quotation.bankDetails.agency}`, 15, yPos); yPos += 5;
      doc.text(`Conta: ${quotation.bankDetails.account}`, 15, yPos); yPos += 5;
      doc.text(`CNPJ: ${quotation.bankDetails.cnpj}`, 15, yPos); yPos += 5;
      doc.text(`Nome: ${quotation.bankDetails.companyName}`, 15, yPos); yPos += 5;
      doc.text(`PIX: ${quotation.bankDetails.pix}`, 15, yPos); yPos += 10;
    }

    // Nota padrão (sempre exibe)
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.", 15, yPos);
    yPos += 4;
    doc.text("O valor final será baseado no ramenio oficial com medida real liquida de cada chapa.", 15, yPos);

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save(`Orçamento ${quotation.company} - ${quotation.client}.pdf`);
  };

  const handleShareWhatsApp = async () => {
    const doc = generatePDF();
    const pdfBlob = doc.output('blob');
    const filename = `Orçamento ${quotation.company} - ${quotation.client}.pdf`;
    if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], filename, { type: 'application/pdf' })] })) {
      try {
        await navigator.share({ files: [new File([pdfBlob], filename, { type: 'application/pdf' })], text: `Orçamento - ${quotation.company}\nCliente: ${quotation.client}` });
      } catch (err) {
        console.error('Erro ao compartilhar', err);
      }
    } else {
      const url = URL.createObjectURL(pdfBlob);
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const isDisabled = !quotation.company || !quotation.client || quotation.materials.length === 0;

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button onClick={handleDownloadPDF} disabled={isDisabled} className={`px-6 py-3 rounded-md flex items-center transition duration-200 ${isDisabled ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'}`}>
        <FilePdf className="h-6 w-6 mr-2" />
        Gerar Orçamento PDF
      </button>

      <button onClick={handleShareWhatsApp} disabled={isDisabled} className={`px-6 py-3 rounded-md flex items-center transition duration-200 ${isDisabled ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-md'}`}>
        <Share2 className="h-6 w-6 mr-2" />
        Compartilhar via WhatsApp
      </button>
    </div>
  );
};

export default PDFGenerator;
