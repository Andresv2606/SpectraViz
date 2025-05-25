import React from 'react';

// Componente de encabezado para la aplicación SpectraViz
const SpectrumHeader = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">SpectraViz</h1>
        <p className="text-sm text-gray-600">Analizador de Espectro Web</p>
      </div>
    </header>
  );
};

export default SpectrumHeader;