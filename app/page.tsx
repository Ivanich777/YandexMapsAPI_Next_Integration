'use client';

import { useState } from 'react';
import YandexMap from '@/components/YandexMap';
import DistanceInput from '@/components/DistanceInput';

export default function Home() {
  const [radiusKm, setRadiusKm] = useState(25);

  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Зона доставки БЛГ от КАДа
        </h1>

        <div className="mb-6 flex justify-center">
          <DistanceInput
            value={radiusKm}
            onChange={setRadiusKm}
            min={25}
            max={200}
            step={0.5}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          {apiKey ? (
            <YandexMap
              radiusKm={radiusKm}
              className="w-full"
            />
          ) : (
            <div className="min-h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  API ключ не найден
                </p>
                <p className="text-gray-600">
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
