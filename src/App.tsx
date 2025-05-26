import React from 'react';
import { QuotationProvider } from './context/QuotationContext';
import Header from './components/Header';
import CompanyForm from './components/CompanyForm';
import MaterialForm from './components/MaterialForm';
import MaterialList from './components/MaterialList';
import PaymentForm from './components/PaymentForm';
import QuotationPreview from './components/QuotationPreview';
import PDFGenerator from './components/PDFGenerator';

function App() {
  return (
    <QuotationProvider>
      <div className="min-h-screen bg-slate-100">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <CompanyForm />
              <MaterialForm />
              <PaymentForm />
            </div>
            
            <div className="lg:col-span-7">
              <MaterialList />
              <QuotationPreview />
              <PDFGenerator />
            </div>
          </div>
        </main>
        
        <footer className="bg-slate-800 text-white py-4 text-center text-sm">
          <p>Sistema de Orçamento de Chapas © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </QuotationProvider>
  );
}

export default App;