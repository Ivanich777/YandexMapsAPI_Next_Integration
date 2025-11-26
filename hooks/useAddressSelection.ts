import { useState, useCallback } from 'react';

interface UseAddressSelectionReturn {
  selectedAddress: string;
  addressCoordinates: [number, number] | null;
  isInZone: boolean | null;
  handleAddressSelect: (address: string, coordinates: [number, number]) => void;
  handleAddressClear: () => void;
  handleZoneCheck: (isInZone: boolean) => void;
}

export function useAddressSelection(): UseAddressSelectionReturn {
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [addressCoordinates, setAddressCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isInZone, setIsInZone] = useState<boolean | null>(null);

  const handleAddressSelect = useCallback(
    (address: string, coordinates: [number, number]) => {
      setSelectedAddress(address);
      setAddressCoordinates(coordinates);
    },
    []
  );

  const handleAddressClear = useCallback(() => {
    setSelectedAddress('');
    setAddressCoordinates(null);
    setIsInZone(null);
  }, []);

  const handleZoneCheck = useCallback((isInZone: boolean) => {
    setIsInZone(isInZone);
  }, []);

  return {
    selectedAddress,
    addressCoordinates,
    isInZone,
    handleAddressSelect,
    handleAddressClear,
    handleZoneCheck,
  };
}

