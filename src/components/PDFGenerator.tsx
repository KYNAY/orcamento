import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate, calculateTotal } from '../utils/formatters';
import { MaterialType } from '../types';
import { File as FilePdf } from 'lucide-react';

const PDFGenerator: React.FC = () => {
  const { quotation } = useQuotation();
  const { showDefaultMeasure, defaultMeasureMessage } = quotation;

  const generatePDF = () => {
    const doc = new jsPDF();
    // Agrupa e ordena materiais
    const grouped = quotation.materials.reduce((acc, m) => {
      if (!acc[m.type]) acc[m.type] = [];
      acc[m.type].push(m);
      return acc;
    }, {} as Record<MaterialType, typeof quotation.materials>);
    const sortedTypes = Object.keys(grouped).sort() as MaterialType[];
    const total = quotation.materials.reduce(
      (sum, m) => sum + calculateTotal(m.pricePerUnit, m.quantity),
      0
    );

    // Cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Orçamento - ${quotation.company}`, 15, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Data: ${formatDate(new Date())}`, 15, 30);
    doc.text(`Validade: ${formatDate(quotation.validUntil)}`, 15, 35);

    // Tabela de materiais
    let yPos = 50;
    sortedTypes.forEach((type) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(type, 15, yPos);
      yPos += 6;

      // Definir larguras de coluna
      const colX = [15, 80, 110, 140, 165, 185, 205];
      const headers = ['Material', 'Preço/m²', 'Área (m²)', 'Medida líquida', 'Qtd', 'Total', 'Detalhes'];

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      headers.forEach((hdr, i) => {
        doc.text(hdr, colX[i], yPos);
      });
      yPos += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      grouped[type].forEach((m) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        const grossArea = (m.dimensions.width * m.dimensions.height).toFixed(2);
        const netW = (m.dimensions.width - 0.05).toFixed(2);
        const netH = (m.dimensions.height - 0.05).toFixed(2);
        const values = [
          m.name,
          formatCurrency(m.pricePerUnit),
          grossArea,
          `${netW} x ${netH}`,
          String(m.quantity),
          formatCurrency(calculateTotal(m.pricePerUnit, m.quantity)),
          m.details || '-'
        ];
        values.forEach((txt, i) => {
          doc.text(txt, colX[i], yPos);
        });
        yPos += 6;
      });
    });

    // Totais
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Valor Total: ${formatCurrency(total)}`, 15, yPos + 10);

    // Dados bancários
    if (quotation.showBankDetails && quotation.bankDetails) {
      yPos += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Dados para Depósito:', 15, yPos);
      yPos += 6;
      doc.text(`Banco: ${quotation.bankDetails.bank}`, 15, yPos);
      doc.text(`Agência: ${quotation.bankDetails.agency}`, 15, yPos + 6);
      doc.text(`Conta: ${quotation.bankDetails.account}`, 15, yPos + 12);
      doc.text(`CNPJ: ${quotation.bankDetails.cnpj}`, 15, yPos + 18);
      doc.text(`Nome: ${quotation.bankDetails.companyName}`, 15, yPos + 24);
      doc.text(`PIX: ${quotation.bankDetails.pix}`, 15, yPos + 30);
      yPos += 36;
    }

    // Mensagem de medida padrão
    if (showDefaultMeasure) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(defaultMeasureMessage, 180);
      doc.text(lines, 15, yPos + 10);
    }

    doc.save(`Orcamento_${quotation.client}_${formatDate(new Date())}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md"
    >
      <FilePdf className="w-4 h-4" />
      Gerar PDF
    </button>
  );
};

export default PDFGenerator;
