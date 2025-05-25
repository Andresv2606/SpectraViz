import React, { useState } from 'react';

// Se define el estado inicial de la configuración de ruido, incluyendo temperatura, ancho de banda y ruido del sistema.
const NoiseSettings = ({ onNoiseCalculate }) => {
  const [noise, setNoise] = useState({
    temperature: '290',
    bw: '',
    systemNoise: ''
  });

// Funcion para manejar el envio del formulario de configuración de ruido 
  const handleSubmit = (e) => {
    e.preventDefault();
    onNoiseCalculate({
      temperature: parseFloat(noise.temperature),
      bw: parseFloat(noise.bw),
      systemNoise: noise.systemNoise ? parseFloat(noise.systemNoise) : null
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Configuración de Ruido</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Temperatura (°K)</label> 
          <input
            type="number"
            step="0.1" // Permitir decimales para la temperatura
            value={noise.temperature} //Enlazado al estado de temperatura
            onChange={(e) => setNoise({...noise, temperature: e.target.value})} // Actualizacion de estado de temperatura
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ancho de Banda (MHz)</label>
          <input
            type="number"
            value={noise.bw} // Enlazado al estado de ancho de banda
            onChange={(e) => setNoise({...noise, bw: e.target.value})} // Actualizacion de estado de ancho de banda
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ruido del Sistema (dBm) - Opcional</label>
          <input
            type="number"
            step="0.01" // Permitir decimales para el ruido del sistema
            value={noise.systemNoise} // Enlazado al estado de ruido del sistema
            onChange={(e) => setNoise({...noise, systemNoise: e.target.value})} // Actualizacion de estado de ruido del sistema
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button // Botón para enviar el formulario
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Calcular Ruido
        </button>
      </form>
    </div>
  );
};

export default NoiseSettings;