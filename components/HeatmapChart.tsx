import { FunctionComponent } from "react";
import { IHeatmapEntry } from "../interfaces/IDashboard";

interface IHeatmapChartProps {
  data: IHeatmapEntry[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const HeatmapChart: FunctionComponent<IHeatmapChartProps> = ({ data }) => {
  const map = new Map<string, number>();
  let maxCount = 0;

  data.forEach(({ dayOfWeek, hour, count }) => {
    map.set(`${dayOfWeek}-${hour}`, count);
    if (count > maxCount) maxCount = count;
  });

  const intensity = (count: number) => {
    if (maxCount === 0 || count === 0) return 0;
    return count / maxCount;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex text-xs text-gray-400 mb-1 ml-8">
          {HOURS.map((h) => (
            <div key={h} className="flex-1 text-center">
              {h % 3 === 0 ? h : ""}
            </div>
          ))}
        </div>
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center mb-0.5">
            <span className="text-xs text-gray-400 w-8 shrink-0">{day}</span>
            {HOURS.map((hour) => {
              const count = map.get(`${dayIdx}-${hour}`) ?? 0;
              const alpha = intensity(count);
              return (
                <div
                  key={hour}
                  className="flex-1 h-5 mx-px"
                  style={{ backgroundColor: `rgba(13, 148, 136, ${alpha})`, minWidth: 0 }}
                  title={count > 0 ? `${day} ${hour}h: ${count} click${count !== 1 ? "s" : ""}` : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
