import { Component, OnInit } from '@angular/core';
import { toStringXY } from 'ol/coordinate.js';
import Map from 'ol/Map';
import View from 'ol/View';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { BaseMapComponent } from '../../base-map/base-map.component';
import { IranBoundryService } from 'src/application/shared/services/iranBoundry.service';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-send-feedback',
  template: `
    <div class="send-feedback" (click)="showReportError(); closeOtherElement(); addMap(); toggleErrorReport()">
      <span>ارسال بازخورد</span>
    </div>
  `,
  styleUrls: ['./send-feedback.component.scss']
})
export class SendFeedbackComponent implements OnInit {
  Map: Map;

  constructor(
    public mapservice: MapService,
    public publicVar: PublicVarService,
    private baseMap: BaseMapComponent,
    public IranBoundry: IranBoundryService
  ) {}

  ngOnInit() {}
  showReportError() {
    document.getElementById('report-error-box').style.display = 'block';
    // ---- for when box  open 'لطفا انتخاب ....'  selected
    (document.getElementById('error-type') as HTMLSelectElement).selectedIndex = 0;
  }
  closeOtherElement() {
    this.baseMap.closeOtherElement();
  }

  // ---- this function for add map in report error ---
  // ---- if write this function in report-error component ol map dont work ----
  addMap() {
    const inside = require('point-in-polygon');
    const extentBaseMap = this.mapservice.map.getView().calculateExtent(this.mapservice.map.getSize());
    // ---- create new Map ----
    if (!this.publicVar.isAddErrorMap) {
      this.publicVar.isAddErrorMap = true;
      this.publicVar.errorMap = new Map({
        target: 'error-map',
        view: new View({
          projection: this.mapservice.project,
          center: [this.mapservice.centerX, this.mapservice.centerY],
          zoom: this.mapservice.map.getView().getZoom(),
          extent: [4786738, 2875744, 7013127, 4721671]
        }),
        layers: [this.publicVar.AreaLAyer, this.publicVar.MapLayer],
        controls: [],
        renderer: 'canvas'
      });
    }
    this.publicVar.errorMap.getView().fit([extentBaseMap[0], extentBaseMap[1], extentBaseMap[2], extentBaseMap[3]]);
    // ---- for set address value  ----
    const addressValue = this.publicVar.errorMap.getView().getCenter();
    const StringAddressValue = toStringXY(addressValue, 0);
    (document.getElementById('coordinate-error-map') as HTMLInputElement).value = StringAddressValue;
    this.publicVar.isErrorMapInIran = inside(addressValue, this.IranBoundry.Iran);
    // ---- for set address value  ----
  }

  // ---- this function for add map in report error ---

  // ---- for popup animation ----
  toggleErrorReport() {
    this.publicVar.isOpenReportError = true;
  }
  // ---- for popup animation ----
}
