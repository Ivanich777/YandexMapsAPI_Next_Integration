'use client';

import { useState, useMemo } from 'react';
import YandexMap from '@/components/YandexMap';
import DistanceInput from '@/components/DistanceInput';
import AddressInput from '@/components/AddressInput';
import { useAddressSelection } from '@/hooks/useAddressSelection';

export default function Home() {
  const [radiusKm, setRadiusKm] = useState(25);
  const {
    selectedAddress,
    addressCoordinates,
    handleAddressSelect,
    handleAddressClear,
    handleZoneCheck,
  } = useAddressSelection();

  const apiKey = useMemo(
    () => process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
    []
  );

  return (
    <main className="min-h-screen bg-gray-900 p-4 md:p-8 lg:p-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-100">
          Зона доставки БЛГ от КАДа
        </h1>

        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="w-full max-w-2xl flex items-end gap-4">
            <div className="flex-1">
              <AddressInput
                onAddressSelect={handleAddressSelect}
                onClear={handleAddressClear}
                value={selectedAddress}
                className="w-full"
              />
            </div>
            <DistanceInput
              value={radiusKm}
              onChange={setRadiusKm}
              min={25}
              max={200}
              step={0.5}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700">
          {apiKey ? (
            <YandexMap
              radiusKm={radiusKm}
              addressCoordinates={addressCoordinates}
              onZoneCheck={handleZoneCheck}
              className="w-full"
            />
          ) : (
            <div className="min-h-[500px] flex items-center justify-center bg-gray-900 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-300 mb-2">
                  API ключ не найден
                </p>
                <p className="text-gray-400">
                  Добавьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY в файл .env.local
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
