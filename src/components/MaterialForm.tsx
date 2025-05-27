import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useQuotation } from '../context/QuotationContext';
import { MaterialType, FinishingType } from '../types';
import { PlusCircle } from 'lucide-react';

const MaterialForm: React.FC = () => {
  const { addMaterial } = useQuotation();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<MaterialType>(MaterialType.GRANITE);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>('');
  const [details, setDetails] = useState('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [finishing, setFinishing] = useState<FinishingType>(FinishingType.POLISHED);
  const [showStandardMessage, setShowStandardMessage] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert dimensions to numbers, use default if empty
    const numWidth = width ? parseFloat(width) : 2.90;
    const numHeight = height ? parseFloat(height) : 1.90;
    
    // Calculate net dimensions (subtract 5cm from each dimension)
    const netWidth = numWidth - 0.05;
    const netHeight = numHeight - 0.05;
    
    addMaterial({
      name,
      type,
      pricePerUnit,
      quantity: parseInt(quantity) || 1,
      details,
      dimensions: {
        width: numWidth,
        height: numHeight,
      },
      finishing,
      showStandardMessage,
    });
    
    // Reset form
    setName('');
    setType(MaterialType.GRANITE);
    setPricePerUnit(0);
    setQuantity('');
    setDetails('');
    setWidth('');
    setHeight('');
    setFinishing(FinishingType.POLISHED);
    setShowStandardMessage(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">
        Adicionar Material
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome do Material
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              placeholder="Ex: Branco Siena"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de Material
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MaterialType)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            >
              {Object.values(MaterialType).map((materialType) => (
                <option key={materialType} value={materialType}>
                  {materialType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Industrialização
            </label>
            <select
              value={finishing}
              onChange={(e) => setFinishing(e.target.value as FinishingType)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            >
              {Object.values(FinishingType).map((finishingType) => (
                <option key={finishingType} value={finishingType}>
                  {finishingType}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Preço por m²
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricePerUnit || ''}
                onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                className="w-full p-2 pl-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Medida Bruta (m)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="2.90"
              />
              <span className="flex items-center">x</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                placeholder="1.90"
              />
            </div>
            {(width || height) && (
              <p className="text-xs text-slate-500 mt-1">
                Medida líquida: {(parseFloat(width || '2.90') - 0.05).toFixed(2)}m x {(parseFloat(height || '1.90') - 0.05).toFixed(2)}m
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantidade de Chapas
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              placeholder="1"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Detalhes Adicionais
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            placeholder="Acabamentos, observações, etc."
            rows={2}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showStandardMessage"
            checked={showStandardMessage}
            onChange={(e) => setShowStandardMessage(e.target.checked)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
          />
          <label htmlFor="showStandardMessage" className="ml-2 text-sm text-slate-700">
            Mostrar mensagem de medida padrão
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200 shadow-md"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Adicionar Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
