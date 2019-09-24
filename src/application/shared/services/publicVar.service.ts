import { Injectable } from '@angular/core';
// import BingMaps from 'ol/source/BingMaps.js';
import { Tile as TileLayer } from 'ol/layer.js';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
@Injectable()
export class PublicVarService {
  constructor() {}

  public baseUrl = 'http://89.32.249.124';
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
  public isOpenSearchResult = false;
  public time = 500;
  public timeUtility = 1000;
  // ---- for animation ----
  // ---- for get client information ----
  deviceInfo: any;
  deviceType: string;
  ipAddress: any;
  clientInfo: any;
  // ---- for get client information ----
  // ---- login ----
  public isauthenticate = false;
  // ---- login ----
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
  // ---- for Terrain ----
  isAddTerrain = false;
  // ---- for Terrain ----
  // ---- for add layer ----
  isSatellite = true;
  isMap = true;
  // ---- KCE LAYER ----
  xyzLayer = new TileLayer({
    opacity: 1,
    source: new XYZ({
      attributions: 'GooyaMap © ',
      url: this.baseUrl + ':3000/api/Map/Tile/{z}/{y}/{x}',
      // url: 'https://localhost:44309/api/Map/Tile/{z}/{y}/{x}'
    }),
    zIndex: 1,
  });
  MapLayer = new TileLayer({
    source: new TileWMS({
      url: this.baseUrl + ':3000/api/Map/wms',
      params: {
        Layers: [
          'Kheizaran:InterState',
          'Kheizaran:MajorStreets',
          'Kheizaran:MinorStreets',
          'Kheizaran:Streets'],
        Tiled: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  });
  poiLayer = new TileLayer({
    source: new TileWMS({
      url: this.baseUrl + ':3000/api/Map/wms',
      params: {
        Layers: [
          // 'Kheizaran:POI',
          'Kheizaran:PROVINCE_POINT',
        ],
        Tiled: true,
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  });
  AreaLAyer = new TileLayer({
    source: new TileWMS({
      url: this.baseUrl + ':3000/api/Map/wms',
      params: {
        Layers: [
          //'Kheizaran:PROVINCE',
          // 'Kheizaran:IRAN_BOARDER',
          // 'Kheizaran:GREEN_AREA',
          // 'Kheizaran:RIVER_LAKE',
          // 'Kheizaran:OCEANS',
          'Kheizaran:KCE_Layer',
          //'Kheizaran:NETWORK',
        ],
        Tiled: true,
        // style
      },
      serverType: 'geoserver',
      transition: 0,
    }),
  });
  // ---- KCE LAYER ----
  OSMLayer = new TileLayer({
    source: new OSM(),
    zIndex: 0,
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
  terrianLayer = new TileLayer({
    opacity: 0.3,
    visible: false,
    zIndex: 2,
    source: new XYZ({
      url: '	http://mt0.google.com/vt/lyrs=t&hl=en&x={x}&y={y}&z={z}',
      // url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}'
    }),
  });
  // ----DEM----

  // ----bing satelite----
  // SatelliteLayer = new TileLayer({
  //   source: new BingMaps({
  //     key: 'AsnRWxOUQMHMrO3pNwzwxVjHJcMAAB4B8O_tNkyAtfg3tYox6N-YQCoxroLBgwSP',
  //     imagerySet: 'Aerial',
  //   })
  // });
  // ----bing satelite----


  // ---- wmts params ----
  // projLike: ol.ProjectionLike = 'EPSG:3857';
  // projection: ol.proj.Projection = proj.get(this.projLike);
  // projectionExtent: ol.Extent = this.projection.getExtent();
  // size: number = extent.getWidth(this.projectionExtent) / 256;
  // resolution: Array<number> = new Array(21).map((res, index) => this.size / Math.pow(2 , index ) );
  // matrixIds: Array<string> = new Array(21).map((mat, idx) => 'EPSG:3857:' + idx);
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

  // tileLoader(tile, src) {
  //   const client = new XMLHttpRequest();
  //   client.open('GET', src);
  //   client.responseType = 'arraybuffer';
  //   client.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
  //   client.setRequestHeader('Access-Control-Allow-Origin', '*');

  //   client.onload = function() {
  //     const arrayBufferView = new Uint8Array(this.response);
  //     const blob = new Blob([arrayBufferView], { type: 'image/png' });
  //     const urlCreator = window.URL; // || window.webkitURL;
  //     const imageUrl = urlCreator.createObjectURL(blob);
  //     tile.getImage().src = imageUrl;
  //   };
  //   client.send();
  // }

}
