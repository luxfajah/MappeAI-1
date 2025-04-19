import { useEffect, useRef } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6B00', '#0C4DA2'];

type PieChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export function PieChart({ data }: PieChartProps) {
  // Make sure we have data to display
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <p className="text-gray-500">Sem dados para exibir</p>
      </div>
    );
  }

  // Format the legend text to be more readable
  const formatLegendText = (value: string) => {
    if (value.length > 20) {
      return value.substring(0, 20) + '...';
    }
    return value;
  };

  // Custom tooltip for better display
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">
            <span className="font-semibold">Valor:</span> {payload[0].value.toFixed(2)}
            {payload[0].payload.percent && (
              <span> ({(payload[0].payload.percent * 100).toFixed(1)}%)</span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  // Add percentage to the data for display
  const dataWithPercentage = data.map(item => {
    const total = data.reduce((sum, current) => sum + current.value, 0);
    return {
      ...item,
      percent: total > 0 ? item.value / total : 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={formatLegendText} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
