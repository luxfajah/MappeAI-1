import { useEffect, useRef } from "react";
import { 
  ScatterChart as RechartsScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip,
  Legend,
  ResponsiveContainer 
} from "recharts";

type ScatterChartProps = {
  data: {
    competitor: string;
    x: number; // price (higher is more expensive)
    y: number; // quality/feature richness (higher is better)
    marketShare: number; // size of the bubble
  }[];
};

export function ScatterChart({ data }: ScatterChartProps) {
  // Make sure we have data to display
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <p className="text-gray-500">Sem dados para exibir</p>
      </div>
    );
  }

  // Custom tooltip for better display
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{item.competitor}</p>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Preço:</span> {(item.x * 10).toFixed(1)}/10
            </p>
            <p>
              <span className="font-semibold">Qualidade:</span> {(item.y * 10).toFixed(1)}/10
            </p>
            <p>
              <span className="font-semibold">Market Share:</span> {(item.marketShare * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Process the data for better visualization
  const formattedData = data.map(item => ({
    ...item,
    z: item.marketShare * 1000, // Scale marketShare for better bubble size
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Preço" 
          domain={[0, 1]} 
          label={{ 
            value: 'Preço', 
            position: 'bottom',
            offset: 0
          }}
          tickFormatter={(value) => `${(value * 10).toFixed(0)}`}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Qualidade" 
          domain={[0, 1]}
          label={{ 
            value: 'Qualidade', 
            angle: -90, 
            position: 'left',
            offset: 0
          }}
          tickFormatter={(value) => `${(value * 10).toFixed(0)}`}
        />
        <ZAxis 
          type="number" 
          dataKey="z" 
          range={[100, 500]} 
          name="Market Share" 
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter 
          name="Empresas" 
          data={formattedData} 
          fill="#0C4DA2" 
          nameKey="competitor"
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}
