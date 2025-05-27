import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import { formatCurrency } from '../utils/formatters';
import { Edit, Trash2 } from 'lucide-react';
import { MaterialType } from '../types';

const MaterialList: React.FC = () => {
  const { quotation, deleteMaterial, setEditingMaterialId } = useQuotation();

  // Agrupa materiais por tipo
  const groupedMaterials = quotation.materials.reduce((acc, material) => {
    if (!acc[material.type]) acc[material.type] = [];
    acc[material.type].push(material);
    return acc;
  }, {} as Record<MaterialType, typeof quotation.materials>);

  // Tipos ordenados
  const sortedTypes = Object.keys(groupedMaterials).sort() as MaterialType[];

  // Total geral, usando área líquida
  const total = quotation.materials.reduce((sum, material) => {
    const netArea =
      (material.dimensions.width - 0.05) *
      (material.dimensions.height - 0.05) *
      material.quantity;
    return sum + material.pricePerUnit * netArea;
  }, 0);

  if (quotation.materials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
          Materiais Selecionados
        </h2>
        <div className="p-8 text-center text-slate-500">
          <p>Nenhum material adicionado.</p>
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
        {sortedTypes.map(type => (
          <div key={type} className="space-y-2">
            <h3 className="text-lg font-medium text-slate-700">{type}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 w-1/6 text-left text-xs font-medium text-slate-500 uppercase">
                      Acabamento
                    </th>
                    <th className="px-4 py-3 w-2/5 text-left text-xs font-medium text-slate-500 uppercase">
                      Material
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Preço/m²
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Área (m²)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Medida líquida
                    </th>
                    <th className="px-4 py-3 w-1/12 text-left text-xs font-medium text-slate-500 uppercase">
                      Qtd
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {groupedMaterials[type].map(material => {
                    const netArea =
                      (material.dimensions.width - 0.05) *
                      (material.dimensions.height - 0.05) *
                      material.quantity;
                    const netW = (material.dimensions.width - 0.05).toFixed(2);
                    const netH = (material.dimensions.height - 0.05).toFixed(2);

                    return (
                      <tr key={material.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {material.finishing}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {material.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {formatCurrency(material.pricePerUnit)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {netArea.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {`${netW} x ${netH}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {material.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {formatCurrency(material.pricePerUnit * netArea)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingMaterialId(material.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteMaterial(material.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
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
        <div className="text-xl font-bold text-slate-800">
          Total: {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
};

export default MaterialList;
