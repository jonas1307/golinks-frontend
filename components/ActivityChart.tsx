import React, { FunctionComponent } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { IMetric } from "../interfaces/IMetric";
import { eachDayOfInterval, format, sub } from "date-fns";

export interface IActivityChart {
  minHeight?: string;
  metrics?: IMetric[];
}

export const ActivityChart: FunctionComponent<IActivityChart> = ({
  minHeight,
  metrics,
}) => {
  const now = new Date();

  const days = eachDayOfInterval({
    end: now,
    start: sub(now, {
      days: 30,
    }),
  });

  const data = days.map((day) => ({
    date: format(day, "yyyy/MM/dd"),
    count: 0,
  }));

  if (metrics) {
    metrics.forEach((metric) => {
      const idx = data.findIndex((d) => d.date === metric.date);
      if (idx !== -1) {
        data[idx].count = metric.totalClicks;
      }
    });
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={false} stroke="none" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          name="Count"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#gradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
