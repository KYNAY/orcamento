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

    // Agrupa e ordena materiais
    const grouped = quotation.materials.reduce((acc, m) => {
      if (!acc[m.type]) acc[m.type] = [];
      acc[m.type].push(m);
      return acc;
    }, {} as Record<MaterialType, typeof quotation.materials>);
    const sortedTypes = Object.keys(grouped).sort() as MaterialType[];

    // Calcula total de chapas
    const totalChapas = quotation.materials.reduce((sum, m) => sum + m.quantity, 0);

    // Cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Orçamento - ${quotation.company}`, 15, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Data: ${formatDate(new Date())}`, 15, 30);
    doc.text(`Validade: ${formatDate(quotation.validUntil)}`, 15, 35);
    doc.text(`Vendedor: ${quotation.seller}`, 15, 40);
    doc.text(`Cliente: ${quotation.client}`, 15, 45);

    // Define posições X fixas para colunas
    const colX = [15, 65, 125, 155, 185, 200, 220];

    // Cabeçalho da tabela
    let yPos = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    ['Acabamento', 'Material', 'Preço/m²', 'Área (m²)', 'Medida líquida', 'Qtd', 'Total']
      .forEach((h, i) => doc.text(h, colX[i], yPos));

    // Linhas de materiais
    doc.setFont('helvetica', 'normal');
    sortedTypes.forEach(type => {
      yPos += 8;
      // Nome do tipo
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(type, colX[0], yPos);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      grouped[type].forEach(m => {
        yPos += 6;
        if (yPos > 275) {
          doc.addPage();
          yPos = 20;
        }
        const netW = (m.dimensions.width - 0.05).toFixed(2);
        const netH = (m.dimensions.height - 0.05).toFixed(2);
        const netArea = (m.dimensions.width - 0.05) * (m.dimensions.height - 0.05) * m.quantity;

        // Quebra automática do texto de material
        const matText = `${m.finishing} ${m.name}`;
        const matWidth = colX[2] - colX[1] - 5;
        const matLines = doc.splitTextToSize(matText, matWidth);
        doc.text(matLines, colX[1], yPos);

        // Imprime as demais colunas
        const other = [
          formatCurrency(m.pricePerUnit),
          netArea.toFixed(2),
          `${netW} x ${netH}`,
          String(m.quantity),
          formatCurrency(calculateTotal(m.pricePerUnit, m.quantity)),
        ];
        other.forEach((txt, j) => {
          doc.text(txt, colX[j + 2], yPos);
        });
      });
    });

    // Total geral e forma de pagamento
    const grandTotal = quotation.materials.reduce(
      (sum, m) => sum + calculateTotal(m.pricePerUnit, m.quantity),
      0
    );

    yPos += 12;
    if (yPos > 275) {
      doc.addPage();
      yPos = 20;
    }
    // Quantidade total de chapas
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Quantidade total de chapas: ${totalChapas}`, colX[0], yPos);
    yPos += 8;

    // Valor total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Valor Total: ${formatCurrency(grandTotal)}`, colX[5], yPos);
    yPos += 8;

    // Forma de pagamento e parcelas
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Forma de Pagamento: ${quotation.paymentMethod}`, colX[0], yPos);
    if (quotation.installments && quotation.installments > 1) {
      yPos += 6;
      doc.text(
        `${quotation.installments}x de ${formatCurrency(grandTotal / quotation.installments)}`,
        colX[0],
        yPos
      );
    }

    return doc;
  };

  const handleDownload = () => {
    generatePDF().save(`Orçamento ${quotation.company} - ${quotation.client}.pdf`);
  };
  const handleShare = async () => {
    const blobUrl = generatePDF().output('bloburl');
    // lógica de compartilhamento...
  };

  const disabled =
    !quotation.company || !quotation.client || quotation.materials.length === 0;

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={handleDownload}
        disabled={disabled}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        <FilePdf className="h-5 w-5 mr-2" /> Gerar PDF
      </button>
      <button
        onClick={handleShare}
        disabled={disabled}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        <Share2 className="h-5 w-5 mr-2" /> Compartilhar
      </button>
    </div>
  );
};

export default PDFGenerator;
