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
    // Agrupa e ordena
    const grouped = quotation.materials.reduce((acc, m) => {
      if (!acc[m.type]) acc[m.type] = [];
      acc[m.type].push(m);
      return acc;
    }, {} as Record<MaterialType, typeof quotation.materials>);
    const sortedTypes = Object.keys(grouped).sort() as MaterialType[];
    const total = quotation.materials.reduce((sum, m) => sum + calculateTotal(m.pricePerUnit, m.quantity), 0);

    // Cabeçalho
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text(`Orçamento - ${quotation.company}`, 15, 20);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(`Data: ${formatDate(new Date())}`, 15, 30);
    doc.text(`Validade: ${formatDate(quotation.validUntil)}`, 15, 35);

    // Tabela de materiais
    let yPos = 70;
    sortedTypes.forEach((type) => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      doc.text(type, 15, yPos); yPos += 6;

      doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      ['Material', 'Preço/m²', 'Área (m²)', 'Medida líquida', 'Qtd', 'Total', 'Detalhes'].forEach((header, i) => {
        doc.text(header, 15 + i * 25, yPos);
      });
      yPos += 5;

      doc.setFont('helvetica', 'normal');
      grouped[type].forEach((m) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        const grossArea = m.dimensions.width * m.dimensions.height * m.quantity;
        const netW = (m.dimensions.width - 0.05).toFixed(2);
        const netH = (m.dimensions.height - 0.05).toFixed(2);
        [
          m.name,
          formatCurrency(m.pricePerUnit),
          grossArea.toFixed(2),
          `${netW} x ${netH}`,
          String(m.quantity),
          formatCurrency(calculateTotal(m.pricePerUnit, m.quantity)),
          m.details || '-'
        ].forEach((text, i) => {
          doc.text(text, 15 + i * 25, yPos);
        });
        yPos += 6;
      });
      yPos += 4;
    });

    // Total geral
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text(`Valor Total: ${formatCurrency(total)}`, 130, yPos);
    yPos += 10;

    // Forma de pagamento
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(`Forma de Pagamento: ${quotation.paymentMethod}`, 15, yPos);
    yPos += 6;
    if (quotation.installments && quotation.installments > 1) {
      doc.text(`${quotation.installments}x de ${formatCurrency(total / quotation.installments)}`, 15, yPos);
      yPos += 6;
    }

    // Dados bancários
    if (quotation.showBankDetails && quotation.bankDetails) {
      yPos += 4;
      doc.setFont('helvetica', 'bold'); doc.text('Dados para Depósito:', 15, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      [
        `Banco: ${quotation.bankDetails.bank}`,
        `Agência: ${quotation.bankDetails.agency}`,
        `Conta: ${quotation.bankDetails.account}`,
        `CNPJ: ${quotation.bankDetails.cnpj}`,
        `Nome: ${quotation.bankDetails.companyName}`,
        `PIX: ${quotation.bankDetails.pix}`
      ].forEach((line) => {
        doc.text(line, 15, yPos);
        yPos += 5;
      });
      yPos += 10;
    }

    // Observação de medida padrão (condicional)
    if (quotation.showDefaultMeasure) {
      doc.setFont('helvetica', 'italic'); doc.setFontSize(8);
      doc.text('Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.', 15, yPos);
      yPos += 4;
      doc.text('O valor final será baseado no ramenio oficial com medida real líquida de cada chapa.', 15, yPos);
    }

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save(`Orçamento ${quotation.company} - ${quotation.client}.pdf`);
  };

  const handleShareWhatsApp = async () => {
    const doc = generatePDF();
    const blob = doc.output('blob');
    const filename = `Orçamento ${quotation.company} - ${quotation.client}.pdf`;
    if (navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'application/pdf' })] })) {
      await navigator.share({ files: [new File([blob], filename, { type: 'application/pdf' })], text: `Orçamento - ${quotation.company}
Cliente: ${quotation.client}` });
    } else {
      const url = URL.createObjectURL(blob);
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const isDisabled = !quotation.company || !quotation.client || quotation.materials.length === 0;

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={handleDownloadPDF}
        disabled={isDisabled}
        className={`px-6 py-3 rounded-md flex items-center transition duration-200 ${isDisabled ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'}`}
      >
        <FilePdf className="h-6 w-6 mr-2" />
        Gerar Orçamento PDF
      </button>

      <button
        onClick={handleShareWhatsApp}
        disabled={isDisabled}
        className={`px-6 py-3 rounded-md flex items-center transition duration-200 ${isDisabled ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-md'}`}
      >
        <Share2 className="h-6 w-6 mr-2" />
        Compartilhar via WhatsApp
      </button>
    </div>
  );
};

export default PDFGenerator;
