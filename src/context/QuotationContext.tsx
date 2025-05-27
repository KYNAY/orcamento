import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  QuotationData, 
  Material, 
  PaymentMethod, 
  BankDetails,
  MaterialType
} from '../types';
import { getDefaultValidityDate } from '../utils/formatters';

interface QuotationContextType {
  quotation: QuotationData;
  updateQuotation: (data: Partial<QuotationData>) => void;
  addMaterial: (material: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  resetQuotation: () => void;
  editingMaterialId: string | null;
  setEditingMaterialId: (id: string | null) => void;
}

const defaultBankDetails: BankDetails = {
  bank: '',
  agency: '',
  account: '',
  cnpj: '',
  companyName: '',
  pix: '',
};

const initialQuotation: QuotationData = {
  company: '',
  seller: '',
  client: '',
  materials: [],
  paymentMethod: PaymentMethod.CASH,
  installments: 1,
  bankDetails: defaultBankDetails,
  showBankDetails: false,
  validUntil: getDefaultValidityDate(),
  createdAt: new Date(),
};

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quotation, setQuotation] = useState<QuotationData>(initialQuotation);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null); // 🔧 NOVO

  const updateQuotation = (data: Partial<QuotationData>) => {
    setQuotation(prev => ({ ...prev, ...data }));
  };

  const addMaterial = (material: Omit<Material, 'id'>) => {
    const newMaterial = { ...material, id: uuidv4() };
    setQuotation(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));
  };

  const updateMaterial = (id: string, material: Partial<Material>) => {
    setQuotation(prev => ({
      ...prev,
      materials: prev.materials.map(m => 
        m.id === id ? { ...m, ...material } : m
      ),
    }));
  };

  const deleteMaterial = (id: string) => {
    setQuotation(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id),
    }));
  };

  const resetQuotation = () => {
    setQuotation(initialQuotation);
  };

  return (
    <QuotationContext.Provider
      value={{
        quotation,
        updateQuotation,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        resetQuotation,
        editingMaterialId,        // 🔧 NOVO
        setEditingMaterialId,     // 🔧 NOVO
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = (): QuotationContextType => {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotation must be used within a QuotationProvider');
  }
  return context;
};
