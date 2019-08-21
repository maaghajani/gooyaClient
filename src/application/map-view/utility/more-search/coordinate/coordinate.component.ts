import { MenuComponent } from './../../menu/menu.component';
import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj.js';
import Projection from 'ol/proj/Projection';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style.js';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
@Component({
  selector: 'app-coordinate',
  templateUrl: './coordinate.component.html',
  styleUrls: ['./coordinate.component.scss'],
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
export class CoordinateComponent implements OnInit {
  // transform Variable ------
  transCoord: Array<number>;
  form: FormGroup;
  // ---- create style for search point ----
  markerSource = new VectorSource();
  svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.21 24.5"  width="35px"   height="35px">' +
  '<path d="M9.2,0A9.18,9.18,0,0,0,0,9.16v0a9.57,9.57,0,0,0,1.7,5.4l.2.3,6.6,9.3a.75.75,0,0,0,1.05.15.54.54,0,0,0,.15-.15L16.2,15l.3-.4a9.4,9.4,0,0,0,1.7-5.4A8.9,8.9,0,0,0,9.63,0Zm0,12.2a3.1,3.1,0,1,1,3.1-3.1A3.1,3.1,0,0,1,9.2,12.2Z" transform="translate(0 0)" fill="#DB0000"/>' +
  '<circle cx="9.2" cy="9.1" r="3.1" fill="#fff"/>' +
  '</svg>';
  images = new Icon({
    opacity: 1,
    src:  'data:image/svg+xml,' + escape(this.svg),
  });
  markerStyle = new Style({
    image: this.images,
  });

  // ---- create style for search point ----
  constructor(public publicVar: PublicVarService, private mapservice: MapService, fb: FormBuilder , public menu:MenuComponent) {
    this.form = fb.group({
      RadioBtn: ['', Validators.required]
    });
  }

  ngOnInit() {
    // this.switchcoord();
  }

  // ---- for go next input by keypress enter ----
  nextInput() {
    const lat = (document.getElementById('lat') as HTMLInputElement).value;
    if (lat != '') {
      document.getElementById('long').focus();
    }
  }

  closeCoordinate() {
    this.publicVar.isOpenCoordinate = false;
    setTimeout(e => {
      document.getElementById('coordinate').style.display = 'none';
    }, this.publicVar.timeUtility);
    (document.getElementById('lat') as HTMLInputElement).value = '';
    (document.getElementById('long') as HTMLInputElement).value = '';
    // --- for clear search icon ----
    this.markerSource.clear();
  }

  // ---- for add point when search ----
  addMarker(postion) {
    this.markerSource.clear();
    const iconFeature = new Feature({
      geometry: new Point(postion)
    });
    this.markerSource.addFeature(iconFeature);
    this.mapservice.map.addLayer(
      new VectorLayer({
        source: this.markerSource,
        style: this.markerStyle,
        zIndex: 1002
      })
    );
  }
  // ---- fore add point when search ----

  searchCoord() {
    const lat = (document.getElementById('lat') as HTMLInputElement).value;
    const long = (document.getElementById('long') as HTMLInputElement).value;
    const valueBtn = this.form.getRawValue().RadioBtn;

    const view = this.mapservice.map.getView();

    if (lat !== '' && long !== '') {
      if (valueBtn === 'radio-2') {
        this.dmsToMercator();
        // console.log('DMS');
      } else if (valueBtn === 'radio-3') {
        this.ddTomercator();
        // console.log('DD');
      } else {
        // console.log('Mercator');
        this.transCoord = [parseFloat(long), parseFloat(lat)];
      }
      view.animate({
        center: [this.transCoord[0], this.transCoord[1]],
        zoom: 12,
        duration: 1000
      });
      // ---- for add point when search ----
      this.addMarker([this.transCoord[0], this.transCoord[1]]);
      // ---- for add point when search ----
    }
  }

  // ---- for prevent to type alphabet ----
  matcher(event) {
    const allowedRegex = /[NEWS'"°0-9\.\s]/g;
    if (!event.key.match(allowedRegex)) {
      event.preventDefault();
    }
  }
  // ---- for prevent to type alphabet ----

  ddTomercator() {
    let x = (document.getElementById('long') as HTMLInputElement).value;
    let y = (document.getElementById('lat') as HTMLInputElement).value;
    const coord = [parseFloat(x), parseFloat(y)];
    // const coord  = [5718482, 4260790];
    const scr = new Projection({ code: 'EPSG:4326' });
    const dest = new Projection({ code: 'EPSG:3857' });
    this.transCoord = transform(coord, scr, dest);
  }
  dmsToMercator() {
    let x = (document.getElementById('long') as HTMLInputElement).value;
    let y = (document.getElementById('lat') as HTMLInputElement).value;
    const splitX = x.split(' ');
    const splitY = y.split(' ');
    const DDX = ConvertDMSToDD(parseFloat(splitX[0]), parseFloat(splitX[1]), parseFloat(splitX[2]), splitX[3]);
    const DDY = ConvertDMSToDD(parseFloat(splitY[0]), parseFloat(splitY[1]), parseFloat(splitY[2]), splitY[3]);
    const scr = new Projection({ code: 'EPSG:4326' });
    const dest = new Projection({ code: 'EPSG:3857' });
    this.transCoord = transform([DDX, DDY], scr, dest);
    function ConvertDMSToDD(degrees, minutes, seconds, direction) {
      var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

      if (direction == 'S' || direction == 'W') {
        dd = dd * -1;
      } // Don't do anything for N or E
      return dd;
    }
  }

  DD() {
    this.markerSource.clear();
    (document.getElementById('lat') as HTMLInputElement).placeholder = '35.71213°';
    (document.getElementById('long') as HTMLInputElement).placeholder = '51.37415°';
    (document.getElementById('lat') as HTMLInputElement).value = '';
    (document.getElementById('long') as HTMLInputElement).value = '';
  }
  DMS() {
    this.markerSource.clear();
    (document.getElementById('lat') as HTMLInputElement).placeholder = ` 36° 42" 35' N `;
    (document.getElementById('long') as HTMLInputElement).placeholder = `51° 22" 31' E `;
    (document.getElementById('lat') as HTMLInputElement).value = '';
    (document.getElementById('long') as HTMLInputElement).value = '';
  }
  mercator() {
    this.markerSource.clear();
    (document.getElementById('lat') as HTMLInputElement).placeholder = '4260790';
    (document.getElementById('long') as HTMLInputElement).placeholder = '5718482';
    (document.getElementById('lat') as HTMLInputElement).value = '';
    (document.getElementById('long') as HTMLInputElement).value = '';
  }
}
