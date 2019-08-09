import Map from 'ol/Map';
import { Injectable } from '@angular/core';

@Injectable()
export class MapService {
  map: Map = new Map({
    // to set coustom control(zoom)
    controls: []
  });
  project = 'EPSG:3857';
  centerX: number = 6066912.25;
  centerY: number = 3763320.63;
  zoom: number = 5.45;
  minZoom: number = 5.45;
  maxZoom: number = 18;
}
