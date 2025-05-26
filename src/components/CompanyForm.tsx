import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatDate } from '../utils/formatters';

const CompanyForm: React.FC = () => {
  const { quotation, updateQuotation } = useQuotation();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
        Informações da Empresa e Cliente
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome da Empresa
          </label>
          <input
            type="text"
            value={quotation.company}
            onChange={(e) => updateQuotation({ company: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            placeholder="Ex: Marmoraria Rio Verde"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Vendedor
          </label>
          <input
            type="text"
            value={quotation.seller}
            onChange={(e) => updateQuotation({ seller: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            placeholder="Nome do vendedor"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cliente
          </label>
          <input
            type="text"
            value={quotation.client}
            onChange={(e) => updateQuotation({ client: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            placeholder="Nome do cliente"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Validade do Orçamento
          </label>
          <input
            type="date"
            value={quotation.validUntil.toISOString().split('T')[0]}
            onChange={(e) => 
              updateQuotation({ 
                validUntil: e.target.value ? new Date(e.target.value) : new Date() 
              })
            }
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
          <p className="text-xs text-slate-500 mt-1">
            Data atual: {formatDate(new Date())}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;