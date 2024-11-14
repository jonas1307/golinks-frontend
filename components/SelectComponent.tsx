import React, {
  useState,
  ChangeEvent,
  FunctionComponent,
  useEffect,
} from "react";

type Option = {
  value: string;
  label: string;
};

export interface SelectProps {
  id: string;
  options: Option[];
  onChange: (value: string) => void;
  defaultLabel?: string | undefined;
  selectedValue?: string | undefined;
  label?: string | undefined;
}

export const SelectComponent: FunctionComponent<SelectProps> = ({
  id,
  options,
  onChange,
  defaultLabel,
  selectedValue = "",
  label,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    setSelectedOption(selectedValue);
  }, [selectedValue]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="flex items-center space-x-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}:
        </label>
      )}
      <select
        className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
        value={selectedOption}
        onChange={handleChange}
        id={id}
      >
        {defaultLabel && (
          <option value="">{<option value="">{defaultLabel}</option>}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
