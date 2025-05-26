import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatCurrency, calculateTotal } from '../utils/formatters';
import { MaterialType } from '../types';

const QuotationPreview: React.FC = () => {
  const { quotation } = useQuotation();
  const { showDefaultMeasure, defaultMeasureMessage } = quotation;

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

  const installmentValue =
    quotation.installments && quotation.installments > 1
      ? formatCurrency(total / quotation.installments)
      : null;

  return (
    <div className="m-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Lista de materiais por tipo */}
        {sortedTypes.map((type) => (
          <div key={type} className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{type}</h3>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Material</th>
                  <th className="px-4 py-2">Medida líquida (m²)</th>
                  <th className="px-4 py-2">Qtd</th>
                  <th className="px-4 py-2">Total</th>
                  {grouped[type].some((m) => m.details) && (
                    <th className="px-4 py-2">Detalhes</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {grouped[type].map((material) => {
                  const netW = (material.dimensions.width - 0.05).toFixed(2);
                  const netH = (material.dimensions.height - 0.05).toFixed(2);
                  return (
                    <tr key={material.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                        {material.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                        {`${netW} x ${netH}`}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                        {material.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">
                        {formatCurrency(
                          calculateTotal(material.pricePerUnit, material.quantity)
                        )}
                      </td>
                      {grouped[type].some((m) => m.details) && (
                        <td className="px-4 py-2 text-sm text-slate-500">
                          {material.details || '-'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Totais e parcelamento */}
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

        {/* Forma de pagamento e dados bancários */}
        <div className="mt-4 text-sm">
          <p className="font-medium mb-1">
            Forma de Pagamento: {quotation.paymentMethod}
          </p>
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

        {/* Mensagem de Medida Padrão */}
        {showDefaultMeasure && (
          <div className="mt-4 text-sm italic text-slate-500 border-t pt-4">
            <p className="whitespace-pre-line">
              {defaultMeasureMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationPreview;
