import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MaterialType } from '../types';

const QuotationPreview: React.FC = () => {
  const { quotation } = useQuotation();

  // Agrupa por tipo
  const grouped = quotation.materials.reduce((acc, m) => {
    if (!acc[m.type]) acc[m.type] = [];
    acc[m.type].push(m);
    return acc;
  }, {} as Record<MaterialType, typeof quotation.materials>);

  const sortedTypes = Object.keys(grouped).sort() as MaterialType[];

  // Cálculo do total
  const total = quotation.materials.reduce((sum, m) => {
    const netArea = (m.dimensions.width - 0.05) * (m.dimensions.height - 0.05) * m.quantity;
    return sum + m.pricePerUnit * netArea;
  }, 0);

  if (!quotation.company || !quotation.client || quotation.materials.length === 0) {
    return (
      <p className="text-center py-10 text-slate-500">
        Adicione empresa, cliente e materiais para visualizar o orçamento.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold text-slate-800">Prévia do Orçamento</h2>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {/* Título e datas */}
        <div className="bg-slate-800 p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Orçamento - {quotation.company}</h1>
          <div className="flex flex-col sm:flex-row justify-between text-sm">
            <p>Data: {formatDate(new Date())}</p>
            <p>Validade: {formatDate(quotation.validUntil)}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between text-sm mt-1">
            <p>Vendedor: {quotation.seller}</p>
            <p>Cliente: {quotation.client}</p>
          </div>
        </div>

        {/* Lista de materiais */}
        <div className="p-6 bg-white">
          {sortedTypes.map(type => (
            <div key={type} className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{type}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 w-1/6 text-left text-xs font-medium text-slate-500 uppercase">
                        Acabamento
                      </th>
                      <th className="px-4 py-2 w-2/5 text-left text-xs font-medium text-slate-500 uppercase">
                        Material
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                        Preço/m²
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                        Área (m²)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                        Medida líquida
                      </th>
                      <th className="px-4 py-2 w-1/12 text-left text-xs font-medium text-slate-500 uppercase">
                        Qtd
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {grouped[type].map(material => {
                      const netArea = (material.dimensions.width - 0.05) * (material.dimensions.height - 0.05) * material.quantity;
                      const netW = (material.dimensions.width - 0.05).toFixed(2);
                      const netH = (material.dimensions.height - 0.05).toFixed(2);
                      return (
                        <tr key={material.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-2 text-sm text-slate-900">{material.finishing}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">{material.name}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">{formatCurrency(material.pricePerUnit)}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">{netArea.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">{`${netW} x ${netH}`}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">{material.quantity}</td>
                          <td className="px-4 py-2 text-sm font-medium text-slate-900">
                            {formatCurrency(material.pricePerUnit * netArea)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold text-slate-800">Valor Total: {formatCurrency(total)}</p>
            {quotation.installments && quotation.installments > 1 && (
              <p className="text-md text-slate-700 mt-1">
                {quotation.installments}x de {formatCurrency(total / quotation.installments)} ({quotation.paymentMethod})
              </p>
            )}
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

          {quotation.showDefaultMeasure && (
            <div className="mt-4 text-sm italic text-slate-500 border-t pt-4">
              <p>Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.</p>
              <p>O valor final será baseado no romaneio oficial com medida real líquida de cada chapa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;
