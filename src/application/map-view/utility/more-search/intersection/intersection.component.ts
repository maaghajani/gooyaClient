import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { MenuComponent } from '../../menu/menu.component';


@Component({
  selector: 'app-intersection',
  templateUrl: './intersection.component.html',
  styleUrls: ['./intersection.component.scss'],
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
export class IntersectionComponent implements OnInit {
  StringXY: string = null;

  constructor(public publicVar: PublicVarService, public menu:MenuComponent) { }

  ngOnInit() {

  }
  // ---- when press enter go to next input ----
  nextInput() {
    const intersect1 = (document.getElementById('intersect1') as HTMLInputElement).value;
    if (intersect1 != '') {
      document.getElementById('intersect2').focus();
    }
  }
  // ---- when press enter go to next input ----

  closeIntersection() {
    this.publicVar.isOpenIntersect = false;
    setTimeout(e => {
      document.getElementById('intersect').style.display = 'none';
    }, this.publicVar.timeUtility);
  }

  searchIntersect() {
    // do something
  }
}
