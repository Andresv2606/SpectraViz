import React, { useRef, useEffect, useState } from 'react';

const SpectrumGraph = ({ signals, noiseData }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [hoverPoint, setHoverPoint] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        setDimensions({
          width: svgRef.current.parentElement.clientWidth,
          height: 400,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allFrequencies = signals.map(s => s.fc);
  const allBandwidths = signals.map(s => s.bw);
  const maxFc = Math.max(...allFrequencies);
  const minFc = Math.min(...allFrequencies);
  const maxBw = Math.max(...allBandwidths);

  const totalRange = maxBw * 2;
  const margin = totalRange * 0.5;
  const freqMin = minFc - margin;
  const freqMax = maxFc + margin;
  const freqRange = freqMax - freqMin;
  const dbmRange = 140;

  const freqToX = (freq) => ((freq - freqMin) / freqRange) * dimensions.width;
  const dbmToY = (dbm) => ((70 - dbm) / dbmRange) * (dimensions.height - 50);
  const yToDbm = (y) => 70 - (y / (dimensions.height - 50)) * dbmRange;

  const calculateSignalPoints = (signal) => {
    const points = [];
    const centerFreq = signal.fc;
    const halfBw = signal.bw / 2;
    const startFreq = centerFreq - halfBw - 5;
    const endFreq = centerFreq + halfBw + 5;
    const minPower = -70;

    for (let i = 0; i <= 100; i++) {
      const freq = startFreq + (i / 100) * (endFreq - startFreq);
      const x = freqToX(freq);
      let power;

      if (freq < centerFreq - halfBw || freq > centerFreq + halfBw) {
        // Simular ruido de piso con variación aleatoria pequeña, por ejemplo +/- 3 dBm
        const noiseVariation = (Math.random() * 6) - 3; // entre -3 y +3
        power = minPower + noiseVariation;
      } else {
        // cálculo normal dentro de ancho de banda
        const normDiff = (freq - centerFreq) / halfBw; // Normalizado a [-1, 1]
        power = minPower + (signal.power - minPower) * (1 - normDiff * normDiff);
      }

      const y = dbmToY(power);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
};



const renderSignals = () => {
  return signals.map((signal, index) => {
    const xPeak = freqToX(signal.fc);
    const yPeak = dbmToY(signal.power);
    const yFall = dbmToY(signal.power - 3);
    const xStart = freqToX(signal.fc - signal.bw / 2);
    const xEnd = freqToX(signal.fc + signal.bw / 2);

    return (
      <g key={`signal-${index}`} className="signal-group">
        {/* Nombre de la señal arriba del pico */}
        <text
          x={xPeak}
          y={yPeak - 15}
          textAnchor="middle"
          fill={`hsl(${index * 120}, 80%, 40%)`}
          fontSize="11"
          fontWeight="bold"
        >
          {signal.name}
        </text>

        <polyline
          points={calculateSignalPoints(signal)}
          fill="none"
          stroke={`hsl(${index * 120}, 80%, 50%)`}
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        <text
          x={0}
          y={yPeak}
          textAnchor="start"
          fill={`hsl(${index * 120}, 80%, 50%)`}
          fontWeight="bold"
          fontSize={9}
        >
          {`${Math.abs(signal.power)} dBm`}
        </text>

        <line
          x1={xStart}
          y1={yFall}
          x2={xEnd}
          y2={yFall}
          stroke="gray"
          strokeDasharray="4,2"
        />
        <text
          x={xPeak}
          y={yFall - 5}
          textAnchor="middle"
          fill="gray"
          fontSize="10"
        >
          {`${signal.power - 3} dBm caída`}
        </text>
        <text
          x={xStart}
          y={dimensions.height - 35}
          textAnchor="middle"
          fill="black"
          fontSize="10"
        >
          {`${(signal.fc - signal.bw / 2).toFixed(2)} Hz`}
        </text>
        <text
          x={xEnd}
          y={dimensions.height - 35}
          textAnchor="middle"
          fill="black"
          fontSize="10"
        >
          {`${(signal.fc + signal.bw / 2).toFixed(2)} Hz`}
        </text>
        <text
          x={xPeak}
          y={dimensions.height - 20}
          textAnchor="middle"
          fill="black"
          fontSize="10"
          fontWeight="bold"
        >
          {`${signal.fc.toFixed(2)} Hz`}
        </text>
      </g>
    );
  });
};


  const renderNoiseFloor = () => {
    if (!noiseData) return null;
    const baseY = dbmToY(noiseData.totalNoise);
    const points = [];

    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * dimensions.width;
      const y = baseY + (Math.random() * 10 - 5);
      points.push(`${x},${y}`);
    }

    return (
      <>
        <path
          d={`M${points.join(' ')}`}
          fill="none"
          stroke="#666"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          strokeDasharray="2,2"
        />
        <line
          x1="0"
          y1={baseY}
          x2={dimensions.width}
          y2={baseY}
          stroke="#aaa"
          strokeDasharray="3,2"
        />
        <text
          x={5}
          y={baseY - 5}
          fill="#666"
          fontSize="10"
        >
          {`Ruido: ${noiseData.totalNoise} dBm`}
        </text>
      </>
    );
  };

  const renderAxes = () => {
    const lines = [];
    for (let i = -70; i <= 70; i += 10) {
      const y = dbmToY(i);
      lines.push(
        <g key={`y-${i}`}>
          <line x1="0" y1={y} x2={dimensions.width} y2={y} stroke="#eee" />
          <text x="0" y={y - 2} fontSize="10" fill="#555">{i} dBm</text>
        </g>
      );
    }

    const xCenter = freqToX((freqMax + freqMin) / 2);

    return (
      <>
        <line
          x1="0"
          y1={dbmToY(0)}
          x2={dimensions.width}
          y2={dbmToY(0)}
          stroke="#000"
        />
        {lines}
      </>
    );
  };

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dbm = parseFloat(yToDbm(y).toFixed(1));
    setHoverPoint({ x, y, dbm });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Visualización del Espectro</h2>
      <div
        className="relative w-full h-80 bg-gradient-to-b from-gray-50 to-white rounded overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverPoint(null)}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {renderAxes()}
          {renderNoiseFloor()}
          {renderSignals()}

          {hoverPoint && (
            <>
              <line
              x1="0"
              y1={hoverPoint.y}
              x2={dimensions.width}
              y2={hoverPoint.y}
              stroke="#666"
              strokeWidth="1"
              strokeDasharray="4,2"
            />

              <circle cx={hoverPoint.x} cy={hoverPoint.y} r="4" fill="#ff4757" />
              <text
                x={hoverPoint.x + 10}
                y={hoverPoint.y - 8}
                fill="#333"
                fontSize="10"
                fontWeight="bold"
              >
                {hoverPoint.dbm} dBm
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default SpectrumGraph;
