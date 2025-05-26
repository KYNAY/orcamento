import React, { useState } from 'react';
import { useQuotation } from '../context/QuotationContext';
import { MaterialType, FinishingType } from '../types';
import { PlusCircle } from 'lucide-react';

const MaterialForm: React.FC = () => {
  const { addMaterial } = useQuotation();

  // Campos do formulário
  const [name, setName] = useState('');
  const [type, setType] = useState<MaterialType>(MaterialType.GRANITE);
  const [finishing, setFinishing] = useState<FinishingType>(FinishingType.POLISHED);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [width, setWidth] = useState<number>(2.9);
  const [height, setHeight] = useState<number>(1.9);
  const [details, setDetails] = useState('');
  const [showStandardMessage, setShowStandardMessage] = useState<boolean>(false);

  // Cálculos de medida líquida e área total
  const netWidth = parseFloat((width - 0.05).toFixed(2));
  const netHeight = parseFloat((height - 0.05).toFixed(2));
  const totalArea = parseFloat((netWidth * netHeight * quantity).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterial({
      name,
      type,
      finishing,
      pricePerUnit,
      quantity,
      width,
      height,
      netWidth,
      netHeight,
      totalArea,
      details,
      showStandardMessage,
    });
    // reset para próximo item
    setName('');
    setType(MaterialType.GRANITE);
    setFinishing(FinishingType.POLISHED);
    setPricePerUnit(0);
    setQuantity(1);
    setWidth(2.9);
    setHeight(1.9);
    setDetails('');
    setShowStandardMessage(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4">
        Adicionar Material
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Nome do Material</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Branco Siena"
            className="w-full p-2 rounded bg-slate-100"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Tipo de Material</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as MaterialType)}
            className="w-full p-2 rounded bg-slate-100"
          >
            {Object.values(MaterialType).map(mt => (
              <option key={mt} value={mt}>{mt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Industrialização</label>
          <select
            value={finishing}
            onChange={e => setFinishing(e.target.value as FinishingType)}
            className="w-full p-2 rounded bg-slate-100"
          >
            {Object.values(FinishingType).map(ft => (
              <option key={ft} value={ft}>{ft}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Preço por m² (R$)</label>
          <input
            type="number"
            step="0.01"
            value={pricePerUnit}
            onChange={e => setPricePerUnit(+e.target.value)}
            className="w-full p-2 rounded bg-slate-100"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Medida Bruta (m)</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={width}
              onChange={e => setWidth(+e.target.value)}
              className="w-full p-2 rounded bg-slate-100"
              placeholder="2.90"
            />
            <span className="self-center">×</span>
            <input
              type="number"
              step="0.01"
              value={height}
              onChange={e => setHeight(+e.target.value)}
              className="w-full p-2 rounded bg-slate-100"
              placeholder="1.90"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Quantidade de Chapas</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(+e.target.value)}
            className="w-full p-2 rounded bg-slate-100"
            min={1}
            required
          />
        </div>
      </div>

      {/* Medida líquida e área total */}
      <div className="text-sm text-slate-500">
        <p>Medida líquida: {netWidth} m × {netHeight} m</p>
        <p>Total de área: {totalArea} m²</p>
      </div>

      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showStandardMessage}
            onChange={e => setShowStandardMessage(e.target.checked)}
            className="mr-2"
          />
          Mostrar mensagem de medida padrão
        </label>
      </div>

      <div>
        <label className="block mb-1">Detalhes Adicionais</label>
        <textarea
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Acabamentos, observações, etc."
          className="w-full p-2 rounded bg-slate-100"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded flex items-center justify-center transition"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Adicionar Material
      </button>
    </form>
  );
};

export default MaterialForm;
