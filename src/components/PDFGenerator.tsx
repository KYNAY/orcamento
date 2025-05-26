import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate, calculateTotal } from '../utils/formatters';
import { MaterialType } from '../types';
import { File as FilePdf } from 'lucide-react';

const PDFGenerator: React.FC = () => {
  const { quotation } = useQuotation();

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Group materials by type
    const groupedMaterials = quotation.materials.reduce((acc, material) => {
      if (!acc[material.type]) {
        acc[material.type] = [];
      }
      acc[material.type].push(material);
      return acc;
    }, {} as Record<MaterialType, typeof quotation.materials>);
    
    // Sort material types alphabetically
    const sortedTypes = Object.keys(groupedMaterials).sort() as MaterialType[];
    
    // Calculate total
    const total = quotation.materials.reduce(
      (sum, material) => sum + calculateTotal(material.pricePerUnit, material.quantity),
      0
    );

    // Set up PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Orçamento - ${quotation.company}`, 15, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Data: ${formatDate(new Date())}`, 15, 30);
    doc.text(`Validade: ${formatDate(quotation.validUntil)} às 00:00`, 15, 35);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Informações:", 15, 45);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Vendedor: ${quotation.seller} - ${quotation.company}`, 15, 52);
    doc.text(`Cliente: ${quotation.client}`, 15, 58);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Resumo do Pedido:", 15, 68);
    
    let yPos = 78;
    
    // Add materials by type
    sortedTypes.forEach((type) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(type, 15, yPos);
      yPos += 6;
      
      // Table header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Material", 15, yPos);
      doc.text("Preço/m²", 80, yPos);
      doc.text("Qtd", 110, yPos);
      doc.text("Total", 130, yPos);
      doc.text("Detalhes", 160, yPos);
      yPos += 5;
      
      // Table rows
      doc.setFont("helvetica", "normal");
      groupedMaterials[type].forEach((material) => {
        // Add new page if needed
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(material.name, 15, yPos);
        doc.text(formatCurrency(material.pricePerUnit), 80, yPos);
        doc.text(material.quantity.toString(), 110, yPos);
        doc.text(formatCurrency(calculateTotal(material.pricePerUnit, material.quantity)), 130, yPos);
        doc.text(material.details || "-", 160, yPos);
        yPos += 6;
      });
      
      yPos += 4;
    });
    
    // Add new page if needed for payment info
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Valor Total: ${formatCurrency(total)}`, 130, yPos);
    yPos += 10;
    
    // Payment method
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Forma de Pagamento: ${quotation.paymentMethod}`, 15, yPos);
    yPos += 6;
    
    // Installments if applicable
    if (quotation.installments && quotation.installments > 1) {
      doc.text(`${quotation.installments}x de ${formatCurrency(total / quotation.installments)}`, 15, yPos);
      yPos += 6;
    }
    
    // Bank details if enabled
    if (quotation.showBankDetails && quotation.bankDetails) {
      yPos += 4;
      doc.setFont("helvetica", "bold");
      doc.text("Dados para Depósito:", 15, yPos);
      yPos += 6;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Banco: ${quotation.bankDetails.bank}`, 15, yPos); yPos += 5;
      doc.text(`Agência: ${quotation.bankDetails.agency}`, 15, yPos); yPos += 5;
      doc.text(`Conta: ${quotation.bankDetails.account}`, 15, yPos); yPos += 5;
      doc.text(`CNPJ: ${quotation.bankDetails.cnpj}`, 15, yPos); yPos += 5;
      doc.text(`Nome: ${quotation.bankDetails.companyName}`, 15, yPos); yPos += 5;
      doc.text(`PIX: ${quotation.bankDetails.pix}`, 15, yPos); yPos += 10;
    }
    
    // Standard measurement note
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.", 15, yPos);
    yPos += 4;
    doc.text("O valor final será baseado no ramenio oficial com medida real liquida de cada chapa.", 15, yPos);
    
    // Save PDF
    const filename = `Orçamento ${quotation.company} - ${quotation.client}.pdf`;
    doc.save(filename);
  };

  // Only enable the button if we have the minimum required data
  const isDisabled = !quotation.company || !quotation.client || quotation.materials.length === 0;

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={generatePDF}
        disabled={isDisabled}
        className={`px-6 py-3 rounded-md flex items-center transition duration-200 ${
          isDisabled
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
        }`}
      >
        <FilePdf className="h-6 w-6 mr-2" />
        Gerar Orçamento PDF
      </button>
    </div>
  );
};

export default PDFGenerator;