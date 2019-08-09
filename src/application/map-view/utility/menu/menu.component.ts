import { Component, OnInit } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { MoreSearchComponent } from './../more-search/more-search.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    constructor(public moreSearch: MoreSearchComponent, public publicVar: PublicVarService) { }

  openNavigation() {
    this.publicVar.isOpenNavigation = true;
    document.getElementById('navigation').style.display = 'block';
    this.moreSearch.closeNavmore();
    setTimeout(() => {
      document.getElementById('dis').style.display = 'block';
    }, 250);
  }

  ngOnInit() { }
}
