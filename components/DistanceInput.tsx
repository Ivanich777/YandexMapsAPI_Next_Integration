'use client';

import { useState, useCallback } from 'react';

interface DistanceInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Компонент для ввода радиуса зоны доставки в километрах
 */
export default function DistanceInput({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
}: DistanceInputProps): React.ReactElement {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  }, [min, max, onChange]);

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

  const handleRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseFloat(e.target.value);
    setInputValue(newValue.toString());
    onChange(newValue);
  }, [onChange]);

  return (
    <div className="w-full max-w-md">
      <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
        Радиус зоны доставки (км)
      </label>
      <div className="flex items-center gap-4">
        <input
          id="distance"
          type="number"
          min={min}
          max={max}
          step={step}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Введите расстояние"
        />
        <span className="text-gray-600 font-medium">км</span>
      </div>
      <div className="mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min} км</span>
          <span>{max} км</span>
        </div>
      </div>
    </div>
  );
}

