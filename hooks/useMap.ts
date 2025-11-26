import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { KAD_CENTER, KAD_COORDINATES } from '@/lib/kad-coordinates';
import { DEFAULT_ZONE_OPTIONS, type DeliveryZoneOptions } from '@/lib/yandex-maps';
import { useYandexMaps } from './useYandexMaps';
import { createDeliveryZoneBuffer, checkPointInZone } from '@/lib/buffer-utils';

interface UseMapOptions {
  center?: [number, number];
  zoom?: number;
  radiusKm: number;
  zoneOptions?: Partial<DeliveryZoneOptions>;
  addressCoordinates?: [number, number] | null;
  onZoneCheck?: (isInZone: boolean) => void;
}

interface UseMapReturn {
  mapRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  error: string | null;
  isAddressInZone: boolean | null;
}

const KAD_POLYLINE_OPTIONS = {
  strokeColor: '#ff0000',
  strokeWidth: 3,
  strokeOpacity: 0.8,
};

export function useMap({
  center = KAD_CENTER,
  zoom = 8,
  radiusKm,
  zoneOptions,
  addressCoordinates,
  onZoneCheck,
}: UseMapOptions): UseMapReturn {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ymaps.Map | null>(null);
  const kadPolylineRef = useRef<ymaps.Polyline | null>(null);
  const deliveryZoneRef = useRef<ymaps.Polygon | null>(null);
  const addressPlacemarkRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddressInZone, setIsAddressInZone] = useState<boolean | null>(null);

  const { isReady, error: ymapsError } = useYandexMaps();

  const zoneOptionsMemo = useMemo(
    () => ({ ...DEFAULT_ZONE_OPTIONS, ...zoneOptions }),
    [zoneOptions]
  );

  const createKADPolyline = useCallback(
    (map: any) => {
      if (KAD_COORDINATES.length === 0) return null;

      const polyline = new (window.ymaps as any).Polyline(
        KAD_COORDINATES,
        KAD_POLYLINE_OPTIONS
      );
      map.geoObjects.add(polyline);
      return polyline;
    },
    []
  );

  const createDeliveryZone = useCallback(
    (map: any, radius: number, options: DeliveryZoneOptions) => {
      const polygonCoords = createDeliveryZoneBuffer(radius);
      if (!polygonCoords) return null;

      const polygon = new (window.ymaps as any).Polygon([polygonCoords], {
        fillColor: options.fillColor,
        fillOpacity: options.fillOpacity,
        strokeColor: options.strokeColor,
        strokeWidth: options.strokeWidth,
      });

      map.geoObjects.add(polygon);
      return polygon;
    },
    []
  );

  useEffect(() => {
    if (!isReady || !mapRef.current) {
      if (ymapsError) {
        setError(ymapsError);
        setIsLoading(false);
      }
      return;
    }

    if (!window.ymaps) {
      setError('Скрипт Яндекс Карт не загружен');
      setIsLoading(false);
      return;
    }

    const initializeMap = () => {
      if (!mapRef.current || !window.ymaps) return;

      try {
        const map = new (window.ymaps as any).Map(mapRef.current, {
          center,
          zoom,
        });

        mapInstanceRef.current = map;

        if (KAD_COORDINATES.length > 0) {
          const polyline = createKADPolyline(map);
          if (polyline) {
            kadPolylineRef.current = polyline;
          }

          const zone = createDeliveryZone(map, radiusKm, zoneOptionsMemo);
          if (zone) {
            deliveryZoneRef.current = zone;
          }
        }

        setIsLoading(false);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Ошибка при инициализации карты: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    window.ymaps.ready(initializeMap);

    return () => {
      if (addressPlacemarkRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.geoObjects.remove(addressPlacemarkRef.current);
      }
      if (deliveryZoneRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.geoObjects.remove(deliveryZoneRef.current);
      }
      if (kadPolylineRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.geoObjects.remove(kadPolylineRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [isReady, center, zoom, ymapsError, radiusKm, zoneOptionsMemo, createKADPolyline, createDeliveryZone]);

  useEffect(() => {
    if (
      !deliveryZoneRef.current ||
      !mapInstanceRef.current ||
      KAD_COORDINATES.length === 0 ||
      radiusKm <= 0 ||
      !isReady
    ) {
      return;
    }

    const polygonCoords = createDeliveryZoneBuffer(radiusKm);
    if (polygonCoords) {
      deliveryZoneRef.current.geometry.setCoordinates([polygonCoords]);
    }
  }, [radiusKm, isReady]);

  useEffect(() => {
    if (!deliveryZoneRef.current || !zoneOptions || !isReady) {
      return;
    }

    deliveryZoneRef.current.options.set({
      fillColor: zoneOptionsMemo.fillColor,
      fillOpacity: zoneOptionsMemo.fillOpacity,
      strokeColor: zoneOptionsMemo.strokeColor,
      strokeWidth: zoneOptionsMemo.strokeWidth,
    });
  }, [zoneOptions, isReady, zoneOptionsMemo]);

  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !window.ymaps) {
      return;
    }

    if (addressPlacemarkRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.geoObjects.remove(addressPlacemarkRef.current);
      addressPlacemarkRef.current = null;
    }

    if (!addressCoordinates) {
      setIsAddressInZone(null);
      onZoneCheck?.(false);
      return;
    }

    try {
      const isInZone = checkPointInZone(addressCoordinates, radiusKm);
      setIsAddressInZone(isInZone);
      onZoneCheck?.(isInZone);

      const placemarkCoords: [number, number] = [
        addressCoordinates[1],
        addressCoordinates[0],
      ];

      const placemark = new (window.ymaps as any).Placemark(
        placemarkCoords,
        {
          balloonContent: 'Выбранный адрес',
        },
        {
          preset: isInZone
            ? 'islands#greenCircleIcon'
            : 'islands#redCircleIcon',
        }
      );

      mapInstanceRef.current.geoObjects.add(placemark);
      addressPlacemarkRef.current = placemark;
      mapInstanceRef.current.setCenter(placemarkCoords);
    } catch (err) {
      // Silent error handling
    }
  }, [addressCoordinates, isReady, radiusKm, onZoneCheck]);

  return { mapRef, isLoading, error, isAddressInZone };
}
