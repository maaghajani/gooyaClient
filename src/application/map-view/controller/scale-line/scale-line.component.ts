import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MapService } from '../../../shared/services/map.service';

// ol scale line
import ScaleLine from 'ol/control/ScaleLine';

@Component({
  selector: 'app-scale-line',
  template:'<div class="scale-line" id="scale-line"></div>',
  styleUrls: ['./scale-line.component.scss'],
  // because ol sltye dosent work with encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ScaleLineComponent implements OnInit {
  unit='metric'
  constructor(private mapservice: MapService) {}

  ngOnInit() {
    this.setScaleLine();
  }
  setScaleLine() {
    this.mapservice.map.addControl(
      new ScaleLine({
        units: this.unit,
        target: document.getElementById('scale-line')
      })
    );

  }


}
