import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Zoom from 'ol/control/Zoom';
import { MapService } from '../../../shared/services/map.service';

@Component({
  selector: 'app-zoom',
  template:'<div class="zoom-controller" id="zoom-controller" appTooltips="بزرگنمایی" placement="right" delay="500"></div>',
  styleUrls: ['./zoom.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZoomComponent implements OnInit {

  constructor(private mapservice: MapService) { }

  ngOnInit() {
    this.setZoom();
    this.setZoomSvg();
  }

  setZoom() {
    this.mapservice.map.addControl(new Zoom({
      zoomInTipLabel: '',
      zoomOutTipLabel: '',
      target: document.getElementById('zoom-controller')
    }));
  }

  // set svg icon to button
  setZoomSvg() {
    document.getElementsByClassName('ol-zoom-in').item(0).innerHTML = `
    <svg height="30px" viewBox="0 0 448 448" width="30px">
      <path d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0
       4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0
       22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0
        40-17.910156 40-40s-17.910156-40-40-40zm0 0"/>
    </svg>`;

    document.getElementsByClassName('ol-zoom-out').item(0).innerHTML = `
    <svg x="0px" y="0px"
	 width="30px" height="30px" viewBox="0 0 401.991 401.991" style="enable-background:new 0 0 401.991 401.991;">
<g>
	<path d="M394,154.174c-5.331-5.33-11.806-7.995-19.417-7.995H27.406c-7.611,0-14.084,2.665-19.414,7.995
		C2.662,159.503,0,165.972,0,173.587v54.82c0,7.617,2.662,14.086,7.992,19.41c5.33,5.332,11.803,7.994,19.414,7.994h347.176
		c7.611,0,14.086-2.662,19.417-7.994c5.325-5.324,7.991-11.793,7.991-19.41v-54.82C401.991,165.972,399.332,159.5,394,154.174z"/>
</g>
</svg>`;
  }

  setTooltip() {

  }
  // end
}
