import { FunctionComponent } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { IDailyCount } from "../interfaces/IDashboard";

interface IClicksOverTimeChartProps {
  data: IDailyCount[];
}

export const ClicksOverTimeChart: FunctionComponent<IClicksOverTimeChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <p className="text-sm text-gray-400">No data</p>;
  }

  const formatted = data.map((d) => ({
    ...d,
    label: d.date.slice(5).replace("/", "-"),
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="cotGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [v, "Clicks"]} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#0d9488"
          fill="url(#cotGradient)"
          dot={false}
          activeDot={{ r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
