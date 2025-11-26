import * as turf from '@turf/turf';
import { KAD_COORDINATES } from './kad-coordinates';

const BUFFER_STEPS = 128;

export function createDeliveryZoneBuffer(radiusKm: number): number[][] | null {
  if (KAD_COORDINATES.length === 0) {
    return null;
  }

  try {
    const lineString = turf.lineString(
      KAD_COORDINATES.map((coord) => [coord[1], coord[0]])
    );

    const buffer = turf.buffer(lineString, radiusKm, {
      units: 'kilometers',
      steps: BUFFER_STEPS,
    });

    if (!buffer?.geometry) {
      return null;
    }

    const bufferCoordinates = (
      buffer.geometry as { type: string; coordinates: number[][][] }
    ).coordinates[0];

    return bufferCoordinates.map((coord: number[]) => [coord[1], coord[0]]);
  } catch {
    return null;
  }
}

export function checkPointInZone(
  coordinates: [number, number],
  radiusKm: number
): boolean {
  if (KAD_COORDINATES.length === 0) {
    return false;
  }

  try {
    const lineString = turf.lineString(
      KAD_COORDINATES.map((coord) => [coord[1], coord[0]])
    );

    const buffer = turf.buffer(lineString, radiusKm, {
      units: 'kilometers',
      steps: BUFFER_STEPS,
    });

    if (!buffer?.geometry) {
      return false;
    }

    const point = turf.point([coordinates[1], coordinates[0]]);
    return turf.booleanPointInPolygon(point, buffer);
  } catch {
    return false;
  }
}

