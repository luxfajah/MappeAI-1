import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface SimpleMapProps {
  locations: Location[];
  cityName: string;
  className?: string;
}

// Função para gerar posições aproximadas com base no nome da cidade
// Isso é apenas para visualização, não são coordenadas reais
function generatePositions(cityName: string, count: number): Location[] {
  // Hash simples do nome da cidade para ter um ponto de partida consistente
  const hash = Array.from(cityName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const centerLat = -23.5505 + (hash % 10) * 0.1; // Centralizado aproximadamente no Brasil
  const centerLng = -46.6333 + (hash % 10) * 0.1;
  
  const positions: Location[] = [];
  
  for (let i = 0; i < count; i++) {
    positions.push({
      lat: centerLat + (Math.random() - 0.5) * 0.05,
      lng: centerLng + (Math.random() - 0.5) * 0.05,
      name: `Local ${i + 1}`
    });
  }
  
  return positions;
}

export default function SimpleMap({ locations, cityName, className = "" }: SimpleMapProps) {
  const [points, setPoints] = useState<Location[]>([]);
  
  useEffect(() => {
    // Se não houver locais fornecidos, gere alguns aleatórios
    if (!locations || locations.length === 0) {
      setPoints(generatePositions(cityName, 5));
    } else {
      setPoints(locations);
    }
  }, [locations, cityName]);
  
  // Normaliza as coordenadas para o espaço do SVG
  const normalizeCoord = (value: number, min: number, max: number, scale: number) => {
    return ((value - min) / (max - min)) * scale;
  };
  
  // Encontra os limites das coordenadas
  const minLat = Math.min(...points.map(p => p.lat));
  const maxLat = Math.max(...points.map(p => p.lat));
  const minLng = Math.min(...points.map(p => p.lng));
  const maxLng = Math.max(...points.map(p => p.lng));
  
  // Dimensões do SVG
  const width = 500;
  const height = 300;
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-0 left-0 p-2 bg-white/80 z-10 rounded-md">
        <h3 className="text-sm font-medium">Mapa de {cityName}</h3>
        <p className="text-xs text-gray-500">{points.length} locais encontrados</p>
      </div>
      
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="border rounded-lg bg-gray-100">
        {/* Desenha uma grade básica */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line 
            key={`grid-h-${i}`}
            x1="0" 
            y1={i * (height / 10)} 
            x2={width} 
            y2={i * (height / 10)}
            stroke="#ddd"
            strokeWidth="1"
          />
        ))}
        
        {Array.from({ length: 10 }).map((_, i) => (
          <line 
            key={`grid-v-${i}`}
            x1={i * (width / 10)} 
            y1="0" 
            x2={i * (width / 10)} 
            y2={height}
            stroke="#ddd"
            strokeWidth="1"
          />
        ))}
        
        {/* Desenha as ruas principais */}
        <line 
          x1={width * 0.2} 
          y1="0" 
          x2={width * 0.2} 
          y2={height}
          stroke="#ccc"
          strokeWidth="3"
        />
        
        <line 
          x1="0" 
          y1={height * 0.6} 
          x2={width} 
          y2={height * 0.6}
          stroke="#ccc"
          strokeWidth="3"
        />
        
        <line 
          x1={width * 0.7} 
          y1="0" 
          x2={width * 0.7} 
          y2={height}
          stroke="#ccc"
          strokeWidth="3"
        />
        
        <line 
          x1="0" 
          y1={height * 0.3} 
          x2={width} 
          y2={height * 0.3}
          stroke="#ccc"
          strokeWidth="3"
        />
        
        {/* Desenha as localizações */}
        {points.map((point, i) => {
          const x = normalizeCoord(point.lng, minLng - 0.01, maxLng + 0.01, width);
          const y = height - normalizeCoord(point.lat, minLat - 0.01, maxLat + 0.01, height); // Invertemos y porque SVG cresce para baixo
          
          return (
            <g key={i}>
              <circle 
                cx={x} 
                cy={y} 
                r="8"
                fill="rgba(147, 51, 234, 0.7)"
                stroke="#fff"
                strokeWidth="2"
              />
              <text 
                x={x} 
                y={y - 10}
                fontSize="10"
                textAnchor="middle"
                fill="#333"
              >
                {point.name}
              </text>
            </g>
          );
        })}
        
        {/* Ponto central para representar a localização do negócio */}
        <circle 
          cx={width / 2} 
          cy={height / 2} 
          r="10"
          fill="rgba(220, 38, 38, 0.8)"
          stroke="#fff"
          strokeWidth="2"
        />
        <text 
          x={width / 2} 
          y={height / 2 - 15}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          fill="#333"
        >
          Seu Negócio
        </text>
      </svg>
    </div>
  );
}