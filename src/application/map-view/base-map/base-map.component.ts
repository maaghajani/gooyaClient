import { state, style, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import View from 'ol/View';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { MapService } from '../../shared/services/map.service';
import { DirectionComponent } from '../utility/direction/direction.component';
import { CoordinateComponent } from '../utility/more-search/coordinate/coordinate.component';
import { IntersectionComponent } from '../utility/more-search/intersection/intersection.component';
import { MoreSearchComponent } from '../utility/more-search/more-search.component';
import { PoiComponent } from '../utility/more-search/poi/poi.component';
import { StreetComponent } from '../utility/more-search/street/street.component';
import { YourPlacesComponent } from './../utility/navigation/your-places/your-places.component';
@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          animation: ' fade-in 1s cubic-bezier(0.39, 0.575, 0.565, 1) both',
        })
      ),
      state(
        'close',
        style({
          animation: ' fade-out 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both',
        })
      ),
    ]),
  ],
})
export class BaseMapComponent implements OnInit, DoCheck {
  isPersian: boolean = true;
  constructor(
    private mapservice: MapService,
    public publicVar: PublicVarService,
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
    private moreSearch: MoreSearchComponent,
    private direction: DirectionComponent,
    private street: StreetComponent,
    private poi: PoiComponent,
    private coordinate: CoordinateComponent,
    private intersection: IntersectionComponent,
    public yourPlace: YourPlacesComponent
  ) {
    // ---- get client infomation like ip, os , ... ----
    window.addEventListener('DOMContentLoaded', e => {
      //  get token response  //
      this.httpClient
        .post<GetTokenResponse>(
          this.publicVar.baseUrl + ':3000/api/Token/Create',
          {
            emailAddress: 'gooya@gmail.com',
            plainPassword: 'gooya',
          }
        )
        .subscribe(data => {
          sessionStorage.setItem('token', data.token);
          console.log(data);
        });

      // ---- first we get ip from https://api.ipify.org?format=json ----
      this.httpClient
        .get<{ ip: string }>('https://api.ipify.org?format=json')
        .toPromise()
        .then(data => (this.publicVar.ipAddress = data))
        .then(() => {
          // ---- then send ip to http://ip-api.com/json/ and get info about ip----
          const getURl = 'http://ip-api.com/json/' + this.publicVar.ipAddress.ip;
          this.httpClient
            .get(getURl)
            .toPromise()
            .then(infoIP => {
              this.publicVar.clientInfo = infoIP;
            })
            .then(() => {
              this.publicVar.deviceInfo = this.deviceService.getDeviceInfo();
              const isTablet = this.deviceService.isTablet();
              const isDesktop = this.deviceService.isDesktop();
              this.publicVar.deviceType = null;
              if (isDesktop) {
                this.publicVar.deviceType = 'Desktop';
              } else if (isTablet) {
                this.publicVar.deviceType = 'Tablet';
              } else {
                this.publicVar.deviceType = 'Mobile';
              }
            });
        });
    });
    // ---- get client infomation like ip, os , ... ----
  }
  ngOnInit() {
    this.setTarget();
    this.setView();
    this.addXYZTile();
    // this.addWMTSLayer();
     //this.addWMS();
    this.moveCursor();
    this.zoomCursor();
    this.BBOX();
  }

  ngDoCheck() {
    this.mapservice.map.getView().on('change:resolution', (evt: Event) => {
      this.setFeedbackPosition();
    });
    this.rightControlePosition();
  }

  BBOX() {
    if (window.location.hash !== '') {
      // try to restore center, zoom-level from the URL
      console.log(window.location.hash);
      const hash = window.location.hash.replace('@', '');
      const parts = hash.split(',');
      if (parts.length === 4) {
        this.mapservice.zoom = parseInt(parts[0], 10);
        this.mapservice.centerX = parseFloat(parts[1]);
        this.mapservice.centerY = parseFloat(parts[2]);
      }
    }
    let shouldUpdate = true;
    const view = this.mapservice.map.getView();
    const updatePermalink = () => {
      if (!shouldUpdate) {
        // do not update the URL when the view was changed in the 'popstate' handler
        shouldUpdate = true;
        return;
      }

      const center = view.getCenter();
      const hash =
        '#' + Math.round(center[0] * 100) / 100 + ',' + Math.round(center[1] * 100) / 100 + ',' + view.getZoom() + 'Z';

      //console.log(hash);
      const states = {
        zoom: view.getZoom(),
        center: view.getCenter(),
      };
      window.history.pushState(states, 'map', hash);
    };

    this.mapservice.map.on('moveend', updatePermalink);

    // restore the view state when navigating through the history, see
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
    window.addEventListener('popstate', event => {
      if (event.state === null) {
        return;
      }
      console.log('potstate');
      view.setCenter(event.state.center);
      view.setZoom(event.state.zoom);
      shouldUpdate = false;
    });
  }

  // ---- ol function ----
  setView() {
    const view = new View({
      projection: this.mapservice.project,
      center: [this.mapservice.centerX, this.mapservice.centerY],
      zoom: this.mapservice.zoom,
      // minZoom: this.mapservice.minZoom,
      // maxZoom: this.mapservice.maxZoom
    });
    this.mapservice.map.setView(view);
  }
  setTarget() {
    this.mapservice.map.setTarget('base-map');
  }
  // ---- add kce Layer ---
  addWMS() {
    this.mapservice.map.addLayer(this.publicVar.AreaLAyer);
    this.mapservice.map.addLayer(this.publicVar.terrianLayer);
    // this.mapservice.map.addLayer(this.publicVar.MapLayer);
    this.mapservice.map.addLayer(this.publicVar.poiLayer);
  }
  // ---- add kce Layer ---
  // ---- ol function ----

  // ----Add tile static layer

  addXYZTile() {
    this.mapservice.map.addLayer(this.publicVar.OSMLayer);
    this.mapservice.map.addLayer(this.publicVar.xyzLayer);
  }

  addWMTSLayer() {
    // this.mapservice.map.addLayer(this.publicVar.WMTSLayer);
  }

  // ---- change mouse cursor when move on map ----
  moveCursor() {
    const BaseMap = document.getElementById('base-map');
    this.mapservice.map.on('movestart', (evt: Event) => {
      BaseMap.style.cursor = 'move';
    });
    this.mapservice.map.on('moveend', (evt: Event) => {
      BaseMap.style.cursor = 'auto';
    });
  }
  zoomCursor() {
    const BaseMap = document.getElementById('base-map');
    let oldResolution = this.mapservice.map.getView().getResolution();
    this.mapservice.map.getView().on('change:resolution', (evt: Event) => {
      const newResolution = this.mapservice.map.getView().getResolution();
      if (oldResolution > newResolution) {
        BaseMap.style.cursor = 'zoom-in';
      } else {
        BaseMap.style.cursor = 'zoom-out';
      }
      oldResolution = newResolution;
    });
  }
  // ---- change mouse cursor when move on map ----

  // ---- setPosition for sendfeedback ----
  setFeedbackPosition() {
    const mousePos = document.getElementById('mouse-position-box').offsetWidth;
    const ScaleLine = document.getElementById('scale-line-box').offsetWidth;
    const sendFeedback = document.getElementById('send-feedback-box');
    const sumWidth = mousePos + ScaleLine - 1;
    sendFeedback.style.marginRight = sumWidth + 'px';
    sendFeedback.style.marginLeft = sumWidth + 'px';
  }
  // ---- setPosition for sendfeedback ----

  // ---- login ----
  openLogin() {
    document.getElementById('login').style.display = 'flex';
    document.getElementById('login-page-box').style.display = 'flex';
    document.getElementById('signin-page').style.display = 'none';
    document.getElementById('verification-code').style.display = 'none';
    document.getElementById('signin-forgetpass-box').style.display = 'flex';
  }
  // ---- for popup animation ----
  toggleLogin() {
    this.publicVar.isOpenLogin = true;
  }
  // ---- for popup animation ----
  // ---- login ----

  // ---for close searchMore and direction Element when click another Element ----
  closeOtherElement() {
    this.moreSearch.closeNavmore();
    this.street.closeStreet();
    this.poi.closePoi();
    this.coordinate.closeCoordinate();
    this.intersection.closeIntersection();
    this.direction.closeDirection();
  }
  // ---for close searchMore and direction Element when click another Element ----

  // ---- for move scale line , minimap , ... when direction , moereSearch open ----
  rightControlePosition() {
    if (
      this.publicVar.isOpenDirection ||
      this.publicVar.isOpenStreet ||
      this.publicVar.isOpenIntersect ||
      this.publicVar.isOpenPoi ||
      this.publicVar.isOpenPlaces ||
      this.publicVar.isOpenCoordinate ||
      this.publicVar.isOpenSearchResult
    ) {
      document.getElementById('right-controller').style.transform = 'translateX(-382px)';
      document.getElementById('right-controller').style.transition = 'all 0.5s ease-in-out';
    } else {
      document.getElementById('right-controller').style.transform = 'translateX(0)';
    }
  }
  // ---- for move scale line , minimap , ... when direction , moereSearch open ----

  chengeLanguage() {
    const bodyDir = window
      .getComputedStyle(document.getElementsByTagName('body').item(0))
      .getPropertyValue('direction');
    if (bodyDir === 'rtl') {
      document.getElementsByTagName('body').item(0).style.direction = 'ltr';
    } else {
      document.getElementsByTagName('body').item(0).style.direction = 'rtl';
    }
  }

  // end
}

interface GetTokenResponse {
  userNotExists: boolean;
  invalidUserNameOrPassword: boolean;
  token: string;
  user: User;
}

interface User {
  id: number;
  emailAddress: string;
  plainPassword: string;
  shareCode: string;
  stamp: string;
  userInfoJson: string;
  isEmailVerified: boolean;
  isActive: boolean;
  thumbnail: string;
  createTime: Date;
}
