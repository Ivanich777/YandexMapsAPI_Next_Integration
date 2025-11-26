/**
 * Парсинг координат КАДа из URL Яндекс Карт
 * 
 * Формат URL: rl=startLng,startLat~deltaLng1,deltaLat1~deltaLng2,deltaLat2...
 * где первая точка - абсолютные координаты, остальные - относительные смещения
 */

export function parseKADCoordinatesFromURL(
  rlString: string
): [number, number][] {
  const parts = rlString.split('~');

  if (parts.length === 0) {
    throw new Error('Empty coordinates string');
  }

  const firstPoint = parts[0].split(',');
  if (firstPoint.length !== 2) {
    throw new Error(`Invalid first point format: ${parts[0]}`);
  }

  let currentLng = parseFloat(firstPoint[0]);
  let currentLat = parseFloat(firstPoint[1]);

  if (isNaN(currentLng) || isNaN(currentLat)) {
    throw new Error(`Invalid first point values: ${parts[0]}`);
  }

  const coordinates: [number, number][] = [[currentLat, currentLng]];

  for (let i = 1; i < parts.length; i++) {
    const delta = parts[i].split(',');
    if (delta.length !== 2) {
      continue;
    }

    const deltaLng = parseFloat(delta[0]);
    const deltaLat = parseFloat(delta[1]);

    if (isNaN(deltaLng) || isNaN(deltaLat)) {
      continue;
    }

    currentLng += deltaLng;
    currentLat += deltaLat;

    coordinates.push([currentLat, currentLng]);
  }

  return coordinates;
}

export function parseKADCoordinatesFromFullURL(
  url: string
): [number, number][] {
  let rlString = url;

  if (url.includes('rl=')) {
    const rlMatch = url.match(/rl=([^&]+)/);
    if (!rlMatch || !rlMatch[1]) {
      throw new Error('Parameter rl not found in URL');
    }
    rlString = decodeURIComponent(rlMatch[1]);
  }

  return parseKADCoordinatesFromURL(rlString);
}



// const KAD_URL_1 = 'https://yandex.ru/maps/2/saint-petersburg/geo/kad/8066126/?ll=29.835490%2C59.898416&rl=29.688385%2C59.984650~-0.025369%2C-0.064075~-0.004530%2C-0.010464~0.002718%2C-0.010922~0.008154%2C-0.006373~0.011778%2C-0.005464~0.020839%2C-0.006375~0.037147%2C-0.008199~0.014497%2C-0.003644~0.024463%2C-0.000911~0.019027%2C-0.005923~0.009966%2C-0.008659~0.004530%2C-0.010029~0.009060~0.012312%2C0.015403~0.009579%2C0.016309~0.007757%2C0.030805~0.003195%2C0.027181%2C0.000913%2C0.049432%2C0.009506%2C0.020507%2C0.001589%2C0.014197~0.002780%2C0.018930~0.002780%2C0.018930~0.000794%2C0.049691%2C0.000000%2C0.028395~0.001589%2C0.016564~0.005562%2C0.020507~0.006358%2C0.007099~0.001987%2C0.016564%2C0.001192%2C0.007849%2C0.005354%2C0.009270%2C0.002854%2C0.012445%2C0.002464%2C0.018037%2C0.008403%2C0.015212%2C0.004928%2C0.025386%2C0.005822%2C0.015514%2C0.002698~0.007898~0.001420%2C0.003103~0.002130%2C0.013821~0.008521%2C0.012975~0.006250%2C0.007616~0.004688%2C0.011001~0.001137%2C0.010154%2C0.000852%2C0.016360%2C0.003836%2C0.008462%2C0.000000%2C0.016360%2C0.001136%2C0.019181%2C0.001847%2C0.028771%2C0.006392%2C0.011847%2C0.006674%2C0.014103%2C0.011216&z=10';

// const KAD_URL_2 = 'https://yandex.ru/maps/2/saint-petersburg/geo/kad/8066126/?ll=30.385148%2C60.090163&rl=30.458508%2C59.846114~0.008068%2C0.003800~0.012789%2C0.003505~0.012016%2C0.000561~0.012927%2C0.000727~0.023589%2C0.010891~0.003667%2C0.005512~-0.001078%2C0.004651~-0.005755%2C0.011274~-0.000944%2C0.005262~0.000916%2C0.005000~0.001321%2C0.003636~-0.000448%2C0.015485~0.005159%2C0.009006~0.007038%2C0.008293~0.002055%2C0.009673~0.002775%2C0.005155~0.005665%2C0.005532~0.004811%2C0.005445~0.000992%2C0.004462~-0.001755%2C0.003485~-0.005874%2C0.004725~-0.008883%2C0.003219~-0.015026%2C0.004625~-0.005815%2C0.001144~-0.016861%2C0.002024~-0.009263%2C0.003140~-0.007602%2C0.004258~-0.005248%2C0.005260~-0.001514%2C0.004773~0.000127%2C0.006030~-0.001891%2C0.003376~-0.003781%2C0.003340~-0.004626%2C0.002379~-0.008669%2C0.003393~-0.007511%2C0.006527~-0.006005%2C0.005966~-0.003532%2C0.004569~-0.001463%2C0.003724~-0.003785%2C0.003505~-0.005601%2C0.002534~-0.015462%2C0.004087~-0.016998%2C0.004785~-0.006687%2C0.003853~-0.004645%2C0.005897~-0.003662%2C0.008039~-0.002033%2C0.006185~-0.002251%2C0.006087~-0.002711%2C0.003012~-0.008054%2C0.004047&z=15.27';

// const KAD_URL_3 = 'https://yandex.ru/maps/2/saint-petersburg/geo/kad/8066126/?ll=29.864479%2C59.957238&rl=30.358879%2C60.093741~-0.009230%2C0.000848~-0.024748%2C0.000671~-0.006504%2C0.000357~-0.010323%2C0.001060~-0.014110%2C0.002067~-0.006024%2C0.000447~-0.007687%2C0.000141~-0.009690%2C-0.000669~-0.010913%2C-0.001800~-0.009095%2C-0.002685~-0.011047%2C-0.004826~-0.009014%2C-0.002725~-0.009499%2C-0.001954~-0.012069%2C-0.001052~-0.011186%2C-0.001490~-0.007057%2C-0.002059~-0.007710%2C-0.003437~-0.006181%2C-0.004501~-0.006375%2C-0.004490~-0.013001%2C-0.005805~-0.009518%2C-0.002416~-0.034096%2C-0.004665~-0.030558%2C-0.004069~-0.084899%2C-0.011685~-0.023679%2C-0.000030~-0.068863%2C-0.006186~-0.116685%2C-0.010956~-0.054552%2C-0.001488~-0.013060%2C-0.005005~-0.019024%2C-0.014115~-0.006373%2C-0.007624&z=11.8';

/**
 * Парсер координат из URL Яндекс Карт
 * Оставляем на случай расширения функционала
 */

// const KAD_COORDINATES_MOCK: [number, number][] = (() => {
//   try {
//     const coords1 = parseKADCoordinatesFromFullURL(KAD_URL_1);
//     const coords2 = parseKADCoordinatesFromFullURL(KAD_URL_2);
//     const coords3 = parseKADCoordinatesFromFullURL(KAD_URL_3);
//     const first50 = coords1.slice(0, 50);
//     const next50 = coords2.slice(0, 50);
//     const lastPoints = coords3;
//     const allCoords = [...first50, ...next50, ...lastPoints];
//     if (allCoords.length > 0) {
//       allCoords.push(allCoords[0]);
//     }
//     return allCoords;
//   } catch {
//     return [];
//   }
// })();
