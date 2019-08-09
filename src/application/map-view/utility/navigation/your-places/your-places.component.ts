import { FavoritWorkComponent } from './favorit-work/favorit-work.component';
import { state, style, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { DirectionComponent } from '../../direction/direction.component';
import { MenuComponent } from '../../menu/menu.component';
import { MoreSearchComponent } from '../../more-search/more-search.component';
import { FavoritHomeComponent } from './favorit-home/favorit-home.component';
import { PubliYourPlaceVariableService } from './public-YourPlace-variable.service';

@Component({
  selector: 'app-your-places',
  templateUrl: './your-places.component.html',
  styleUrls: ['./your-places.component.scss'],
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
export class YourPlacesComponent implements OnInit {
  constructor(
    public publicVar: PublicVarService,
    public publicVarYourPlace: PubliYourPlaceVariableService,
    public menu: MenuComponent,
    public moreSearch: MoreSearchComponent,
    public direction: DirectionComponent,
    public favoritHome: FavoritHomeComponent,
    public favoritWork: FavoritWorkComponent
  ) {}

  ngOnInit() {}

  closePlaces() {
    this.publicVarYourPlace.closePlace();
    this.publicVarYourPlace.isOpenHome = true;
    this.publicVarYourPlace.isOpenWork = true;
    // this.favoritHome.openHome();
    // this.favoritWork.openWork();
  }

  closeHome() {
    this.publicVarYourPlace.isOpenHome = true;
    this.favoritHome.openHome();
  }
  closeWork() {
    this.publicVarYourPlace.isOpenWork = true;
    this.favoritWork.openWork();
  }
}
