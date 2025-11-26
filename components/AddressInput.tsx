'use client';

import { memo } from 'react';
import { useAddressInput } from '@/hooks/useAddressInput';

interface AddressInputProps {
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  onClear?: () => void;
  value?: string;
  className?: string;
}

function AddressInput({
  onAddressSelect,
  onClear,
  value,
  className = '',
}: AddressInputProps) {
  const {
    inputValue,
    suggestions,
    showSuggestions,
    isLoading,
    inputRef,
    suggestionsRef,
    handleInputChange,
    handleSuggestionClick,
    handleKeyDown,
    handleClear,
    handleFocus,
  } = useAddressInput({ value, onAddressSelect, onClear });

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Введите адрес для проверки"
          className="w-full px-3 py-1.5 pr-10 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {inputValue && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            title="Очистить"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-500 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left text-sm text-gray-100 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(AddressInput);

