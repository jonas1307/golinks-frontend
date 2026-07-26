import { FunctionComponent } from "react";
import { ILabelCount } from "../interfaces/IDashboard";

interface IBreakdownBarProps {
  data: ILabelCount[];
}

export const BreakdownBar: FunctionComponent<IBreakdownBarProps> = ({ data }) => {
  const max = data[0]?.count ?? 0;

  if (data.length === 0) {
    return <p className="text-sm text-gray-400">No data</p>;
  }

  return (
    <ul className="space-y-1.5">
      {data.map(({ label, count }) => (
        <li key={label} className="flex items-center gap-2 text-sm">
          <span className="w-28 shrink-0 truncate text-gray-600" title={label}>{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full"
              style={{ width: max ? `${(count / max) * 100}%` : "0%" }}
            />
          </div>
          <span className="w-10 text-right text-gray-500">{count}</span>
        </li>
      ))}
    </ul>
  );
};
