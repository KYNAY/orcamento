import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatCurrency, calculateTotal } from '../utils/formatters';
import { Edit, Trash2 } from 'lucide-react';
import { MaterialType } from '../types';

const MaterialList: React.FC = () => {
  const { quotation, deleteMaterial, editMaterial } = useQuotation();
  
  // Agrupa materiais por tipo
  const groupedMaterials = quotation.materials.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = [];
    }
    acc[material.type].push(material);
    return acc;
  }, {} as Record<MaterialType, typeof quotation.materials>);

  // Ordena os tipos alfabeticamente
  const sortedTypes = Object.keys(groupedMaterials).sort() as MaterialType[];

  // Calcula total geral
  const total = quotation.materials.reduce(
    (sum, material) => sum + calculateTotal(material.pricePerUnit, material.quantity),
    0
  );

  if (quotation.materials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
          Materiais Selecionados
        </h2>
        <div className="p-8 text-center text-slate-500">
          <p>Nenhum material adicionado.</p>
          <p className="text-sm mt-2">Adicione materiais usando o formulário acima.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
        Materiais Selecionados
      </h2>
      
      <div className="space-y-6">
        {sortedTypes.map((type) => (
          <div key={type} className="space-y-2">
            <h3 className="text-lg font-medium text-slate-700">{type}</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Preço/m²
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {groupedMaterials[type].map((material, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                        {material.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                        {formatCurrency(material.pricePerUnit)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                        {material.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                        {formatCurrency(calculateTotal(material.pricePerUnit, material.quantity))}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 flex items-center">
                        {/* Editar */}
                        <button
                          onClick={() => editMaterial(material.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 transition"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {/* Excluir */}
                        <button
                          onClick={() => deleteMaterial(material.id)}
                          className="text-red-600 hover:text-red-900 transition"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Total Geral */}
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-800">
            Total: {formatCurrency(total)}
          </p>
        </div>

        {/* Mensagem padrão, condicional */}
        {quotation.materials.some(m => m.showStandardMessage) && (
          <div className="mt-2 text-sm text-slate-500 italic">
            <p>
              Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.
            </p>
            <p>
              O valor final será baseado no romaneio oficial com medida real líquida de cada chapa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialList;
