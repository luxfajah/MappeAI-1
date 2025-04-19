import { useEffect, useRef } from "react";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";

type BarChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export function BarChart({ data }: BarChartProps) {
  // Make sure we have data to display
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <p className="text-gray-500">Sem dados para exibir</p>
      </div>
    );
  }

  // Format the X-axis labels if they're too long
  const formatXAxis = (value: string) => {
    if (value.length > 12) {
      return value.substring(0, 12) + '...';
    }
    return value;
  };

  // Custom tooltip for better display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-semibold">Valor:</span> {payload[0].value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Determine the maximum value for proper scaling
  const maxValue = Math.max(...data.map(item => item.value));
  const dataWithFormattedName = data.map(item => ({
    ...item,
    formattedName: formatXAxis(item.name)
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={dataWithFormattedName}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="formattedName" 
          angle={-45} 
          textAnchor="end" 
          height={70} 
        />
        <YAxis 
          domain={[0, maxValue * 1.1]} 
          tickFormatter={(value) => 
            value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill="#0C4DA2" 
          name="Preço" 
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
