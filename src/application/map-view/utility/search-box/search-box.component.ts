import { Component, OnInit } from '@angular/core';
import { trigger,state,style,transition,animate } from '@angular/animations';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  animations: [
    trigger('moreState', [
      state('inactive', style({
        transform: 'translateY(0)' // X (0)
      })),
      state('active', style({
        transform: 'translateY(100%)' // X (100px)
      })),
      transition('* => active', [
        animate('0.5s')
      ])
    ])
  ]
})
export class SearchBoxComponent implements OnInit {
  currentState = 'inactive';
  openMore(): void {

      this.currentState = this.currentState === 'inactive' ? 'active' : 'inactive';
    // document.getElementById('more').style.display = 'block';
  }
  constructor() { }

  ngOnInit() {
  }



}
// export class TooltipOverviewExample {}
export class TooltipCustomClassExample {}
