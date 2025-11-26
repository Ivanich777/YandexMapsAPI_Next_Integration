/**
 * Парсинг координат КАДа из URL Яндекс Карт
 * 
 * Формат URL: rl=startLng,startLat~deltaLng1,deltaLat1~deltaLng2,deltaLat2...
 * где первая точка - абсолютные координаты, остальные - относительные смещения
 */

/**
 * Парсит координаты КАДа из параметра rl в URL Яндекс Карт
 * @param rlString - строка параметра rl из URL (например: "29.688385,59.984650~-0.025369,-0.064075~...")
 * @returns массив координат в формате [широта, долгота][]
 */
export function parseKADCoordinatesFromURL(rlString: string): [number, number][] {
  // Разделяем по ~
  const parts = rlString.split('~');
  
  if (parts.length === 0) {
    throw new Error('Empty coordinates string');
  }

  // Первая точка - абсолютные координаты [долгота, широта]
  const firstPoint = parts[0].split(',');
  if (firstPoint.length !== 2) {
    throw new Error(`Invalid first point format: ${parts[0]}`);
  }

  let currentLng = parseFloat(firstPoint[0]);
  let currentLat = parseFloat(firstPoint[1]);

  if (isNaN(currentLng) || isNaN(currentLat)) {
    throw new Error(`Invalid first point values: ${parts[0]}`);
  }

  const coordinates: [number, number][] = [
    [currentLat, currentLng] // Конвертируем в [широта, долгота]
  ];

  // Обрабатываем остальные точки как относительные смещения
  for (let i = 1; i < parts.length; i++) {
    const delta = parts[i].split(',');
    if (delta.length !== 2) {
      console.warn(`Skipping invalid delta at index ${i}: ${parts[i]}`);
      continue;
    }

    const deltaLng = parseFloat(delta[0]);
    const deltaLat = parseFloat(delta[1]);

    if (isNaN(deltaLng) || isNaN(deltaLat)) {
      console.warn(`Skipping invalid delta values at index ${i}: ${parts[i]}`);
      continue;
    }

    // Добавляем смещение к текущим координатам
    currentLng += deltaLng;
    currentLat += deltaLat;

    // Сохраняем в формате [широта, долгота]
    coordinates.push([currentLat, currentLng]);
  }

  return coordinates;
}

/**
 * Парсит координаты КАДа из полного URL Яндекс Карт
 * @param url - полный URL или только параметр rl
 * @returns массив координат в формате [широта, долгота][]
 */
export function parseKADCoordinatesFromFullURL(url: string): [number, number][] {
  // Если это полный URL, извлекаем параметр rl
  let rlString = url;
  
  if (url.includes('rl=')) {
    const rlMatch = url.match(/rl=([^&]+)/);
    if (!rlMatch || !rlMatch[1]) {
      throw new Error('Parameter rl not found in URL');
    }
    // Декодируем URL-кодированные символы (%2C -> , и т.д.)
    rlString = decodeURIComponent(rlMatch[1]);
  }

  return parseKADCoordinatesFromURL(rlString);
}

