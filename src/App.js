import React, { useState } from 'react';
import SpectrumHeader from './components/SpectrumHeader';
import SignalInputForm from './components/SignalInputForm';
import NoiseSettings from './components/NoiseSettings';
import SpectrumGraph from './components/SpectrumGraph';
import MeasurementsPanel from './components/MeasurementsPanel';

function App() {
  const [signals, setSignals] = useState([]);
  const [noiseData, setNoiseData] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  const handleAddSignal = (signal) => {
    setSignals([...signals, signal]);
    // Actualizar mediciones cuando se agrega una nueva señal
    updateMeasurements([...signals, signal], noiseData);
  };

  const handleNoiseCalculate = (noise) => {
    // Calcular el ruido térmico (kTB)
    const k = 1.380649e-23; // Constante de Boltzmann
    const bwHz = noise.bw * 1e6; // Convertir MHz a Hz
    const thermalNoise = 10 * Math.log10(k * noise.temperature * bwHz) + 30;
    
    // Considerar el ruido del sistema si está presente
    const totalNoise = 
      typeof noise.systemNoise === 'number'
        ? 10 * Math.log10(Math.pow(10, thermalNoise / 10) + Math.pow(10, noise.systemNoise / 10))
        : thermalNoise;

 
    // Actualizar el estado del ruido
    setNoiseData({
      thermalNoise,
      systemNoise: noise.systemNoise,
      totalNoise,
      bw: noise.bw
    });
    
    // Actualizar mediciones con el nuevo cálculo de ruido
    updateMeasurements(signals, {
      thermalNoise,
      systemNoise: noise.systemNoise,
      totalNoise,
      bw: noise.bw
    });
  };

  const updateMeasurements = (currentSignals, currentNoise) => {
    if (!currentNoise || currentSignals.length === 0) return;

    const newMeasurements = [];
    
    // Agregar información de ruido
    newMeasurements.push({
      label: 'Ruido Térmico',
      value: `${currentNoise.thermalNoise.toFixed(2)} dBm`
    });
 
    // Agregar ruido del sistema si está presente
    if (currentNoise.systemNoise) {
      newMeasurements.push({
        label: 'Ruido del Sistema',
        value: `${currentNoise.systemNoise.toFixed(2)} dBm`
      });
    }

    // Agregar ruido total
    newMeasurements.push({
      label: 'Ruido Total',
      value: `${currentNoise.totalNoise.toFixed(2)} dBm`
    });

    // Calcular SNR para cada señal
    currentSignals.forEach((signal, index) => {
      const snr = signal.power - currentNoise.totalNoise;
      newMeasurements.push({
        label: `SNR Señal ${index + 1} (${signal.name || 'Sin nombre'})`,
        value: `${snr.toFixed(2)} dB`
      });
    });

    setMeasurements(newMeasurements);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SpectrumHeader />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <SignalInputForm onAddSignal={handleAddSignal} />
            <NoiseSettings onNoiseCalculate={handleNoiseCalculate} />
            <MeasurementsPanel measurements={measurements} />
          </div>
          <div className="lg:col-span-2">
            <SpectrumGraph signals={signals} noiseData={noiseData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// DONE