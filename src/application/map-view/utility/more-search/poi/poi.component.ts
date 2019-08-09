import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        animation: 'slide-left 0.5s ease-in-out both'
      })),
      state('close', style({
        animation: 'slide-right 0.5s ease-in-out both'
      }))
    ])
  ]
})
export class PoiComponent implements OnInit {
  ol: any;
  latitude: number;
  longitude: number;
  map: any;

  constructor(public publicVar: PublicVarService, public menu: MenuComponent) { }

  ngOnInit() { }

  closePoi() {
    this.publicVar.isOpenPoi = false;
    setTimeout(() => {
      document.getElementById('poi').style.display = 'none';
    }, this.publicVar.timeUtility);
  }


}



