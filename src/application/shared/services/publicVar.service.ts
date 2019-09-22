import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
// import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
//import proj from 'ol/proj';
//import extent from 'ol/extent';
import WMTS from 'ol/source/WMTS';
import optionsFromCapabilities from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
// import BingMaps from 'ol/source/BingMaps.js';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer.js';
import ImageWMS from 'ol/source/ImageWMS';
@Injectable()
export class PublicVarService {
  constructor() {}

//1398.05.30-hossein changes
//
//
//************************ */


  // ---- for animation ----
  public isOpenLogin = false;
  public isOpenPopupLocation = true;
  public isOpenReportError = false;
  public isOpenMissingPlace = false;
  public isOpenDirection = false;
  public isOpenStreet = false;
  public isOpenIntersect = false;
  public isOpenPoi = false;
  public isOpenCoordinate = false;
  public isOpenNavigation = false;
  public isOpenPlaces = false;
  public isOpenAboutUs = false;
  public time = 500;
  public timeUtility = 1000;
  // ---- for animation ----

  // ---- for get client information ----
  deviceInfo: any;
  deviceType: string;
  ipAddress: any;
  clientInfo: any;
  // ---- for get client information ----
  isauthenticate = false;

  // ---- for missing Map ----
  public missingMap: Map;
  public isAddmissingMap = false;
  isMisingMapInIran: boolean;
  // ---- for missing Map ----

  // ---- for error map ----
  errorMap: Map;
  isAddErrorMap = false;
  isErrorMapInIran: boolean;
  // ---- for error map ----
  // ---- for mini map ----
  miniMap: Map;
  isMiniMapSatellite = true;
  // ---- for mini map ----
  // ---- for Direction ----
  isDirectionInIran = true;
  isClickHasNetwork = true;
  startPointLocation: Array<number>;
  endPointLocation: Array<number>;
  responseGetMapLIDByPoint: number;
  responseGetMapNameByPoint: string;
  endLID: number;
  startLID: number;
  // ---- for Direction ----
  // ---- for ِTerrain ----
  isAddTerrain = false;
  // ---- for ِTerrain ----

  // ---- for add layer ----
  isSatellite = true;
  isMap = true;

  // ---- wmts params ----
  projLike: ol.ProjectionLike = 'EPSG:3857';
  //projection: ol.proj.Projection = proj.get(this.projLike);
  //projectionExtent: ol.Extent = this.projection.getExtent();
  //size: number = extent.getWidth(this.projectionExtent) / 256;
  //resolution: Array<number> = new Array(21).map((res, index) => this.size / Math.pow(2 , index ) );
  matrixIds: Array<string> = new Array(21).map((mat, idx) => 'EPSG:3857:' + idx);

  MapLayer = new TileLayer({
    source: new TileWMS({
      url: 'http://89.32.249.124:3000/api/Map/wms',
      params: {
        Layers: [
          'Kheizaran:InterState',
          'Kheizaran:MajorStreets',
          'Kheizaran:MinorStreets',
          'Kheizaran:Streets',
        ],
        Tiled: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  });
  poiLayer = new TileLayer({
    source: new TileWMS({
      url: 'http://89.32.249.124:3000/api/Map/wms',
      params: {
        Layers: [
          // 'Kheizaran:POI',
        'Kheizaran:PROVINCE_POINT' ],
        Tiled: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  });
  AreaLAyer = new TileLayer({
    source: new TileWMS({
      url: 'http://89.32.249.124:3000/api/Map/wms',
      params: {
        Layers: [
          // 'Kheizaran:PROVINCE',
          // 'Kheizaran:IRAN_BOARDER',
          // 'Kheizaran:GREEN_AREA',
          // 'Kheizaran:RIVER_LAKE',
          // 'Kheizaran:OCEANS',
          'Kheizaran:KCE_Layer'
        ],
        Tiled: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  });


  // ----google satelite----
  SatelliteLayer = new TileLayer({
    visible: true,
    opacity: 1.0,
    source: new XYZ({
      //  url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga'  //----with lable ----
      url: 'http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}',
    }),
  });
  // ----google satelite----
  // ----DEM----
  // terrianLayer = new TileLayer({
  //   // opacity:0.5,
  //   visible: false,
  //   source: new XYZ({
  //     url: `https://api.mapbox.com/styles/v1/marziyehbashiri/cjy5kiei60s9k1co5ct9dyx1h/tiles/
  //     256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyeml5ZWhiYXNoaXJpIiwiYSI6ImNqeTVoaGI4eTA3MG8zbGxlY2t5cWI1ZW4ifQ.c0urKH-5ikaWwrwN4Ge9gg`,
  //   }),
  // });

  terrianLayer = new TileLayer({
    opacity: 0.3,
    visible: false,

    source: new XYZ({
      // attributions: 'GooyaMap © ',
      url: '	http://mt0.google.com/vt/lyrs=t&hl=en&x={x}&y={y}&z={z}',
      // url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}'
    }),
  });
  // ----DEM----

  xyzLayer = new TileLayer({
    opacity: 1,
    source: new XYZ({
      attributions: 'GooyaMap © ',
      url: 'http://89.32.249.124:3000/api/Map/Tile/{z}/{y}/{x}',
      // url: 'https://localhost:44309/api/Map/Tile/{z}/{y}/{x}'
    }),
  });

  // WMTSLayer = new TileLayer({
  //   opacity: 1,
  //   source: new WMTS({
  //     attributions: 'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/' +
  //       'services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>',
  //     url: 'http://89.32.249.124:3000/api/Map/WMTSStatic',
  //     layer: 'Kheizaran:InterState',
  //     matrixSet: 'EPSG:3857',
  //     format: 'image/png',
  //     projection : this.projection,
  //     tileLoadFunction: this.tileLoader,
  //     tileGrid: new WMTSTileGrid({
  //       origin: extent.getTopLeft(this.projectionExtent),
  //       resolutions: this.resolution,
  //       matrixIds: this.matrixIds
  //     }),
  //     style: '',
  //     wrapX: true
  //   })
  // });

  tileLoader(tile, src) {
    const client = new XMLHttpRequest();
    client.open('GET', src);
    client.responseType = 'arraybuffer';
    client.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    client.setRequestHeader('Access-Control-Allow-Origin', '*');

    client.onload = function() {
      const arrayBufferView = new Uint8Array(this.response);
      const blob = new Blob([arrayBufferView], { type: 'image/png' });
      const urlCreator = window.URL; // || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      tile.getImage().src = imageUrl;
    };
    client.send();
  }

  // ----bing satelite----
  // SatelliteLayer = new TileLayer({
  //   source: new BingMaps({
  //     key: 'AsnRWxOUQMHMrO3pNwzwxVjHJcMAAB4B8O_tNkyAtfg3tYox6N-YQCoxroLBgwSP',
  //     imagerySet: 'Aerial',
  //   })
  // });
  // ----bing satelite----

  // ---- for add layer ----
}
