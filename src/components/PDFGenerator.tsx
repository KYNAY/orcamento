import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MaterialType } from '../types';
import { File as FilePdf, Share2 } from 'lucide-react';

const PDFGenerator: React.FC = () => {
  const { quotation } = useQuotation();

  const generatePDF = () => {
    const doc = new jsPDF(); // Portrait A4

    // Cabeçalho
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text(`Orçamento - ${quotation.company}`, 15, 20);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
    doc.text(`Cliente: ${quotation.client}`, 15, 28);
    doc.text(`Data: ${formatDate(new Date())}`, 150, 20);
    doc.text(`Validade: ${formatDate(quotation.validUntil)}`, 150, 28);

    // Prepara dados da tabela
    const headers = ['Material', 'Preço/m²', 'Área (m²)', 'Medida líquida', 'Qtd', 'Total', 'Detalhes'];
    const rows: (string|number)[][] = [];
    let totalChapas = 0;
    let totalValor = 0;

    quotation.materials.forEach(m => {
      const netWidth = m.dimensions.width - 0.05;
      const netHeight = m.dimensions.height - 0.05;
      const netArea = netWidth * netHeight * m.quantity;
      const valor = m.pricePerUnit * netArea;
      totalChapas += m.quantity;
      totalValor += valor;

      rows.push([
        m.name,
        formatCurrency(m.pricePerUnit),
        netArea.toFixed(2),
        `${netWidth.toFixed(2)} x ${netHeight.toFixed(2)}`,
        m.quantity,
        formatCurrency(valor),
        m.details || '-'
      ]);
    });

    // Desenha tabela com autoTable
    (doc as any).autoTable({
      startY: 36,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 11, cellPadding: 4 },
      headStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 60 },  // Material
        1: { cellWidth: 25 },  // Preço/
        2: { cellWidth: 25 },  // Área
        3: { cellWidth: 40 },  // Medida líquida
        4: { cellWidth: 15 },  // Qtd
        5: { cellWidth: 30 },  // Total
        6: { cellWidth: 40 }   // Detalhes
      },
      margin: { left: 15, right: 15 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Informações adicionais abaixo da tabela
    doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
    doc.text(`Total de Chapas: ${totalChapas}`, 15, finalY);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
    doc.text(`Valor Total: ${formatCurrency(totalValor)}`, 15, finalY + 10);

    const payY = finalY +  twenty;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
    doc.text(`Forma de Pagamento: ${quotation.paymentMethod}`, 15, payY);

    if (quotation.showBankDetails && quotation.bankDetails) {
      const bankY = payY + 10;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
      doc.text('Dados Bancários:', 15, bankY);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
      const lines = [
        `Banco: ${quotation.bankDetails.bank}`,
        `Agência: ${quotation.bankDetails.agency}`,
        `Conta: ${quotation.bankDetails.account}`,
        `CNPJ: ${quotation.bankDetails.cnpj}`,
        `PIX: ${quotation.bankDetails.pix}`
      ];
      lines.forEach((line, idx) => {
        doc.text(line, 15, bankY + 8 + idx * 6);
      });
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
      await navigator.share({ files: [new File([blob], filename, { type: 'application/pdf' })], text: `Orçamento - ${quotation.company}\nCliente: ${quotation.client}` });
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
