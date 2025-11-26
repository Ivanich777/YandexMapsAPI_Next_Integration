/**
 * Типы для Яндекс Карт API 2.1.79
 */

declare namespace ymaps {
  interface Map {
    geoObjects: GeoObjectCollection;
    setCenter(center: number[], zoom?: number, duration?: number): void;
    setZoom(zoom: number, duration?: number): void;
    getCenter(): number[];
    getZoom(): number;
    destroy(): void;
    events: EventManager;
  }

  interface GeoObjectCollection {
    add(geoObject: GeoObject): void;
    remove(geoObject: GeoObject): void;
    removeAll(): void;
    getLength(): number;
  }

  interface GeoObject {
    options: IOptionManager;
    geometry: IGeometry;
    events: EventManager;
  }

  interface Circle extends GeoObject {
    geometry: {
      setRadius(radius: number): void;
      getRadius(): number;
      getBounds(): number[][];
    };
  }

  interface Polygon extends GeoObject {
    geometry: {
      setCoordinates(coordinates: number[][][]): void;
      getCoordinates(): number[][][];
      getBounds(): number[][];
    };
  }

  interface Polyline extends GeoObject {
    geometry: {
      setCoordinates(coordinates: number[][]): void;
      getCoordinates(): number[][];
      getBounds(): number[][];
    };
  }

  interface IOptionManager {
    set(key: string | object, value?: any): void;
    get(key: string): any;
  }

  interface IGeometry {
    getBounds(): number[][];
    setCoordinates?(coordinates: any): void;
    getCoordinates?(): any;
  }

  interface EventManager {
    add(type: string, handler: Function): void;
    remove(type: string, handler: Function): void;
  }

  function ready(callback: () => void): void;
  function Map(container: string | HTMLElement, options?: MapOptions): Map;
  function Circle(geometry: [number[], number], options?: CircleOptions): Circle;
  function Polygon(geometry: number[][][], options?: PolygonOptions): Polygon;
  function Polyline(geometry: number[][], options?: PolylineOptions): Polyline;
  function GeoObjectCollection(): GeoObjectCollection;
}

interface MapOptions {
  center?: number[];
  zoom?: number;
  controls?: string[];
  behaviors?: string[];
}

interface CircleOptions {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  cursor?: string;
}

interface PolygonOptions {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  cursor?: string;
}

interface PolylineOptions {
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  cursor?: string;
}

declare global {
  interface Window {
    ymaps: typeof ymaps;
    __YMAPS_READY__?: boolean;
  }
}
