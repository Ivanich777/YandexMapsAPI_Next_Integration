import { useEffect, useState } from 'react';

interface UseYandexMapsReturn {
  isLoaded: boolean;
  isReady: boolean;
  error: string | null;
}

const CHECK_INTERVAL = 100;
const MAX_ATTEMPTS = 100;

export function useYandexMaps(): UseYandexMapsReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.ymaps && window.ymaps.ready) {
      setIsLoaded(true);
      window.ymaps.ready(() => {
        setIsReady(true);
      });
      return;
    }

    if (window.__YMAPS_READY__) {
      const checkReady = setInterval(() => {
        if (window.ymaps && window.ymaps.ready) {
          clearInterval(checkReady);
          setIsLoaded(true);
          window.ymaps.ready(() => {
            setIsReady(true);
          });
        }
      }, CHECK_INTERVAL / 2);

      return () => clearInterval(checkReady);
    }

    let attempts = 0;

    const checkYmaps = setInterval(() => {
      attempts++;

      if (window.ymaps && window.ymaps.ready) {
        clearInterval(checkYmaps);
        setIsLoaded(true);
        window.ymaps.ready(() => {
          setIsReady(true);
        });
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(checkYmaps);
        setError('Таймаут загрузки Яндекс Карт. Проверьте подключение скрипта.');
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(checkYmaps);
  }, []);

  return { isLoaded, isReady, error };
}

