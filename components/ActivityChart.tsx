import React, { FunctionComponent } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IMetric } from "../interfaces/IMetric";
import { eachDayOfInterval, format, sub } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export interface IActivityChart {
  minHeight?: string;
  metrics?: IMetric[];
}

export const ActivityChart: FunctionComponent<IActivityChart> = ({
  minHeight,
  metrics,
}) => {
  const now = new Date();

  const nowUtc = toZonedTime(now, "UTC");

  const days = eachDayOfInterval({
    end: nowUtc,
    start: sub(nowUtc, {
      days: 30,
    }),
  });

  var upperValue = 1;
  var lowerValue = -1;

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

    upperValue = Math.max(...data.map((item) => item.count)) * 1.01;
    lowerValue = -upperValue;
  }

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide={true} />
        <YAxis hide={true} domain={[lowerValue, upperValue]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          name="Count"
          stroke="#0d9488"
          fillOpacity={1}
          fill="url(#gradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
