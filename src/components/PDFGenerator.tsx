import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate, calculateTotal } from '../utils/formatters';
import { MaterialType } from '../types';
import { File as FilePdf, Share2 } from 'lucide-react';

const PDFGenerator: React.FC = () => {
  const { quotation } = useQuotation();

  // Gera e retorna o documento jsPDF montado com os dados do orçamento
  const generateDocument = (): jsPDF => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Orçamento - ${quotation.company}`, 10, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${quotation.client}`, 10, 30);
    doc.text(`Vendedor: ${quotation.vendor} - ${quotation.company}`, 10, 36);
    doc.text(`Data: ${formatDate(quotation.date)}`, 10, 42);
    doc.text(`Validade: até 00:00`, 120, 42);

    // Agrupa materiais por tipo
    let y = 48;
    const grouped = quotation.materials.reduce((acc, mat) => {
      (acc[mat.type] = acc[mat.type] || []).push(mat);
      return acc;
    }, {} as Record<MaterialType, typeof quotation.materials>);
    const types = Object.keys(grouped).sort() as MaterialType[];

    // Listagem de cada tipo e itens
    types.forEach(typeKey => {
      doc.setFont('helvetica', 'bold');
      doc.text(typeKey, 10, (y += 6));

      grouped[typeKey]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(item => {
          const total = calculateTotal(item.pricePerUnit, item.quantity);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `- ${item.name}: ${item.quantity} x ${formatCurrency(item.pricePerUnit)} = ${formatCurrency(total)}`,
            12,
            (y += 6)
          );
        });
    });

    // Total final
    const finalTotal = quotation.materials.reduce(
      (sum, mat) => sum + calculateTotal(mat.pricePerUnit, mat.quantity),
      0
    );
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${formatCurrency(finalTotal)}`, 10, (y += 10));

    // Observação padrão condicional
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.',
      10,
      y,
      { maxWidth: 190 }
    );
    doc.text(
      'O valor final será baseado no romaneio oficial com medida real líquida de cada chapa.',
      10,
      (y += 6),
      { maxWidth: 190 }
    );

    return doc;
  };

  // Faz download do PDF
  const handleDownload = () => {
    const doc = generateDocument();
    doc.save(`Orçamento - ${quotation.company}.pdf`);
  };

  // Compartilha via WhatsApp ou via Web Share API quando suportado
  const handleShare = async () => {
    const doc = generateDocument();
    const blob = doc.output('blob');
    const file = new File([blob], `Orçamento - ${quotation.company}.pdf`, {
      type: 'application/pdf',
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Orçamento - ${quotation.company}` });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para WhatsApp Web
      const url = URL.createObjectURL(blob);
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          `Orçamento - ${quotation.company}%0A%0AClique para baixar: ${url}`
        )}`,
        '_blank'
      );
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Botão para gerar/baixar PDF */}
      <button
        onClick={handleDownload}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
      >
        <FilePdf className="h-5 w-5 mr-2" />
        Gerar PDF
      </button>

      {/* Botão para compartilhar */}
      <button
        onClick={handleShare}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
      >
        <Share2 className="h-5 w-5 mr-2" />
        Compartilhar
      </button>
    </div>
  );
};

export default PDFGenerator;
