import { MenuComponent } from './../menu/menu.component';
import { state, style, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { toStringXY } from 'ol/coordinate.js';
import { transform } from 'ol/proj.js';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { CoordinateComponent } from '../more-search/coordinate/coordinate.component';
import { IntersectionComponent } from '../more-search/intersection/intersection.component';
import { MoreSearchComponent } from '../more-search/more-search.component';
import { PoiComponent } from '../more-search/poi/poi.component';
import { StreetComponent } from '../more-search/street/street.component';
import { IranBoundryService } from './../../../shared/services/iranBoundry.service';
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
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
export class DirectionComponent implements OnInit {
  StringXY: string = null;
  startPoint: HTMLInputElement;
  endPoint: HTMLInputElement;
  resulRout = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [[4e6, 2e6], [8e6, -2e6]]
    }
  };
  constructor(
    public mapservice: MapService,
    public publicVar: PublicVarService,
    public IranBoundry: IranBoundryService,
    private moreSearch: MoreSearchComponent,
    private street: StreetComponent,
    private poi: PoiComponent,
    private coordinate: CoordinateComponent,
    private intersection: IntersectionComponent,
    private httpClient: HttpClient,
    public menu: MenuComponent
  ) {}

  ngOnInit() {
    // this.geojson2layer();
  }

  openDirection() {
    // ---- get origin and destination value ,because direction display is none,we can'tget elemet by id----
    this.startPoint = document.getElementById('start-point') as HTMLInputElement;
    this.endPoint = document.getElementById('end-point') as HTMLInputElement;
    this.publicVar.isOpenDirection = true;
    document.getElementById('rout').style.display = 'block';
    document.getElementById('rout').style.zIndex = '2';
    this.startPoint.focus();
    this.focusSearch();
    // ----close more search when direction open ----
    this.moreSearch.closeNavmore();
    this.street.closeStreet();
    this.intersection.closeIntersection();
    this.poi.closePoi();
    this.coordinate.closeCoordinate();
  }

  closeDirection() {
    this.publicVar.isDirectionInIran = true;
    this.publicVar.isClickHasNetwork = true;
    if (this.publicVar.isOpenDirection) {
      // becuase we use direction func in context menu we should write document.getElementById('start-point') as  ....
      (document.getElementById('start-point') as HTMLInputElement).value = '';
      (document.getElementById('end-point') as HTMLInputElement).value = '';
      this.publicVar.startLID = null;
      this.publicVar.endLID = null;
      this.publicVar.responseGetMapLIDByPoint = null;
      this.publicVar.responseGetMapNameByPoint = null;
      this.publicVar.startPointLocation = null;
      this.publicVar.endPointLocation = null;
    }
    setTimeout(e => {
      document.getElementById('rout').style.zIndex = '1';
      document.getElementById('rout').style.display = 'none';
      // ----remove input value after close direction ----
    }, this.publicVar.timeUtility);
    this.publicVar.isOpenDirection = false;
  }

  // ---- change origin and destination value
  changeRoout() {
    // becuase when open dirction by right click dont work , we have to use this.openDirection()
    this.openDirection();
    const empty = this.startPoint.value;
    this.startPoint.value = this.endPoint.value;
    this.endPoint.value = empty;
    // for rout body
    const emptyLocation = this.publicVar.startPointLocation;
    this.publicVar.startPointLocation = this.publicVar.endPointLocation;
    this.publicVar.endPointLocation = emptyLocation;
    const emptyLID = this.publicVar.endLID;
    this.publicVar.endLID = this.publicVar.startLID;
    this.publicVar.startLID = emptyLID;
  }

  // ---- for go next input by keypress enter ----
  nextInput() {
    /* we must get value from element becuase we use directionComponent in rigth click and other component,
    cannot us variable this.startPoint */
    if ((document.getElementById('start-point') as HTMLInputElement).value !== '') {
      document.getElementById('end-point').focus();
    }
  }
  // ---- when focus on input search icon Show ----
  focusSearch() {
    this.startPoint.addEventListener('focus', evt => {
      document.getElementById('searchIcon').style.opacity = '1';
    });
    this.startPoint.addEventListener('focusout', evt => {
      document.getElementById('searchIcon').style.opacity = '0';
    });
    this.endPoint.addEventListener('focus', evt => {
      document.getElementById('searchIcon2').style.opacity = '1';
    });
    this.endPoint.addEventListener('focusout', evt => {
      document.getElementById('searchIcon2').style.opacity = '0';
    });
  }

  goToLocation(valueInput: Array<number>) {
    if (valueInput) {
      this.mapservice.map.getView().setCenter([valueInput[0], valueInput[1]]);
      // this.mapservice.map.getView().setZoom(10);
      // ---- for add point when search ----
    }
  }

  // ---- if focus on input and click on map show click coordinate----
  getClickLoctionAddress() {
    /* aval baresi mikonim aya roye naqsheh singleclick anjam mishavad
    agar true bood mokhtasat noqteh click shode ra bedast mi avarim sepas az mercator b DD
    tabdil mikonim ta baresi konim dakhel iran hast ya na
    agar bod 1 request b api GetMapLIDByPoint mifrestim ta LID va name nogteh click shodeh ra bedast biavarim
    */
    const inside = require('point-in-polygon');
    // ---- if client click on map----
    this.mapservice.map.on('singleclick', (evt: Event) => {
      // ---- get client clicked coordinate ----
      const geoLocation = (evt as any).coordinate;
      // ---- change format coordinate ----
      this.StringXY = toStringXY(geoLocation, 0);
      // ---- is click position in IRAN ----
      this.publicVar.isDirectionInIran = inside(geoLocation, this.IranBoundry.Iran);
      // ---- if client fouces on start and end  point ----
      if (
        (document.activeElement.id === 'start-point' || document.activeElement.id === 'end-point') &&
        this.publicVar.isDirectionInIran
      ) {
        const url = 'http://89.32.249.124:1398/api/map/GetMapLIDByPoint?x=' + geoLocation[0] + '&y=' + geoLocation[1];
        this.httpClient
          .get(url)
          .toPromise()
          .then(resultName => {
            console.log(resultName);
            const responseJson = JSON.parse(resultName.toString());
            const lenResult = Object.keys(responseJson).length;
            if (lenResult > 0) {
              this.publicVar.isClickHasNetwork = true;
              this.publicVar.responseGetMapNameByPoint = responseJson[0].F_NAME;
              this.publicVar.responseGetMapLIDByPoint = responseJson[0].LID;
            } else {
              this.publicVar.isClickHasNetwork = false;
              this.publicVar.responseGetMapNameByPoint = null;
              this.publicVar.responseGetMapLIDByPoint = null;
            }
          })
          .then(() => {
            if (document.activeElement.id === 'start-point') {
              this.startPoint.value = this.StringXY;
              this.startPoint.value = this.publicVar.responseGetMapNameByPoint;
              // for funtion search start point and rout body
              this.publicVar.startPointLocation = geoLocation;
              // for rout body
              this.publicVar.startLID = this.publicVar.responseGetMapLIDByPoint;
            } else {
              this.endPoint.value = this.StringXY;
              this.endPoint.value = this.publicVar.responseGetMapNameByPoint;
              // for funtion search start point and rout body
              this.publicVar.endPointLocation = geoLocation;
              // for rout body
              this.publicVar.endLID = this.publicVar.responseGetMapLIDByPoint;
            }
          });
      }
    });
  }

  // ---- click for search rout ----
  searchRout() {
    /*baresi mikonim aya input ha value darand yani aya request function  getClickLoctionAddress()
    result dorost darad agar dasht ebteda ba variable haye nmojod body api routing ra dorost kardeh
    sepas b api GetRoute yek request miferstim nokteh mohem responseType: 'text' as 'json' va garna erorr migirim
    */
    const startPoint = (document.getElementById('start-point') as HTMLInputElement).value;
    const endPoint = (document.getElementById('end-point') as HTMLInputElement).value;
    const routUrl = encodeURIComponent('http://89.32.249.124:3000/api/Map/GetRoute');
    const httpOption = { headers: new HttpHeaders({}), responseType: 'text' as 'json' };
    httpOption.headers.append('Content-Type', 'application/json');
    if (this.publicVar.startPointLocation && this.publicVar.endPointLocation && startPoint !== '' && endPoint !== '') {
      console.log('searchrout');
      const routBody = {
        endId: this.publicVar.endLID,
        fromLat: this.float2Int(this.publicVar.startPointLocation[1]),
        fromLng: this.float2Int(this.publicVar.startPointLocation[0]),
        startId: this.publicVar.startLID,
        toLat: this.float2Int(this.publicVar.endPointLocation[1]),
        toLng: this.float2Int(this.publicVar.endPointLocation[0])
      };
      console.log(routBody);
      this.httpClient
        .post(decodeURIComponent(routUrl), routBody, httpOption)
        .toPromise()
        .then(
          (routResult: any) => {
            console.log(typeof routResult);
            this.resulRout = routResult;
            console.log(this.resulRout);
          },
          error => console.log(error)
        );
    }
  }

  float2Int(num: number) {
    const str = num.toString();
    const strArray = str.split('.');
    return parseInt(strArray[0]);
  }

  geojson2layer() {
    const styles = {
      LineString: new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1
        })
      })
    };
    const rout = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[4e6, 2e6], [8e6, -2e6]]
      }
    };

    const styleFunction = function(feature) {
      return styles[feature.getGeometry().getType()];
    };

    const geojsonObject = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:3857'
        }
      },
      features: [rout]
    };
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject)
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction
    });

    this.mapservice.map.addLayer(vectorLayer);
  }

  // ---- click for search rout ----
}
