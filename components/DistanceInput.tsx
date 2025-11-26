'use client';

import { useState, useCallback, useEffect, memo } from 'react';

interface DistanceInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function DistanceInput({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
}: DistanceInputProps) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = e.target.value;
      setInputValue(newValue);

      const numValue = parseFloat(newValue);
      if (!isNaN(numValue) && numValue >= min && numValue <= max) {
        onChange(numValue);
      }
    },
    [min, max, onChange]
  );

  const handleBlur = useCallback((): void => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    } else {
      setInputValue(numValue.toString());
    }
  }, [inputValue, min, max, onChange]);

  return (
    <div className="w-fit">
      <div className="flex items-center gap-2">
        <input
          id="distance"
          type="number"
          min={min}
          max={max}
          step={step}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-24 px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="25"
        />
        <span className="text-gray-300 font-medium text-sm">км</span>
      </div>
    </div>
  );
}

export default memo(DistanceInput);

