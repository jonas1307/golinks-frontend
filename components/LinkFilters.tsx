import { FunctionComponent, useEffect, useRef, useState } from "react";
import { SelectComponent } from "./SelectComponent";
import { FiSearch } from "react-icons/fi";

export interface ILinkFiltersProps {
  metricRange: string;
  setMetricRange: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

export const LinkFilters: FunctionComponent<ILinkFiltersProps> = ({
  metricRange,
  setMetricRange,
  search,
  setSearch,
}) => {
  const [inputValue, setInputValue] = useState(search);
  const setSearchRef = useRef(setSearch);
  const prevInputValue = useRef(inputValue);
  useEffect(() => { setSearchRef.current = setSearch; });

  useEffect(() => {
    if (inputValue === prevInputValue.current) return;
    prevInputValue.current = inputValue;
    const timer = setTimeout(() => setSearchRef.current(inputValue), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const selectOptions = [
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
  ];

  return (
    <div className="flex justify-between items-center py-4 gap-4">
      <div className="relative w-full md:flex-1 md:max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by slug, URL or description..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
        />
      </div>
      <div className="hidden md:block">
        <SelectComponent
          id="MetricRange"
          options={selectOptions}
          onChange={(value) => setMetricRange(value)}
          selectedValue={metricRange}
          label="Metric Range"
        />
      </div>
    </div>
  );
};
