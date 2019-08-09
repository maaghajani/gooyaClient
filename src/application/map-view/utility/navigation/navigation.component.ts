import { state, style, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { toStringXY } from 'ol/coordinate.js';
import Map from 'ol/Map';
import View from 'ol/View';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { IranBoundryService } from './../../../shared/services/iranBoundry.service';
import { BaseMapComponent } from './../../base-map/base-map.component';
import { MiniMapComponent } from './../../controller/mini-map/mini-map.component';
import { LableComponent } from './lable/lable.component';
import { OddEvenComponent } from './odd-even/odd-even.component';
import { SwitchPoiComponent } from './switch-poi/switch-poi.component';
import { TerrainComponent } from './terrain/terrain.component';
import { TrafficAreaComponent } from './traffic-area/traffic-area.component';
import { TrafficComponent } from './traffic/traffic.component';
import { YourPlacesComponent } from './your-places/your-places.component';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          animation: 'slide-left 0.5s ease-in-out both'
        })
      ),
      state(
        'close',
        style({
          animation: 'slide-right 0.5s ease-in-out both'
        })
      )
    ])
  ]
})
export class NavigationComponent implements OnInit {
  zoom: number;
  lat: number = 31;
  long: number = 53;
  @ViewChild(YourPlacesComponent) yourPlace: YourPlacesComponent;
  // share function in other component
  constructor(
    public mapservice: MapService,
    public publicVar: PublicVarService,
    private baseMap: BaseMapComponent,
    private terrain: TerrainComponent,
    private traffic: TrafficComponent,
    public miniMap: MiniMapComponent,
    private trafficArea: TrafficAreaComponent,
    private oddEven: OddEvenComponent,
    private lable: LableComponent,
    private switchPOI: SwitchPoiComponent,
    private IranBoundry: IranBoundryService
  ) {}
  ngOnInit() {
    this.switchPOI.switchPOI();
    this.lable.switchLable();
    this.traffic.switchTraffic();
    this.trafficArea.switchTrafficArea();
    this.oddEven.switchOddEven();
    this.terrain.switchTerrain();
  }

  closeNavigation() {
    this.publicVar.isOpenNavigation = false;
    document.getElementById('dis').style.display = 'none';
    setTimeout(() => {
      document.getElementById('navigation').style.display = 'none';
      document.getElementById('rout').style.zIndex = '1';
      document.getElementById('more').style.zIndex = '-1000';
    }, this.publicVar.timeUtility);
  }

  // --- Add Missing Place ----
  addMissingPlace() {
    this.closeNavigation();
    document.getElementById('missing-place-box').style.display = 'block';
    (document.getElementById('category') as HTMLSelectElement).selectedIndex = 0;
    // ----when open missing place, your place should be closed ----
    this.yourPlace.closePlaces();
  }
  toggleMissingPlace() {
    this.publicVar.isOpenMissingPlace = true;
  }
  addMissingMap() {
    const extentBaseMap = this.mapservice.map.getView().calculateExtent(this.mapservice.map.getSize());
    const inside = require('point-in-polygon');
    if (!this.publicVar.isAddmissingMap) {
      this.publicVar.isAddmissingMap = true;
      const centerBaseMap = this.mapservice.map.getView().getCenter();
      console.log(extentBaseMap);
      this.publicVar.missingMap = new Map({
        target: 'missing-map',
        view: new View({
          projection: this.mapservice.project,
          center: [centerBaseMap[0], centerBaseMap[1]],
          zoom: this.mapservice.map.getView().getZoom(),
          extent: [4786738, 2875744, 7013127, 4721671]
        }),
        layers: [this.publicVar.AreaLAyer, this.publicVar.MapLayer],
        controls: []
      });
    }
    this.publicVar.missingMap.getView().fit([extentBaseMap[0], extentBaseMap[1], extentBaseMap[2], extentBaseMap[3]]);
    // ---- for set address valu-e  ---
    const addressValue = this.publicVar.missingMap.getView().getCenter();
    const StringAddressValue = toStringXY(addressValue, 0);
    (document.getElementById('missing-address') as HTMLInputElement).value = StringAddressValue;
    this.publicVar.isMisingMapInIran = inside(addressValue, this.IranBoundry.Iran);
    // ---- for set address value  ----
  }
  // --- Add Missing Place ----

  // -- open places component and close other component
  openPlaces() {
    document.getElementById('places').style.display = 'block';
    this.closeNavigation();
    this.noneDisabled();
    this.baseMap.closeOtherElement();
    this.publicVar.isOpenPlaces = true;
  }
  // -- open places component and close other component

  // -- Change Map ----
  changeMap() {
    if (!this.publicVar.isMap) {
      this.miniMap.changeMap();
      this.closeNavigation();
      this.noneDisabled();
    }
  }
  changeSatellite() {
    if (this.publicVar.isMap) {
      this.miniMap.changeMap();
      this.closeNavigation();
      this.noneDisabled();
    }
  }

  showAboutUs() {
    this.publicVar.isOpenAboutUs = true;
    document.getElementById('about-us-box').style.display = 'block';
    this.closeNavigation();
  }
  // ---- dis ----
  noneDisabled() {
    document.getElementById('dis').style.display = 'none';
  }
  noneMenuDir() {
    document.getElementById('navigation').style.display = 'none';
    document.getElementById('rout').style.zIndex = '1';
  }
  // ---- dis ----
}
