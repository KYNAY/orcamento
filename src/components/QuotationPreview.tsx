import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatCurrency, formatDate, calculateTotal } from '../utils/formatters';
import PDFGenerator from './PDFGenerator';
import { MaterialType } from '../types';

const QuotationPreview: React.FC = () => {
  const { quotation } = useQuotation();

  // Agrupa materiais por tipo
  const groupedMaterials = quotation.materials.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = [];
    }
    acc[material.type].push(material);
    return acc;
  }, {} as Record<MaterialType, typeof quotation.materials>);

  // Ordena tipos alphabeticamente
  const sortedTypes = Object.keys(groupedMaterials).sort() as MaterialType[];

  // Calcula total geral
  const total = quotation.materials.reduce(
    (sum, material) => sum + calculateTotal(material.pricePerUnit, material.quantity),
    0
  );

  // Valor por parcela, se aplicável
  const installmentValue = quotation.installments && quotation.installments > 1
    ? formatCurrency(total / quotation.installments)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Cabeçalho da pré-via */}
      <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
        Pré-via do Orçamento
      </h2>

      {/* Dados do orçamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Cliente:</strong> {quotation.client}</p>
        </div>
        <div>
          <p><strong>Vendedor:</strong> {quotation.vendor} – {quotation.company}</p>
        </div>
        <div>
          <p><strong>Data:</strong> {formatDate(quotation.date)}</p>
        </div>
        <div>
          <p><strong>Validade:</strong> até 00:00</p>
        </div>
      </div>

      {/* Listagem de materiais por tipo */}
      <div className="space-y-6">
        {sortedTypes.map((type) => (
          <div key={type} className="space-y-2">
            <h3 className="text-lg font-medium text-slate-700">{type}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Material</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Preço/m²</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qtd</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {groupedMaterials[type].map((material, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-slate-700">{material.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatCurrency(material.pricePerUnit)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{material.quantity}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatCurrency(calculateTotal(material.pricePerUnit, material.quantity))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Total e parcelas */}
      <div className="text-right mt-4">
        <p className="text-lg font-semibold text-slate-800">Total: {formatCurrency(total)}</p>
        {installmentValue && (
          <p className="text-sm text-slate-600">Valor por parcela ({quotation.installments}x): {installmentValue}</p>
        )}
      </div>

      {/* Mensagem padrão condicional */}
      {quotation.materials.some(m => m.showStandardMessage) && (
        <div className="mt-6 text-sm italic text-slate-500 border-t pt-4">
          <p>Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.</p>
          <p>O valor final será baseado no romaneio oficial com medida real líquida de cada chapa.</p>
        </div>
      )}

      {/* Botão único de geração/compartilhamento de PDF */}
      <div className="mt-6 flex justify-end">
        <PDFGenerator />
      </div>
    </div>
  );
};

export default QuotationPreview;
