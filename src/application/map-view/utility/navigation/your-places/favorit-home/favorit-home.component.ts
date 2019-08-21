import { Component, OnInit } from '@angular/core';
import { IranBoundryService } from 'src/application/shared/services/iranBoundry.service';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { PubliYourPlaceVariableService } from '../public-YourPlace-variable.service';
import { DirectionComponent } from './../../../direction/direction.component';

@Component({
  selector: 'app-favorit-home',
  templateUrl: './favorit-home.component.html',
  styleUrls: ['./favorit-home.component.scss'],
})
export class FavoritHomeComponent implements OnInit {
  // ----for home ----
  existHome: boolean = false;
  homeAddres: string;
  homelocation: Array<number> = [5723891.316850067, 4264880.430199694];
  itemHeight = '60px';
  // ----for home ----
  constructor(
    private mapservice: MapService,
    public publicVar: PublicVarService,
    public publicVarYourPlace: PubliYourPlaceVariableService,
    public IranBoundry: IranBoundryService,
    public direction: DirectionComponent
  ) {}

  ngOnInit() {}

  // ----this function for save Home location ----

  // in this function has 2 part ,part 1 if home open ,we must close home with click and remove Point
  /// part 2 has 2 section:section 1 if Location of home exist , we must show location and when click on it , map goes to that location
  // section 2 : if Location of home does not exist, we must get user's home Location and save that
  openHome() {
    const item = document.getElementById('place-item-home');
    const homeAddbox = document.getElementById('place-item-home-addbox');
    const input = document.getElementById('place-item-home-addbox-input') as HTMLInputElement;
    const homeExist = document.getElementById('place-item-home-showExistLocation');
    const homeEdit = document.getElementById('place-item-home-showExistLocation-editHomeBox');
    const homeDelete = document.getElementById('place-item-home-showExistLocation-deleteHome');
    if (this.publicVarYourPlace.isOpenHome) {
      item.style.height = this.itemHeight;
      homeAddbox.style.display = 'none';
      homeExist.style.display = 'none';
      homeEdit.style.display = 'none';
      homeDelete.style.display = 'none';
      this.publicVarYourPlace.removePoint();
      this.publicVarYourPlace.isOpenHome = false;
    } else {
      this.publicVarYourPlace.isOpenHome = true;
      // if Location of home exist
      if (this.existHome) {
        // show add loaction div
        item.style.height = '100px';
        // ---- for better show ----
        setTimeout(() => {
          homeExist.style.display = 'flex';
        }, 500);

        this.homeAddres = 'اسدی ، ستارخان، منطقه 5 ، تهران';
        // this.homelocation = [31, 52];
      } else {
        // if Location of home does not exist
        // show add loaction div
        item.style.height = '146px';
        // ---- for better show ----
        setTimeout(() => {
          homeAddbox.style.display = 'flex';
        }, 500);
        this.publicVarYourPlace.CreatAddresFromPoint('place-item-home-addbox-input', undefined, undefined);
      }
    }
  }
  // ----home addBox function ----
  addNewHome() {
    const homeAddbox = document.getElementById('place-item-home-addbox');
    homeAddbox.style.display = 'none';
    this.existHome = true;
    this.publicVarYourPlace.isOpenHome = false;
    this.publicVarYourPlace.removePoint();
    this.openHome();
  }
  // ----home addBox function ----

  // ----home exist function ----
  // -----if use your palace component give error =>WARNING in Circular dependency detected, so we shuold write
  closePlaces() {
    this.publicVarYourPlace.closePlace();
    this.publicVarYourPlace.isOpenHome = true;
    this.openHome();
  }
  opendirectionHome() {
    this.publicVarYourPlace.removePoint();
    setTimeout(e => {
      this.closePlaces();
    }, this.publicVar.timeUtility / 4);

    setTimeout(e => {
      this.direction.openDirection();
      this.direction.getClickLoctionAddress();
      this.direction.setAddressPoint(this.homelocation);
    }, this.publicVar.timeUtility / 3);
  }

  openHomeEdit() {
    const item = document.getElementById('place-item-home');
    const homeExist = document.getElementById('place-item-home-showExistLocation');
    const homeEdit = document.getElementById('place-item-home-showExistLocation-editHomeBox');
    const input = document.getElementById('place-item-home-showExistLocation-editHomeBox-input') as HTMLInputElement;
    item.style.height = '146px';
    homeExist.style.display = 'none';
    homeEdit.style.display = 'flex';
    this.publicVarYourPlace.CreatAddresFromPoint(
      'place-item-home-showExistLocation-editHomeBox-input',
      undefined,
      undefined
    );
  }
  cancelEditHome() {
    this.publicVarYourPlace.removePoint();
    const item = document.getElementById('place-item-home');
    const homeExist = document.getElementById('place-item-home-showExistLocation');
    const homeEdit = document.getElementById('place-item-home-showExistLocation-editHomeBox');
    item.style.height = '100px';
    homeExist.style.display = 'flex';
    homeEdit.style.display = 'none';
  }
  saveEditHome() {
    // for go bak to home
    this.cancelEditHome();
  }
  deleteHome() {
    const homeExist = document.getElementById('place-item-home-showExistLocation');
    const homeDelete = document.getElementById('place-item-home-showExistLocation-deleteHome');
    homeExist.style.display = 'none';
    homeDelete.style.display = 'flex';
  }
  YesDeleteHome() {
    const homeDelete = document.getElementById('place-item-home-showExistLocation-deleteHome');
    homeDelete.style.display = 'none';
    this.existHome = false;
    this.publicVarYourPlace.isOpenHome = false;
    this.openHome();
  }
  NoDeleteHome() {
    const homeExist = document.getElementById('place-item-home-showExistLocation');
    const homeDelete = document.getElementById('place-item-home-showExistLocation-deleteHome');
    homeExist.style.display = 'flex';
    homeDelete.style.display = 'none';
  }

  // ----home exist function ----
  addPlaces() {
    // console.log(this.mapservice.map.getLayers());
  }
}
