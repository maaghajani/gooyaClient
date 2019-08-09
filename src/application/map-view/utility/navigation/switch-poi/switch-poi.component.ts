import { Component, OnInit } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { MapService } from 'src/application/shared/services/map.service';

@Component({
  selector: 'app-switch-poi',
  template: `
    <label class="switch">
      <input id="checkboxSwitchPOI" type="checkbox" />
      <div class="slider"></div>
    </label>
  `,
})
export class SwitchPoiComponent implements OnInit {
  constructor(public mapservice: MapService, public publicVar: PublicVarService) {}

  ngOnInit() {}

  switchPOI() {
    (document.getElementById('checkboxSwitchPOI') as HTMLInputElement).checked = true;

    const checkbox = document.querySelector('input#checkboxSwitchPOI') as HTMLInputElement;

    // if (!this.publicVar.poiLayer.getVisible()) {
    //   this.publicVar.poiLayer.setVisible(true);
    // }

    checkbox.addEventListener('change', event => {
      if (checkbox.checked) {
        this.publicVar.poiLayer.setVisible(true);
      } else {
        // do that
        this.publicVar.poiLayer.setVisible(false);
      }
    });
  }
}
