import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatCurrency, formatDate, calculateTotal } from '../utils/formatters';
import { File as FilePdf } from 'lucide-react';
import { MaterialType } from '../types';

const QuotationPreview: React.FC = () => {
  const { quotation } = useQuotation();

  // Group materials by type and sort alphabetically
  const groupedMaterials = quotation.materials.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = [];
    }
    acc[material.type].push(material);
    return acc;
  }, {} as Record<MaterialType, typeof quotation.materials>);
  
  const sortedTypes = Object.keys(groupedMaterials).sort() as MaterialType[];
  
  // Calculate total
  const total = quotation.materials.reduce(
    (sum, material) => sum + calculateTotal(material.pricePerUnit, material.quantity),
    0
  );

  // Format installment value if applicable
  const installmentValue = quotation.installments && quotation.installments > 1
    ? formatCurrency(total / quotation.installments)
    : null;

  const generatePDF = () => {
    // This will be implemented with jsPDF in PDFGenerator component
    console.log("Generating PDF...");
  };

  if (!quotation.company || !quotation.client || quotation.materials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
          Prévia do Orçamento
        </h2>
        <div className="p-8 text-center text-slate-500">
          <p>Preencha os dados da empresa, cliente e adicione materiais para visualizar a prévia do orçamento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold text-slate-800">
          Prévia do Orçamento
        </h2>
        <button
          onClick={generatePDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200"
        >
          <FilePdf className="h-5 w-5 mr-2" />
          Gerar PDF
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-slate-800 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Orçamento - {quotation.company}</h1>
          <div className="flex flex-col sm:flex-row justify-between text-sm">
            <p>Data: {formatDate(new Date())}</p>
            <p>Validade: {formatDate(quotation.validUntil)} às 00:00</p>
          </div>
        </div>
        
        <div className="p-6 bg-white">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">Informações</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Vendedor:</span> {quotation.seller} - {quotation.company}</p>
              <p><span className="font-medium">Cliente:</span> {quotation.client}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">Resumo do Pedido</h3>
            
            {sortedTypes.map((type) => (
              <div key={type} className="mb-4">
                <h4 className="text-md font-medium text-slate-700 mb-2">{type}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Material
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Preço/m²
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Qtd
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Total
                        </th>
                        {groupedMaterials[type].some(m => m.details) && (
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Detalhes
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {groupedMaterials[type].map((material) => (
                        <tr key={material.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                            {material.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                            {formatCurrency(material.pricePerUnit)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                            {material.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">
                            {formatCurrency(calculateTotal(material.pricePerUnit, material.quantity))}
                          </td>
                          {groupedMaterials[type].some(m => m.details) && (
                            <td className="px-4 py-2 text-sm text-slate-500">
                              {material.details || "-"}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
            <div className="mt-6 text-right">
              <p className="text-xl font-bold text-slate-800">
                Valor Total: {formatCurrency(total)}
              </p>
              
              {installmentValue && (
                <p className="text-md text-slate-700 mt-1">
                  {quotation.installments}x de {installmentValue} ({quotation.paymentMethod})
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-sm">
            <p className="font-medium mb-1">Forma de Pagamento: {quotation.paymentMethod}</p>
            
            {quotation.showBankDetails && quotation.bankDetails && (
              <div className="mt-2 p-3 bg-slate-50 rounded-md">
                <h4 className="font-medium mb-1">Dados para Depósito:</h4>
                <p>Banco: {quotation.bankDetails.bank}</p>
                <p>Agência: {quotation.bankDetails.agency}</p>
                <p>Conta: {quotation.bankDetails.account}</p>
                <p>CNPJ: {quotation.bankDetails.cnpj}</p>
                <p>Nome: {quotation.bankDetails.companyName}</p>
                <p>PIX: {quotation.bankDetails.pix}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-sm text-slate-500 italic border-t pt-4">
            <p>Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos. O valor final será baseado no ramenio oficial com medida real liquida de cada chapa.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;