import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatCurrency, calculateTotal } from '../utils/formatters';
import { Edit, Trash2 } from 'lucide-react';
import { MaterialType } from '../types';

const MaterialList: React.FC = () => {
  const { quotation, deleteMaterial } = useQuotation();
  
  // Group materials by type
  const groupedMaterials = quotation.materials.reduce((acc, material) => {
    if (!acc[material.type]) acc[material.type] = [];
    acc[material.type].push(material);
    return acc;
  }, {} as Record<MaterialType, typeof quotation.materials>);
  
  // Sort types alphabetically
  const sortedTypes = Object.keys(groupedMaterials).sort() as MaterialType[];
  
  // Calculate total
  const total = quotation.materials.reduce(
    (sum, m) => sum + calculateTotal(m.pricePerUnit, m.quantity),
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

  const handleEdit = (id: string) => {
    console.log('Editar material', id);
    // TODO: implementar lógica de edição
  };

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
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Material</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Preço/m²</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Área (m²)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Medida líquida (m x m)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qtd</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detalhes</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {groupedMaterials[type].map((material) => {
                    const grossArea = material.dimensions.width * material.dimensions.height * material.quantity;
                    const netW = (material.dimensions.width - 0.05).toFixed(2);
                    const netH = (material.dimensions.height - 0.05).toFixed(2);
                    return (
                      <tr key={material.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{material.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{formatCurrency(material.pricePerUnit)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{grossArea.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{`${netW} x ${netH}`}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{material.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{formatCurrency(calculateTotal(material.pricePerUnit, material.quantity))}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate">{material.details || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(material.id)} className="text-indigo-600 hover:text-indigo-900 mr-3 transition" title="Editar">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteMaterial(material.id)} className="text-red-600 hover:text-red-900 transition" title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end border-t pt-4">
        <div className="text-xl font-bold text-slate-800">Total: {formatCurrency(total)}</div>
      </div>

      {quotation.showDefaultMeasure && (
        <div className="mt-2 text-sm text-slate-500 italic">
          <p>Obs: Medida padrão considerada 2,90 x 1,90 apenas para visualização do pedido, podendo variar para mais ou para menos.</p>
          <p>O valor final será baseado no ramenio oficial com medida real líquida de cada chapa.</p>
        </div>
      )}
    </div>
  );
};

export default MaterialList;
