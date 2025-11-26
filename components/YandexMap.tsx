'use client';

import { memo } from 'react';
import { type DeliveryZoneOptions } from '@/lib/yandex-maps';
import { useMap } from '@/hooks/useMap';

interface YandexMapProps {
  radiusKm: number;
  zoneOptions?: Partial<DeliveryZoneOptions>;
  addressCoordinates?: [number, number] | null;
  onZoneCheck?: (isInZone: boolean) => void;
  className?: string;
}

function YandexMap({
  radiusKm,
  zoneOptions,
  addressCoordinates,
  onZoneCheck,
  className = '',
}: YandexMapProps) {
  const { mapRef, isLoading, error } = useMap({
    radiusKm,
    zoneOptions,
    addressCoordinates,
    onZoneCheck,
  });

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-gray-600">Загрузка карты...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg z-10">
          <div className="text-red-600">{error}</div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[500px] rounded-lg"
        style={{ display: isLoading || error ? 'none' : 'block' }}
      />
    </div>
  );
}

export default memo(YandexMap);

