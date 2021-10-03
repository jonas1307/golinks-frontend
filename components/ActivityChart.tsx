import React, { FunctionComponent } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export interface IActivityChart {
  minHeight?: string;
}

export const ActivityChart: FunctionComponent<IActivityChart> = ({
  minHeight,
}) => {
  const data = [
    {
      name: "15/09/2021",
      uv: 12,
    },
    {
      name: "16/09/2021",
      uv: 5,
    },
    {
      name: "17/09/2021",
      uv: 12,
    },
    {
      name: "18/09/2021",
      uv: 25,
    },
    {
      name: "19/09/2021",
      uv: 10,
    },
    {
      name: "15/09/2021",
      uv: 12,
    },
    {
      name: "16/09/2021",
      uv: 5,
    },
    {
      name: "17/09/2021",
      uv: 12,
    },
    {
      name: "18/09/2021",
      uv: 25,
    },
    {
      name: "19/09/2021",
      uv: 10,
    },
    {
      name: "15/09/2021",
      uv: 12,
    },
    {
      name: "16/09/2021",
      uv: 5,
    },
    {
      name: "17/09/2021",
      uv: 12,
    },
    {
      name: "18/09/2021",
      uv: 25,
    },
    {
      name: "19/09/2021",
      uv: 10,
    },
    {
      name: "15/09/2021",
      uv: 12,
    },
    {
      name: "16/09/2021",
      uv: 5,
    },
    {
      name: "17/09/2021",
      uv: 12,
    },
    {
      name: "18/09/2021",
      uv: 25,
    },
    {
      name: "19/09/2021",
      uv: 10,
    },
    {
      name: "15/09/2021",
      uv: 12,
    },
    {
      name: "16/09/2021",
      uv: 5,
    },
    {
      name: "17/09/2021",
      uv: 12,
    },
    {
      name: "18/09/2021",
      uv: 25,
    },
    {
      name: "19/09/2021",
      uv: 10,
    },
    {
      name: "15/09/2021",
      uv: 12,
    },
    {
      name: "16/09/2021",
      uv: 5,
    },
    {
      name: "17/09/2021",
      uv: 12,
    },
    {
      name: "18/09/2021",
      uv: 25,
    },
    {
      name: "19/09/2021",
      uv: 10,
    },
  ];

  return (
    <ResponsiveContainer minHeight={minHeight}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="name" tick={false} />
        <Tooltip />
        <Area type="monotone" dataKey="uv" name="Count" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
