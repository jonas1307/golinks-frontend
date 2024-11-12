import { FunctionComponent } from "react";
import { SelectComponent } from "./SelectComponent";

export interface ILinkFiltersProps {
  metricRange: string;
  setMetricRange: (value: string) => void;
}

export const LinkFilters: FunctionComponent<ILinkFiltersProps> = ({
  metricRange,
  setMetricRange,
}) => {
  const selectOptions = [
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
  ];

  return (
    <div>
      <SelectComponent
        id="MetricRange"
        options={selectOptions}
        onChange={(value) => setMetricRange(value)}
        selectedValue={metricRange}
        label="Metric Range"
      />
    </div>
  );
};
