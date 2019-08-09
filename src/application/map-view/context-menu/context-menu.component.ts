import { Component, OnInit } from '@angular/core';
import { toStringXY } from 'ol/coordinate.js';
import Map from 'ol/Map';
import { transform } from 'ol/proj.js';
import View from 'ol/View';
import { IranBoundryService } from 'src/application/shared/services/iranBoundry.service';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { BaseMapComponent } from '../base-map/base-map.component';
import { DirectionComponent } from '../utility/direction/direction.component';
import { NavigationComponent } from './../utility/navigation/navigation.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  clickCoord: Array<number>;
  zoom: number;
  constructor(
    public mapservice: MapService,
    public publicVar: PublicVarService,
    public IranBoundry: IranBoundryService,
    private direction: DirectionComponent,
    private baseMap: BaseMapComponent,
    private navigation: NavigationComponent,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    window.addEventListener('DOMContentLoaded', e => {
      this.contextMenu();
      this.getCenterZoom();
    });
  }
  // ---- creat custom right Click ----
  contextMenu() {
    // ---- prevent right click in body ---
    window.addEventListener('contextmenu', e => {
      e.preventDefault();
    });
    const menu = document.getElementById('menu');
    const menuPos = document.getElementById('context-menu');
    const basemap = document.getElementById('base-map');
    let menuVisible = false;
    /* ---- because menu display is none, we cannot get width and height,
    so set display block and give width and height then set display none --- */
    menu.style.display = 'block';
    const widthContextMenu = menu.offsetWidth;
    const heightContextMenu = menu.offsetHeight;
    menu.style.display = 'none';

    const toggleMenu = command => {
      menu.style.display = command === 'show' ? 'flex' : 'none';
      menuVisible = !menuVisible;
    };

    const setPosition = ({ top, left }) => {
      menuPos.style.left = left + 'px';
      menuPos.style.top = top + 'px';
      toggleMenu('show');
    };

    // ----For each click in window context menu hide ----
    window.addEventListener('click', e => {
      if (menuVisible) {
        toggleMenu('hide');
      }
    });

    /* ---- because rout display is none, we cannot get width and height,
          so set display block and give width and height then set display none --- */
    document.getElementById('rout').style.display = 'block';
    const widthDir = document.getElementById('rout').offsetWidth;
    document.getElementById('rout').style.display = 'none';
    basemap.addEventListener('contextmenu', e => {
      // e.preventDefault();
      if (!this.publicVar.isOpenPlaces) {
        let browserSizeX = document.documentElement.clientWidth;
        const browserSizeY = document.documentElement.clientHeight;
        let left = e.pageX;
        let top = e.pageY;
        // ---- if direction , street , ... is open and right click ,context menu show under the direction , ....
        // so we need change browser size to resolve the problem
        if (
          this.publicVar.isOpenDirection ||
          this.publicVar.isOpenStreet ||
          this.publicVar.isOpenIntersect ||
          this.publicVar.isOpenPoi ||
          this.publicVar.isOpenCoordinate
        ) {
          browserSizeX = browserSizeX - widthDir - 1; // -1 For a better view;
        }

        if (e.pageY > browserSizeY - heightContextMenu && e.pageX > browserSizeX - widthContextMenu) {
          top = browserSizeY - heightContextMenu - 5;
          left = browserSizeX - widthContextMenu;
        } else if (e.pageX > browserSizeX - widthContextMenu) {
          left = browserSizeX - widthContextMenu;
        } else if (e.pageY > browserSizeY - heightContextMenu) {
          top = browserSizeY - heightContextMenu - 5;
        }

        const origin = {
          left: left,
          top: top
        };
        setPosition(origin);
        return false;
      }
    });
  }
  // ---- creat custom right Click ----

  // ---- get right click positon and zoom leve base map to set map center ----
  getCenterZoom() {
    this.mapservice.map.on('contextmenu', (evt: Event) => {
      this.clickCoord = (evt as any).coordinate;
      this.zoom = this.mapservice.map.getView().getZoom();
    });
  }
  // ---- get right click positon and zoom leve base map to set map center ----
  // ----Direction FromTo Here ----
  DirectionFromToHere(elemntID: string) {
    /* aval noghteh i ra k click kardim az mercator b decimal tabdil mikonin 
    bad yek darkhast az tariqi api GetMapLIDByPoint b samte server mifrestim ta nam va Lid noqteh click 
    shodeh ra b shart anke dakhel iran bashad biyabim*/
    this.direction.openDirection();
    // baraye anke click dar naghsheh kar konad
    this.direction.getClickLoctionAddress();
    const inside = require('point-in-polygon');
    const htmlElement = document.getElementById(elemntID) as HTMLInputElement;
    this.publicVar.isDirectionInIran = inside(this.clickCoord, this.IranBoundry.Iran);
    if (this.publicVar.isDirectionInIran) {
      const url =
        'http://89.32.249.124:1398/api/map/GetMapLIDByPoint?x=' + this.clickCoord[0] + '&y=' + this.clickCoord[1];
      this.httpClient
        .get(url)
        .toPromise()
        .then(data => {
          console.log(data);
          const responseJson = JSON.parse(data.toString());
          const lenResult = Object.keys(responseJson).length;
          if (lenResult > 0) {
            this.publicVar.isClickHasNetwork = true;
            this.publicVar.responseGetMapNameByPoint = responseJson[0].F_NAME;
            this.publicVar.responseGetMapLIDByPoint = responseJson[0].LID;
          } else {
            this.publicVar.isClickHasNetwork = false;
            this.publicVar.responseGetMapNameByPoint =null;
            this.publicVar.responseGetMapLIDByPoint = null;
          }
        })
        .then(() => {
          if (elemntID === 'start-point') {
            this.publicVar.startPointLocation = this.clickCoord;
            this.publicVar.startLID = this.publicVar.responseGetMapLIDByPoint;
          } else {
            this.publicVar.endPointLocation = this.clickCoord;
            this.publicVar.endLID = this.publicVar.responseGetMapLIDByPoint;
          }
          htmlElement.value = this.publicVar.responseGetMapNameByPoint;
        });
    }
  }
  // ----Direction FromTo Here ----

  // --- Add Missing Place ----
  addMissingPlace() {
    document.getElementById('missing-place-box').style.display = 'block';
    (document.getElementById('category') as HTMLSelectElement).selectedIndex = 0;
  }
  toggleMissingPlace() {
    this.publicVar.isOpenMissingPlace = true;
  }
  addMissingMap() {
    const inside = require('point-in-polygon');
    if (!this.publicVar.isAddmissingMap) {
      this.publicVar.isAddmissingMap = true;
      this.publicVar.missingMap = new Map({
        target: 'missing-map',
        view: new View({
          projection: this.mapservice.project,
          center: [this.clickCoord[0], this.clickCoord[1]],
          zoom: this.zoom,
          extent: [4786738, 2875744, 7013127, 4721671]
        }),
        layers: [this.publicVar.AreaLAyer, this.publicVar.MapLayer],
        controls: []
      });
      // ---- for set address value  ----
      const addressValue = this.publicVar.missingMap.getView().getCenter();
      const StringAddressValue = toStringXY(addressValue, 0);
      (document.getElementById('missing-address') as HTMLInputElement).value = StringAddressValue;
      this.publicVar.isMisingMapInIran = inside(addressValue, this.IranBoundry.Iran);
      // ---- for set address value  ----
    } else {
      this.publicVar.missingMap.getView().setCenter([this.clickCoord[0], this.clickCoord[1]]);
      this.publicVar.missingMap.getView().setZoom(this.zoom);
      // ---- for set address value  ----
      const addressValue = this.publicVar.missingMap.getView().getCenter();
      const StringAddressValue = toStringXY(addressValue, 0);
      (document.getElementById('missing-address') as HTMLInputElement).value = StringAddressValue;
      // ---- for set address value  ----
      this.publicVar.isMisingMapInIran = inside(addressValue, this.IranBoundry.Iran);
    }
  }
  // --- Add Missing Place ----

  // ---- SEND REPORT ----
  showReportError() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('report-error-box').style.display = 'block';
    // ---- for when box  open 'لطفا انتخاب ....'  selected
    (document.getElementById('error-type') as HTMLSelectElement).selectedIndex = 0;
  }

  // ---- this function for add map in report error ---
  // ---- if write this function in report-error component ol map dont work because report error display is none ----
  addErrorMap() {
    const inside = require('point-in-polygon');
    if (!this.publicVar.isAddErrorMap) {
      this.publicVar.isAddErrorMap = true;
      this.publicVar.errorMap = new Map({
        target: 'error-map',
        view: new View({
          projection: this.mapservice.project,
          center: [this.clickCoord[0], this.clickCoord[1]],
          zoom: this.zoom,
          extent: [4786738, 2875744, 7013127, 4721671]
        }),
        layers: [this.publicVar.AreaLAyer, this.publicVar.MapLayer],
        controls: [],
        renderer: 'canvas'
      });
      // ---- for set address value  ----
      const addressValue = this.publicVar.errorMap.getView().getCenter();
      const StringAddressValue = toStringXY(addressValue, 0);
      (document.getElementById('coordinate-error-map') as HTMLInputElement).value = StringAddressValue;
      // ---- for set address value  ----
      this.publicVar.isErrorMapInIran = inside(addressValue, this.IranBoundry.Iran);
    } else {
      this.publicVar.errorMap.getView().setCenter([this.clickCoord[0], this.clickCoord[1]]);
      this.publicVar.errorMap.getView().setZoom(this.zoom);
      // ---- for set address value  ----
      const addressValue2 = this.publicVar.errorMap.getView().getCenter();
      const StringAddressValue = toStringXY(addressValue2, 0);
      (document.getElementById('coordinate-error-map') as HTMLInputElement).value = StringAddressValue;
      // ---- for set address value  ----
      this.publicVar.isErrorMapInIran = inside(addressValue2, this.IranBoundry.Iran);
    }
  }
  // ---- this function for add map in report error ---

  // ---- for popup animation ----
  toggleErrorReport() {
    this.publicVar.isOpenReportError = true;
  }
  // ---- for popup animation ----
  // ---- SEND REPORT ----.

  // ----FavoritesPlace----
  showFavoritesPlace() {
    this.navigation.openPlaces();
    // const Zoom=this.mapservice.map.getView().getZoom()
    // this.yourPlace.addpoint(this.clickCoord[0], this.clickCoord[1], Zoom);
  }
  // ----FavoritesPlace----

  closeOtherElement() {
    this.baseMap.closeOtherElement();
  }
}
