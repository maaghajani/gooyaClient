import { Component, OnInit } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.scss'],
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
export class StreetComponent implements OnInit {
  ol: any;
  latitude: number;
  longitude: number;
  map: any;

  constructor(public publicVar: PublicVarService, public menu: MenuComponent) {}

  ngOnInit() {}

  closeStreet() {
    this.publicVar.isOpenStreet = false;
    setTimeout(e => {
      document.getElementById('street').style.display = 'none';
    }, this.publicVar.timeUtility);
  }
}
