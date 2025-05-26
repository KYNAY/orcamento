import React from 'react';
import { Ruler } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center">
        <Ruler className="h-8 w-8 mr-3 text-teal-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Sistema de Orçamento de Chapas
        </h1>
      </div>
    </header>
  );
};

export default Header;