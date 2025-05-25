import React, { useState } from 'react';

// Se define el estado inicial del formulario de entrada de señal, incluyendo potencia, ancho de banda, frecuencia central y nombre.
// Esta ventana permite al usuario agregar señales al espectro, especificando sus características.
const SignalInputForm = ({ onAddSignal }) => {
  const [signal, setSignal] = useState({
    power: '',
    bw: '',
    fc: '',
    name: ''
  });
 // Funcion para manejar el envio del formulario de entrada de señal
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSignal({
      ...signal,
      power: parseFloat(signal.power),
      bw: parseFloat(signal.bw),
      fc: parseFloat(signal.fc)
    });
    setSignal({ power: '', bw: '', fc: '', name: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Agregar Señal</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text" // Campo de texto para el nombre de la señal
            value={signal.name} // Enlazado al estado de nombre
            onChange={(e) => setSignal({...signal, name: e.target.value})} // Actualizacion de estado de nombre
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Potencia (dBm)</label>
          <input
            type="number"
            step="0.01" // Permitir decimales para la potencia
            value={signal.power} // Enlazado al estado de potencia
            onChange={(e) => setSignal({...signal, power: e.target.value})} // Actualizacion de estado de potencia
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ancho de Banda (MHz)</label>
          <input
            type="number"
            value={signal.bw} // Enlazado al estado de ancho de banda
            onChange={(e) => setSignal({...signal, bw: e.target.value})} // Actualizacion de estado de ancho de banda
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Frecuencia Central (MHz)</label>
          <input
            type="number" 
            value={signal.fc}  // Enlazado al estado de frecuencia central 
            onChange={(e) => setSignal({...signal, fc: e.target.value})} // Actualizacion de estado de frecuencia central
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button // Botón para enviar el formulario
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Agregar Señal
        </button>
      </form>
    </div>
  );
};

export default SignalInputForm;