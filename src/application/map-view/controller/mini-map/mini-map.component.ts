import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-mini-map',
  template: '<button class="mini-map" id="mini-map" (click)="changeMap()"></button>',
  styleUrls: ['./mini-map.component.scss']
})
export class MiniMapComponent implements OnInit {
  centerBaseMap: Array<number>;
  zoomBaseMap: number;

  constructor(private mapservice: MapService, public publicVar: PublicVarService) {}

  ngOnInit() {
    this.addminiMap();
  }
  addminiMap() {
    // ---- create new Map ----
    this.publicVar.miniMap = new Map({
      view: new View({
        projection: this.mapservice.project,
        center: [this.mapservice.centerX, this.mapservice.centerY],
        zoom: this.mapservice.zoom
      }),
      layers: [this.publicVar.SatelliteLayer],
      interactions: [],
      target: 'mini-map'
    });

    // ---- get base mp extent and set in minimap ----
    this.mapservice.map.on('moveend', (evt: Event) => {
      this.centerBaseMap = this.mapservice.map.getView().calculateExtent(this.mapservice.map.getSize());
      this.publicVar.miniMap
        .getView()
        .fit([this.centerBaseMap[0], this.centerBaseMap[1], this.centerBaseMap[2], this.centerBaseMap[3]]);
    });
  }

  changeMap() {
    if (this.publicVar.isMiniMapSatellite) {
      this.mapservice.map.removeLayer(this.publicVar.MapLayer);
      // ---if dont remove this layer ,when change map this layer stay on map ----
      this.mapservice.map.removeLayer(this.publicVar.poiLayer);
      this.mapservice.map.removeLayer(this.publicVar.terrianLayer);
      this.mapservice.map.addLayer(this.publicVar.SatelliteLayer);
      // ----mini map----
      this.publicVar.miniMap.removeLayer(this.publicVar.SatelliteLayer);
      this.publicVar.miniMap.addLayer(this.publicVar.MapLayer);
      this.publicVar.isMiniMapSatellite = false;
      this.publicVar.isMap = false;
    } else {
      this.mapservice.map.addLayer(this.publicVar.MapLayer);
      this.mapservice.map.addLayer(this.publicVar.poiLayer);
      this.mapservice.map.addLayer(this.publicVar.terrianLayer);
      this.mapservice.map.removeLayer(this.publicVar.SatelliteLayer);
      // ----mini map----
      this.publicVar.miniMap.addLayer(this.publicVar.SatelliteLayer);
      this.publicVar.miniMap.removeLayer(this.publicVar.MapLayer);
      this.publicVar.isMiniMapSatellite = true;
      this.publicVar.isMap = true;
    }
  }
}
