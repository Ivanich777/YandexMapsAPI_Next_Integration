/**
 * Утилиты для работы с Яндекс Картами
 */

/**
 * Настройки зоны доставки (полигона)
 */
export interface DeliveryZoneOptions {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

/**
 * Опции зоны доставки по умолчанию
 */
export const DEFAULT_ZONE_OPTIONS: DeliveryZoneOptions = {
  fillColor: '#3b82f6',
  fillOpacity: 0.3,
  strokeColor: '#2563eb',
  strokeWidth: 2,
};

