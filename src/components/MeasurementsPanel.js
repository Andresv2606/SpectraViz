import React from 'react';
// Ventana para la visualización de las mediciones
// Esta ventana mostrará las mediciones calculadas, como el nivel de ruido total y la potencia de la señal
const MeasurementsPanel = ({ measurements }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Mediciones</h2>
      <div className="space-y-2">
        {measurements.map((measure, index) => (
          <div key={index} className="p-2 border-b border-gray-100 last:border-0">
            <p className="font-medium text-gray-800">{measure.label}</p>
            <p className="text-gray-600">{measure.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementsPanel;