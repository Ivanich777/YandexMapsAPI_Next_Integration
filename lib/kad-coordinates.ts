import { KAD_COORDINATES } from "./mocks/kad-coordinates-mocks";

export { KAD_COORDINATES };

function calculateKADCenter(): [number, number] {
  if (KAD_COORDINATES.length === 0) {
    return [59.9343, 30.3351];
  }

  const sumLat = KAD_COORDINATES.reduce((sum, coord) => sum + coord[0], 0);
  const sumLng = KAD_COORDINATES.reduce((sum, coord) => sum + coord[1], 0);

  return [sumLat / KAD_COORDINATES.length, sumLng / KAD_COORDINATES.length];
}

export const KAD_CENTER: [number, number] = calculateKADCenter();

export function kilometersToMeters(km: number): number {
  return km * 1000;
}

export function metersToKilometers(m: number): number {
  return m / 1000;
}
