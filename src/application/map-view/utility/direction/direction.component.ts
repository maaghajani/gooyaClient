import { state, style, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { toStringXY } from 'ol/coordinate.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Circle as CircleStyle, Stroke, Fill, Style } from 'ol/style.js';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { CoordinateComponent } from '../more-search/coordinate/coordinate.component';
import { IntersectionComponent } from '../more-search/intersection/intersection.component';
import { MoreSearchComponent } from '../more-search/more-search.component';
import { PoiComponent } from '../more-search/poi/poi.component';
import { StreetComponent } from '../more-search/street/street.component';
import { IranBoundryService } from './../../../shared/services/iranBoundry.service';
import { MenuComponent } from './../menu/menu.component';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle.js';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          animation: 'slide-left 0.5s ease-in-out both',
        })
      ),
      state(
        'close',
        style({
          animation: 'slide-right 0.5s ease-in-out both',
        })
      ),
    ]),
  ],
})
export class DirectionComponent implements OnInit {
  StringXY: string = null;
  startPoint: HTMLInputElement;
  endPoint: HTMLInputElement;
  geolocationOnLine: Array<number>;
  geojsonObjects = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:3857',
      },
    },
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: [],
        },
      },
    ],
  };
  timeRout;
  distRout;
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

  ngOnInit() {}

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
    // ----remove layer----

    const mapLayers = this.mapservice.map.getLayers().getArray();
    const removeArray = [];
    mapLayers.forEach(leyer => {
      const properties = leyer.getProperties();
      for (const property in properties) {
        if (property === 'name') {
          const name = leyer.get('name');
          if (name === 'start-point' || 'end-point' || 'routing' || 'pointLabel') {
            removeArray.push(leyer);
          }
        }
      }
    });
    removeArray.forEach(layerTobeRemove => {
      this.mapservice.map.removeLayer(layerTobeRemove);
    });

    this.geojsonObjects.features[0].geometry.coordinates = [];

    this.publicVar.isDirectionInIran = true;
    this.publicVar.isClickHasNetwork = true;
    if (this.publicVar.isOpenDirection) {
      // becuase we use direction func in context menu we should write document.getElementById('start-point') as  ....
      (document.getElementById('start-point') as HTMLInputElement).value = null;
      (document.getElementById('end-point') as HTMLInputElement).value = null;
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

  removeRoutLayer(layerName: string) {
    const mapLayers = this.mapservice.map.getLayers().getArray();
    mapLayers.forEach(leyer => {
      const properties = leyer.getProperties();
      for (const property in properties) {
        if (property === 'name') {
          const name = leyer.get('name');
          if (name === layerName) {
            this.mapservice.map.removeLayer(leyer);
          }
        }
      }
    });
    // this.geojsonObjects.features[0].geometry.coordinates = [];
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

    this.geojson2Point(this.publicVar.startPointLocation, 'start-point');
    this.geojson2Point(this.publicVar.endPointLocation, 'end-point');
    this.searchRout();
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

  setAddressPoint(geoLocation: Array<number>) {
    /* mokhtasat noqteh vared shode ra baresi mikonim dakhel iran hast ya na
    agar bod, ebteda mokhtasat ra be onvane value input qarar midahim,sepas
     1 request b api GetMapLIDByPoint mifrestim ta LID va name noqteh vared shodeh ra bedast biavarim, agar natijeh
     request khali nabod yani aga len > 0 bod , angah F-name ra be onvane vorodi qarar midahim va 1 point ba estefadeh az
     function geojson2Layer dar noqteh click shodeh ijad mikonim
    */
    this.StringXY = toStringXY(geoLocation, 0);
    // ---- for check in iran
    const inside = require('point-in-polygon');
    // ---- is click position in IRAN ----
    this.publicVar.isDirectionInIran = inside(geoLocation, this.IranBoundry.Iran);
    // ---- if client fouces on start and end  point ----
    if (
      (document.activeElement.id === 'start-point' || document.activeElement.id === 'end-point') &&
      this.publicVar.isDirectionInIran
    ) {
      // for remove previous rout if exist
      // first set coord then set name
      if (document.activeElement.id === 'start-point') {
        this.startPoint.value = this.StringXY;
      } else {
        this.endPoint.value = this.StringXY;
      }
      const url = this.publicVar.baseUrl+ ':1398/api/map/GetMapLIDByPoint?x=' + geoLocation[0] + '&y=' + geoLocation[1];
      console.log(url)
      this.httpClient
        .get(url)
        .toPromise()
        .then(resultName => {
          console.log('result api')
          console.log(resultName)
          // khoroji irad dasht bayad 2bareh tabdil b json mishod
          const responseJson = JSON.parse(resultName.toString());
          const lenResult = Object.keys(responseJson).length;
          if (lenResult > 0) {
            this.publicVar.isClickHasNetwork = true;
            this.publicVar.responseGetMapNameByPoint = responseJson[0].F_NAME;
            this.publicVar.responseGetMapLIDByPoint = responseJson[0].LID;
            this.geolocationOnLine = this.convertNewPointToArray(responseJson[0].NewPoint);
            console.log(responseJson);
          } else {
            this.publicVar.isClickHasNetwork = false;
            this.publicVar.responseGetMapNameByPoint = null;
            this.publicVar.responseGetMapLIDByPoint = null;
            this.publicVar.startPointLocation = null;
            this.publicVar.endPointLocation = null;
          }
        })
        .then(() => {
          if (this.publicVar.isClickHasNetwork) {
            if (document.activeElement.id === 'start-point') {
              this.startPoint.value = this.publicVar.responseGetMapNameByPoint;
              // for funtion search start point and rout body
              this.publicVar.startPointLocation = this.geolocationOnLine;
              this.geojson2Point(this.publicVar.startPointLocation, 'start-point');
              // for rout body
              this.publicVar.startLID = this.publicVar.responseGetMapLIDByPoint;
            } else {
              this.endPoint.value = this.publicVar.responseGetMapNameByPoint;
              // for funtion search start point and rout body
              this.publicVar.endPointLocation = this.geolocationOnLine;
              this.geojson2Point(this.publicVar.endPointLocation, 'end-point');
              // for rout body
              this.publicVar.endLID = this.publicVar.responseGetMapLIDByPoint;
            }
          } else {
            this.removeRoutLayer(document.activeElement.id);
            (document.activeElement as HTMLInputElement).value = null;
          }
        });
    }
  }

  convertNewPointToArray(str: string) {
    const lenStr = str.length;
    const substring = str.substring(6, lenStr - 1);
    const split = substring.split(' ');
    const NewLocation = [parseFloat(split[0]), parseFloat(split[1])];
    return NewLocation;
  }
  // ---- if focus on input and click on map show click coordinate----
  getClickLoctionAddress() {
    // ---- if client click on map----
    this.mapservice.map.on('singleclick', (evt: Event) => {
      // ---- get client clicked coordinate ----
      const geoLocations = (evt as any).coordinate;
      // ---- change format coordinate to string ----
      this.setAddressPoint(geoLocations);
    });
  }

  // ---- click for search rout ----
  searchRout() {
    /*baresi mikonim aya input ha value darand yani aya request function  getClickLoctionAddress()
    result dorost darad agar dasht ebteda ba variable haye nmojod body api routing ra dorost kardeh
    sepas b api GetRoute yek request miferstim nokteh mohem responseType: 'text' as 'json' va garna erorr migirim
    */
    console.log('searchrout');
    console.log(this.geojsonObjects);
    const startPoint = (document.getElementById('start-point') as HTMLInputElement).value;
    const endPoint = (document.getElementById('end-point') as HTMLInputElement).value;
    const routUrl = this.publicVar.baseUrl+ ':3000/api/Map/GetRoute';
    const httpOption = { headers: new HttpHeaders({}) };
    httpOption.headers.append('Content-Type', 'application/json');
    console.log(this.publicVar.startPointLocation);
    console.log(this.publicVar.endPointLocation);
    if (this.publicVar.startPointLocation && this.publicVar.endPointLocation && startPoint !== '' && endPoint !== '') {
      const routBody = {
        endId: this.publicVar.endLID,
        fromLat: this.float2Int(this.publicVar.startPointLocation[1]),
        fromLng: this.float2Int(this.publicVar.startPointLocation[0]),
        startId: this.publicVar.startLID,
        toLat: this.float2Int(this.publicVar.endPointLocation[1]),
        toLng: this.float2Int(this.publicVar.endPointLocation[0]),
      };
      console.log('if');
      this.httpClient
        .post(routUrl, routBody, httpOption)
        .toPromise()
        .then(
          (routResult: any) => {
            console.log(routResult);
            this.distRout = routResult.distance;
            this.timeRout = routResult.time;
            (routResult.nodes).forEach(element => {
              this.geojsonObjects.features[0].geometry.coordinates.push(element.coordinates);
            });
          },
          error => console.log(error)
        )
        .then(() => this.geojson2layer());
    }
  }

  float2Int(num: number) {
    const str = num.toString();
    const strArray = str.split('.');
    return parseInt(strArray[0]);
  }

  geojson2layer() {
    this.removeRoutLayer('routing');
    const stylesLine1 = {
      MultiLineString: new Style({
        stroke: new Stroke({
          color: '#4285F4',
          width: 12,
          zIndex: 2,
        }),
      }),
    };
    const stylesLine2 = {
      MultiLineString: new Style({
        stroke: new Stroke({
          color: '#637EAB',
          width: 15,
          zIndex: 1,
        }),
      }),
    };
    const styleFunction = feature => {
      return [stylesLine2[feature.getGeometry().getType()], stylesLine1[feature.getGeometry().getType()]];
    };
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(this.geojsonObjects),
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
      name: 'routing',
      zIndex: 1004,
    });
    // for get mid pont of line and set text distance and time
    const lenCoord = this.geojsonObjects.features[0].geometry.coordinates.length;
    let mid;
    if (lenCoord <= 1) {
      mid = Math.floor(lenCoord / 2);
    } else {
      mid = Math.round(lenCoord / 2);
    }
    const midObject = this.geojsonObjects.features[0].geometry.coordinates[mid];
    const coordMidObject = midObject[Math.round(midObject.length / 2)];
    // add point for distance and time(style text)
    this.geojson2Point(coordMidObject, 'pointLabel');

    this.mapservice.map.addLayer(vectorLayer);
    console.log(this.mapservice.map.getLayers());

    this.geojsonObjects.features[0].geometry.coordinates = [];
  }

  geojson2Point(coord: Array<number>, names: string) {
    let images;
    const name = names;
    this.removeRoutLayer(name);
    let styles;
    if (name === 'start-point' || name === 'end-point') {
      if (name === 'start-point') {
        images = new CircleStyle({
          radius: 6,
          fill: new Fill({ color: '#fff' }),
          stroke: new Stroke({ color: '#000', width: 4 }),
        });
      } else {
        const svg =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.21 24.5"  width="25px"   height="25px">' +
          '<path d="M9.2,0A9.18,9.18,0,0,0,0,9.16v0a9.57,9.57,0,0,0,1.7,5.4l.2.3,6.6,9.3a.75.75,0,0,0,1.05.15.54.54,0,0,0,.15-.15L16.2,15l.3-.4a9.4,9.4,0,0,0,1.7-5.4A8.9,8.9,0,0,0,9.63,0Zm0,12.2a3.1,3.1,0,1,1,3.1-3.1A3.1,3.1,0,0,1,9.2,12.2Z" transform="translate(0 0)" fill="#000"/>' +
          '<circle cx="9.2" cy="9.1" r="3.1" fill="#fff"/>' +
          '</svg>';
        images = new Icon({
          anchor : [0.5 , 1],
          opacity: 1,
          src: 'data:image/svg+xml,' + escape(svg),
          // scale: 0.3,
        });
      }
      styles = {
        Point: new Style({
          image: images,
        }),
      };
    } else {
      const lenCoord = this.geojsonObjects.features[0].geometry.coordinates.length;
      console.log(this.geojsonObjects.features[0].geometry.coordinates)
      console.log('lenCoord ' + lenCoord )
      let mid;
      if (lenCoord <= 1) {
        mid = Math.floor(lenCoord / 2);
      } else {
        mid = Math.round(lenCoord / 2);
      }
      console.log('mid ' + mid )

      const texts = {
        text: this.distRout + '\n' + this.timeRout,
        textAlign: 'center',
        textBaseline: 'middle',
        // rotation: 0.785398164,
        overflow: false,
        // maxAngle: 45°,
        offsetX: 0,
        offsetY: 0,
        font: 'normal 12px Sahel',
        rotateWithView: true,
        fill: new Fill({ color: '#000' }),
        backgroundStroke: new Stroke({ color: '#000', width: 1 }),
        backgroundFill: new Fill({ color: '#fff' }),
        padding: [1, 4, 1, 4],
      };
      // for label placement
      const midObject = this.geojsonObjects.features[0].geometry.coordinates[mid];
      const fristPoint = transform(midObject[0], 'EPSG:3857', 'EPSG:4326');
      const lenMidObject: number = midObject.length;
      const secondPoint = transform(midObject[lenMidObject - 1], 'EPSG:3857', 'EPSG:4326');
      const tan2 = Math.atan2(secondPoint[1] - fristPoint[1], secondPoint[0] - fristPoint[0]); // result radian
      const toDegree = Math.abs(tan2 * (180 / Math.PI));

      if ((toDegree >= 0 && toDegree <= 30) || (toDegree >= 150 && toDegree <= 180)) {
        texts.offsetY = 40;
      } else if ((toDegree > 30 && toDegree < 60) || (toDegree > 130 && toDegree < 150)) {
        texts.offsetX = 60;
        texts.offsetY = 60;
      } else {
        texts.offsetX = 60;
      }
      // for label placement
      styles = {
        Point: new Style({
          // image: new CircleStyle({
          //   radius: 6,
          //   fill: null,
          //   stroke: new Stroke({ color: '#000', width: 4 }),
          // }),
          text: new Text(texts),
        }),
      };
      this.mapservice.map.getView().on('change:resolution', () => {
        const resolution = this.mapservice.map.getView().getResolution();
        const maxResolution = 8;
        if (resolution > maxResolution) {
          texts.text = '';
        } else {

          ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  must correct
          texts.text = this.distRout + '\n' + this.timeRout;
        }
        styles.Point = new Style({ text: new Text(texts) });
      });
    }

    const geojsonObjectPoint = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:3857',
        },
      },
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: coord,
          },
        },
      ],
    };
    const styleFunctionPoint = feature => {
      return [styles[feature.getGeometry().getType()]];
    };
    const vectorSourcePoint = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObjectPoint),
    });

    const vectorLayerPoint = new VectorLayer({
      source: vectorSourcePoint,
      style: styleFunctionPoint,
      name: names,
      zIndex: 1005,
    });

    this.mapservice.map.addLayer(vectorLayerPoint);
  }

  // ---- click for search rout ----
}
