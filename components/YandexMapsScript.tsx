'use client';

import Script from 'next/script';
import { useEffect, useState, useMemo, useCallback } from 'react';

export default function YandexMapsScript(): React.ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const apiKey = useMemo(
    () => process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
    []
  );
  const exist = apiKey !== '' && apiKey !== 'undefined';

  const scriptSrc = useMemo(
    () =>
      `https://api-maps.yandex.ru/2.1.79/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`,
    [apiKey]
  );

  const handleLoad = useCallback((): void => {
    if (typeof window !== 'undefined' && window.ymaps) {
      window.ymaps.ready(() => {
        (window as Window & { __YMAPS_READY__?: boolean }).__YMAPS_READY__ = true;
      });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!exist || !mounted) {
    return null;
  }

  return (
    <Script
      id="yandex-maps-script"
      src={scriptSrc}
      onLoad={handleLoad}
    />
  );
}

