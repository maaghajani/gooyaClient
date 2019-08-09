import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-popup-location',
  templateUrl: './popup-location.component.html',
  styleUrls: ['./popup-location.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          animation: ' fade-in 1s cubic-bezier(0.39, 0.575, 0.565, 1) both'
        })
      ),
      state(
        'close',
        style({
          animation: ' fade-out 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both'
        })
      )
    ])
  ]
})
export class PopupLocationComponent implements OnInit {
  constructor(public publicVar: PublicVarService) {}
  ngOnInit() {}
  toggle() {
    this.publicVar.isOpenPopupLocation = false;
  }
  closepopup() {
    // ----use set time uot for animation fade out ----
    setTimeout(e => {
      document.getElementById('full-box-popup').style.display = 'none';
    }, this.publicVar.time);
  }
}
