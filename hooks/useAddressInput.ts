import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseAddressInputOptions {
  value?: string;
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  onClear?: () => void;
}

interface UseAddressInputReturn {
  inputValue: string;
  suggestions: string[];
  showSuggestions: boolean;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  suggestionsRef: React.RefObject<HTMLDivElement | null>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSuggestionClick: (address: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  handleFocus: () => void;
}

const SPB_BOUNDS = {
  southwest: [59.5, 29.0] as [number, number],
  northeast: [60.5, 31.0] as [number, number],
};

const MAX_RESULTS = 5;
const DEBOUNCE_DELAY = 300;

export function useAddressInput({
  value,
  onAddressSelect,
  onClear,
}: UseAddressInputOptions): UseAddressInputReturn {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedInputValue = useDebounce(inputValue, DEBOUNCE_DELAY);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const geocodeAddress = useCallback(
    (query: string): Promise<[string, [number, number]] | null> => {
      if (!window.ymaps) {
        return Promise.resolve(null);
      }

      return (window.ymaps as any)
        .geocode(query)
        .then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const coordinates = firstGeoObject.geometry?.getCoordinates() as
              | [number, number]
              | undefined;
            if (coordinates && coordinates.length === 2) {
              const address = firstGeoObject.getAddressLine() || query;
              const convertedCoords: [number, number] = [
                coordinates[1],
                coordinates[0],
              ];
              return [address, convertedCoords] as [string, [number, number]];
            }
          }
          return null;
        })
        .catch(() => null);
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (!newValue.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
        if (onClear) {
          onClear();
        }
      }
    },
    [onClear]
  );

  useEffect(() => {
    if (!debouncedInputValue.trim() || !window.ymaps) {
      return;
    }

    setIsLoading(true);

    (window.ymaps as any)
      .geocode(debouncedInputValue, {
        boundedBy: [SPB_BOUNDS.southwest, SPB_BOUNDS.northeast],
        strictBounds: false,
        results: MAX_RESULTS,
      })
      .then((res: any) => {
        const geoObjects = res.geoObjects;
        if (geoObjects && geoObjects.getLength() > 0) {
          const addresses: string[] = [];
          geoObjects.each((geoObject: any) => {
            const address =
              geoObject.getAddressLine() ||
              geoObject.properties.get('name') ||
              '';
            if (address) {
              addresses.push(address);
            }
          });
          setSuggestions(addresses);
          setShowSuggestions(addresses.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setSuggestions([]);
        setShowSuggestions(false);
      });
  }, [debouncedInputValue]);

  const handleSuggestionClick = useCallback(
    (address: string) => {
      setInputValue(address);
      setShowSuggestions(false);
      setIsLoading(true);

      geocodeAddress(address).then((result) => {
        if (result) {
          const [addr, coords] = result;
          onAddressSelect(addr, coords);
        }
        setIsLoading(false);
      });
    },
    [geocodeAddress, onAddressSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        if (suggestions.length > 0) {
          handleSuggestionClick(suggestions[0]);
        } else {
          setIsLoading(true);
          geocodeAddress(inputValue).then((result) => {
            if (result) {
              const [addr, coords] = result;
              onAddressSelect(addr, coords);
            }
            setIsLoading(false);
          });
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    },
    [inputValue, suggestions, handleSuggestionClick, geocodeAddress, onAddressSelect]
  );

  const handleClear = useCallback(() => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onClear) {
      onClear();
    }
  }, [onClear]);

  const handleFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  return {
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
  };
}

