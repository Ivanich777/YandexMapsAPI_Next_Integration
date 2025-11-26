'use client';

import Script from 'next/script';

/**
 * Компонент для загрузки скрипта Яндекс Карт
 */
export default function YandexMapsScript(): React.ReactElement | null {
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';
  const exist = apiKey !== '' && apiKey !== 'undefined';

  if (!exist) {
    return null;
  }

  const handleLoad = (): void => {
    console.log('✅ Yandex Maps script loaded successfully');
    
    if (typeof window !== 'undefined' && window.ymaps) {
      window.ymaps.ready(() => {
        console.log('✅ Yandex Maps ready');
        window.__YMAPS_READY__ = true;
      });
    }
  };

  const handleError = (e: Error): void => {
    console.error('❌ Yandex Maps script load error:', e);
    console.error('Check API key and network connection');
  };

  return (
    <Script
      id="yandex-maps-script"
      src={`https://api-maps.yandex.ru/2.1.79/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}

