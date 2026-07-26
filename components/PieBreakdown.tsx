import { FunctionComponent } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ILabelCount } from "../interfaces/IDashboard";

interface IPieBreakdownProps {
  data: ILabelCount[];
}

const COLORS = ["#0d9488", "#0891b2", "#2563eb", "#4f46e5", "#6366f1", "#06b6d4", "#0f766e", "#475569"];

export const PieBreakdown: FunctionComponent<IPieBreakdownProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-sm text-gray-400">No data</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={35}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [Number(value).toLocaleString(), name]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
