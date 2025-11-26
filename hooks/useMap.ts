import { useEffect, useRef, useState } from 'react';
import { KAD_CENTER, KAD_COORDINATES } from '@/lib/kad-coordinates';
import { DEFAULT_ZONE_OPTIONS, type DeliveryZoneOptions } from '@/lib/yandex-maps';
import { useYandexMaps } from './useYandexMaps';
import * as turf from '@turf/turf';

interface UseMapOptions {
  center?: [number, number];
  zoom?: number;
  radiusKm: number;
  zoneOptions?: Partial<DeliveryZoneOptions>;
}

interface UseMapReturn {
  mapRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Хук для управления картой и зоной доставки
 */
export function useMap({
  center = KAD_CENTER,
  zoom = 10,
  radiusKm,
  zoneOptions,
}: UseMapOptions): UseMapReturn {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ymaps.Map | null>(null);
  const kadPolylineRef = useRef<ymaps.Polyline | null>(null);
  const deliveryZoneRef = useRef<ymaps.Polygon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isReady, error: ymapsError } = useYandexMaps();

  // Инициализация карты
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
        // Создаем карту
        const map = new (window.ymaps as any).Map(mapRef.current, {
          center,
          zoom,
        });

        mapInstanceRef.current = map;

        // Отображаем КАД линией (полилиния)
        if (KAD_COORDINATES.length > 0) {
          const kadPolyline = new (window.ymaps as any).Polyline(
            KAD_COORDINATES,
            {
              strokeColor: '#ff0000',
              strokeWidth: 3,
              strokeOpacity: 0.8,
            }
          );
          map.geoObjects.add(kadPolyline);
          kadPolylineRef.current = kadPolyline;

          // Создаем буферную зону доставки вокруг КАДа
          try {
            // Конвертируем координаты КАДа в формат GeoJSON LineString
            // Turf.js использует формат [долгота, широта]
            const lineString = turf.lineString(
              KAD_COORDINATES.map(coord => [coord[1], coord[0]]) // [lng, lat] для GeoJSON
            );

            // Создаем буферную зону (buffer принимает расстояние в километрах)
            // Увеличиваем точность буфера с помощью параметра steps (больше точек = более точный буфер)
            const buffer = turf.buffer(lineString, radiusKm, {
              units: 'kilometers',
              steps: 128 // Увеличиваем количество шагов для более точного буфера (по умолчанию 64)
            });

            if (!buffer || !buffer.geometry) {
              throw new Error('Failed to create buffer zone');
            }

            // Извлекаем координаты полигона
            const bufferCoordinates = (buffer.geometry as { type: string; coordinates: number[][][] }).coordinates[0];

            // Конвертируем обратно в формат Яндекс Карт [широта, долгота]
            const polygonCoords = bufferCoordinates.map((coord: number[]) => [coord[1], coord[0]]);

            const options = { ...DEFAULT_ZONE_OPTIONS, ...zoneOptions };

            // Создаем полигон зоны доставки
            const deliveryZone = new (window.ymaps as any).Polygon(
              [polygonCoords],
              {
                fillColor: options.fillColor,
                fillOpacity: options.fillOpacity,
                strokeColor: options.strokeColor,
                strokeWidth: options.strokeWidth,
              }
            );

            map.geoObjects.add(deliveryZone);
            deliveryZoneRef.current = deliveryZone;
          } catch (err) {
            console.error('Error creating delivery zone:', err);
          }
        }

        setIsLoading(false);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Ошибка при инициализации карты: ${errorMessage}`);
        setIsLoading(false);
        console.error('Yandex Maps initialization error:', err);
      }
    };

    window.ymaps.ready(initializeMap);

    // Очистка при размонтировании
    return () => {
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
  }, [isReady, center, zoom, ymapsError]);

  // Обновление зоны доставки при изменении радиуса
  useEffect(() => {
    if (deliveryZoneRef.current && mapInstanceRef.current && KAD_COORDINATES.length > 0 && radiusKm > 0 && isReady) {
      try {
        // Пересоздаем буферную зону с новым радиусом
        const lineString = turf.lineString(
          KAD_COORDINATES.map(coord => [coord[1], coord[0]])
        );
        const buffer = turf.buffer(lineString, radiusKm, {
          units: 'kilometers',
          steps: 128 // Увеличиваем количество шагов для более точного буфера
        });

        if (!buffer || !buffer.geometry) {
          console.error('Failed to create buffer zone');
          return;
        }

        const bufferCoordinates = (buffer.geometry as { type: string; coordinates: number[][][] }).coordinates[0];
        const polygonCoords = bufferCoordinates.map((coord: number[]) => [coord[1], coord[0]]);
        deliveryZoneRef.current.geometry.setCoordinates([polygonCoords]);
      } catch (err) {
        console.error('Error updating delivery zone:', err);
      }
    }
  }, [radiusKm, isReady]);

  // Обновление опций зоны доставки
  useEffect(() => {
    if (deliveryZoneRef.current && zoneOptions && isReady) {
      const options = { ...DEFAULT_ZONE_OPTIONS, ...zoneOptions };
      deliveryZoneRef.current.options.set({
        fillColor: options.fillColor,
        fillOpacity: options.fillOpacity,
        strokeColor: options.strokeColor,
        strokeWidth: options.strokeWidth,
      });
    }
  }, [zoneOptions, isReady]);

  return { mapRef, isLoading, error };
}

