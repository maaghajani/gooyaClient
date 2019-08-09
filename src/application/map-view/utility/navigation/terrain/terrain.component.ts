import { Component, OnInit } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-terrain',
  template: `
    <label class="switch">
      <input id="checkboxTerrain" type="checkbox" />
      <div class="slider"></div>
    </label>
  `,
})
export class TerrainComponent implements OnInit {
  constructor(public publicVar: PublicVarService) {}

  ngOnInit() {}
  switchTerrain() {
    (document.getElementById('checkboxTerrain') as HTMLInputElement).checked = false;

    const checkbox = document.querySelector('input#checkboxTerrain') as HTMLInputElement;
    checkbox.addEventListener('change', event => {
      if (checkbox.checked) {
        this.publicVar.terrianLayer.setVisible(true);
      } else {
        this.publicVar.terrianLayer.setVisible(false);
      }
    });
  }
}
