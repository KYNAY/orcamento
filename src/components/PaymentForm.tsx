import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { PaymentMethod } from '../types';

const PaymentForm: React.FC = () => {
  const { quotation, updateQuotation } = useQuotation();

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    updateQuotation({ 
      paymentMethod: method,
      // Reset installments when changing to cash
      installments: method === PaymentMethod.CASH ? 1 : quotation.installments
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
        Forma de Pagamento
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Método de Pagamento
          </label>
          <div className="flex flex-wrap gap-3">
            {Object.values(PaymentMethod).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => handlePaymentMethodChange(method)}
                className={`px-4 py-2 rounded-md transition ${
                  quotation.paymentMethod === method
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
        
        {quotation.paymentMethod !== PaymentMethod.CASH && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número de Parcelas
            </label>
            <select
              value={quotation.installments}
              onChange={(e) => updateQuotation({ installments: parseInt(e.target.value) })}
              className="w-full max-w-xs p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={num}>
                  {num}x
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showBankDetails"
              checked={quotation.showBankDetails}
              onChange={(e) => updateQuotation({ showBankDetails: e.target.checked })}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
            />
            <label htmlFor="showBankDetails" className="ml-2 block text-sm text-slate-700">
              Incluir dados bancários no orçamento
            </label>
          </div>
        </div>
        
        {quotation.showBankDetails && (
          <div className="mt-4 p-4 bg-slate-50 rounded-md">
            <h3 className="text-md font-medium text-slate-700 mb-3">Dados Bancários</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Banco</label>
                <input
                  type="text"
                  value={quotation.bankDetails?.bank || ''}
                  onChange={(e) => 
                    updateQuotation({ 
                      bankDetails: { ...quotation.bankDetails!, bank: e.target.value } 
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Nome do banco"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agência</label>
                <input
                  type="text"
                  value={quotation.bankDetails?.agency || ''}
                  onChange={(e) => 
                    updateQuotation({ 
                      bankDetails: { ...quotation.bankDetails!, agency: e.target.value } 
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Número da agência"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Conta</label>
                <input
                  type="text"
                  value={quotation.bankDetails?.account || ''}
                  onChange={(e) => 
                    updateQuotation({ 
                      bankDetails: { ...quotation.bankDetails!, account: e.target.value } 
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Número da conta"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  value={quotation.bankDetails?.cnpj || ''}
                  onChange={(e) => 
                    updateQuotation({ 
                      bankDetails: { ...quotation.bankDetails!, cnpj: e.target.value } 
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="CNPJ da empresa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  value={quotation.bankDetails?.companyName || ''}
                  onChange={(e) => 
                    updateQuotation({ 
                      bankDetails: { ...quotation.bankDetails!, companyName: e.target.value } 
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Nome oficial da empresa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chave PIX</label>
                <input
                  type="text"
                  value={quotation.bankDetails?.pix || ''}
                  onChange={(e) => 
                    updateQuotation({ 
                      bankDetails: { ...quotation.bankDetails!, pix: e.target.value } 
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Chave PIX"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;