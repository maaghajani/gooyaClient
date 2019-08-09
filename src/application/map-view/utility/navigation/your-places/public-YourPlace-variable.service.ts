import { Vector as VectorLayer } from 'ol/layer.js';
import { Injectable } from '@angular/core';
import { Vector as VectorSource } from 'ol/source.js';
import { Icon, Style } from 'ol/style.js';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { MapService } from 'src/application/shared/services/map.service';
import { Pointer as PointerInteraction } from 'ol/interaction.js';
import Feature from 'ol/Feature.js';
import { Point } from 'ol/geom.js';

@Injectable({
  providedIn: 'root'
})
export class PubliYourPlaceVariableService {
  constructor(public publicVar: PublicVarService, private mapservice: MapService) {}

  isOpenHome: boolean = false;
  isOpenWork: boolean = false;
  isOpenOtherPlace: boolean = false;
  maplayer: VectorLayer;
  layerSource: VectorSource = new VectorSource();
  layerStyle: Style = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      crossOrigin: 'anonymous',
      scale: 0.3,
      src: '../../../../../assets/img/your-place.png'
      // imgSize:[25,25]
    })
  });
  closePlace() {
    this.publicVar.isOpenPlaces = false;
    setTimeout(e => {
      document.getElementById('places').style.display = 'none';
    }, this.publicVar.timeUtility);
  }
  // ---- this functio for add vector layer(point) and add interaction to map for move point by mouse ----
  addpoint(long: number, lat: number, zoom: number) {
    this.maplayer = new VectorLayer({
      visible: true,
      opacity: 1.0,
      source: this.layerSource,
      style: this.layerStyle,
      // set z index for layer always top
      zIndex: 1002,
      // ----set name for layer bacause we want remove layer by name
      name: 'yourPlace'
    });
    // for return value and show on input
    this.mapservice.map.addLayer(this.maplayer);
    const Drag = (function(PointerInteraction) {
      function Drag() {
        PointerInteraction.call(this, {
          handleDownEvent: handleDownEvent,
          handleDragEvent: handleDragEvent,
          handleMoveEvent: handleMoveEvent,
          handleUpEvent: handleUpEvent
        });
        this.coordinate_ = null; //Save mouse click coordinates
        this.cursor_ = 'pointer'; //Save the current mouse cursor style
        this.feature_ = null; //Save the elements that the mouse clicks on and intersects
        this.previousCursor_ = undefined; //Save the last mouse cursor style
      }

      if (PointerInteraction) Drag.__proto__ = PointerInteraction;
      Drag.prototype = Object.create(PointerInteraction && PointerInteraction.prototype);
      Drag.prototype.constructor = Drag;

      return Drag;
    })(PointerInteraction);
    //Function handling "down" events.
    //If the function returns true then a drag sequence is started
    function handleDownEvent(evt) {
      var map = evt.map;
      // Return the mouse click on the intersecting elements
      var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });

      if (feature) {
        this.coordinate_ = evt.coordinate; //Save the coordinates of the mouse click
        this.feature_ = feature; //Save the feature that intersects the coordinates of the mouse click
      }
      return !!feature; //equivalent to Boolean(feature)
    }
    //Function handling "drag" events.
    //This function is called on "move" events during a drag sequence
    function handleDragEvent(evt) {
      var deltaX = evt.coordinate[0] - this.coordinate_[0];
      var deltaY = evt.coordinate[1] - this.coordinate_[1];

      var geometry = this.feature_.getGeometry();
      geometry.translate(deltaX, deltaY); //Make the graph transfer deltaX, deltaY
      //Save the new coordinate point of the mouse to the coordinate_ attribute of app.Drag
      this.coordinate_[0] = evt.coordinate[0];
      this.coordinate_[1] = evt.coordinate[1];
    }
    //Function handling "move" events.
    //This function is called on "move" events, also during a drag sequence
    //(so during a drag sequence both the handleDragEvent function and this function are called).
    function handleMoveEvent(evt) {
      if (this.cursor_) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
          return feature;
        });
        var element = evt.map.getTargetElement(); //Get the div element container of the map
        if (feature) {
          // If the mouse coordinate point intersects a feature
          if (element.style.cursor != this.cursor_) {
            //If the style of the mouse cursor on the map is different from the mouse style saved by the cursor_
            this.previousCursor_ = element.style.cursor;
            element.style.cursor = this.cursor_; //convert the cursor
          }
        } else if (this.previousCursor_ !== undefined) {
          //If the mouse coordinate point does not intersect any features, and the previousCursor_  is not undefined
          element.style.cursor = this.previousCursor_; //convert the cursor
          this.previousCursor_ = undefined;
        }
      }
    }
    //Function handling "up" events.
    //If the function returns false then the current drag sequence is stopped.
    function handleUpEvent() {
      this.coordinate_ = null;
      this.feature_ = null;
      return false;
    }
    this.mapservice.map.addInteraction(new Drag());
    const iconFeature = new Feature({
      geometry: new Point([long, lat])
    });
    this.layerSource.addFeature(iconFeature);
    this.mapservice.map.getView().setZoom(zoom);
    this.mapservice.map.getView().setCenter([long, lat]);
  }
  // ---- this functio for add vector layer(point) ----
  removePoint() {
    this.layerSource.clear();
    // ---for remove layer from base map ----
    const mapLayers = this.mapservice.map.getLayers().getArray();
    mapLayers.forEach(leyer => {
      const properties = leyer.getProperties();
      for (const property in properties) {
        if (property == 'name') {
          const name = leyer.get('name');
          if (name == 'yourPlace') {
            this.mapservice.map.removeLayer(leyer);
          }
        }
      }
    });
  }

  CreatAddresFromPoint(inuptID:string){
    const input = document.getElementById(inuptID) as HTMLInputElement;
    // get map center and zoom to show point on it
    const Center = this.mapservice.map.getView().getCenter();
    const Zoom = this.mapservice.map.getView().getZoom();
    // ----for first click before move point,add point in center map ----
    this.addpoint(Center[0], Center[1], Zoom);
    input.value = Center[0].toFixed(5) + ' , ' + Center[1].toFixed(5);
    // ----after move point ----
    // get point source and point coordinate
    var source = this.maplayer.getSource();
    // Get the features of the layer
    var features = source.getFeatures();
    var feature;
    // iterate through the array
    for (var i = 0, ii = features.length; i < ii; ++i) {
      feature = features[i];
      // get the geometry for each feature point
      const geometry = feature.getGeometry();
      // get the first coordinate
      geometry.on('change', evt => {
        const geometry_coords: Array<Number> = geometry.getFirstCoordinate();
        // assign them to two input value
        input.value = geometry_coords[0].toFixed(5) + ' , ' + geometry_coords[1].toFixed(5);
      });
    }
  }
}
