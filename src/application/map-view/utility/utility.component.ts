import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-utility',
  template: `
    <div id="utility" class="utility row">
      <app-menu class="col-1"></app-menu>
      <div class="search-box-container col-9"></div>
      <hr />
      <app-direction class="col-1"></app-direction>
    </div>
    <app-more-search id="more-search"></app-more-search>
  `,
  styleUrls: ['./utility.component.scss']
})
export class UtilityComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
