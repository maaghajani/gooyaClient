import { transform } from 'ol/proj.js';
import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { PubliYourPlaceVariableService } from '../public-YourPlace-variable.service';
import { toStringXY } from 'ol/coordinate.js';
import { DirectionComponent } from '../../../direction/direction.component';
import { IranBoundryService } from 'src/application/shared/services/iranBoundry.service';

@Component({
  selector: 'app-favorit-work',
  templateUrl: './favorit-work.component.html',
  styleUrls: ['./favorit-work.component.scss']
})
export class FavoritWorkComponent implements OnInit {
  itemHeight = 60;
  existWork: boolean = true;
  isActiveEditWork = false;
  ActiveEditWorkElementIndex: number;
  ActiveDeleteWorkElementIndex: number;
  workAddresses = [
    // {addres: 'ادرس 1' , location:[]},
    // {addres: 'ادرس 2', location:[]},
    // {addres: 'ادرس 3', location:[]},
    // {addres: 'ادرس 4', location:[]},
    // {addres: 'ادرس 5', location:[]},
    // {addres: 'ادرس 6', location:[]}
  ];
  constructor(
    private mapservice: MapService,
    public publicVar: PublicVarService,
    public publicVarYourPlace: PubliYourPlaceVariableService,
    public IranBoundry: IranBoundryService,
    public direction: DirectionComponent
  ) {}

  ngOnInit() {}
  openWork() {
    const item = document.getElementById('place-item-work'); //LI
    const workAddbox = document.getElementById('place-item-work-addbox'); // dont work exist
    const workExist = document.getElementById('place-item-work-showExistLocations'); // work exist
    const workExistAddBox = document.getElementById('place-item-work-showExistLocations-addbox'); // work exist addbox
    const addresItems = document.getElementById('place-item-work-showExistLocation-box') as HTMLElement;

    if (this.publicVarYourPlace.isOpenWork) {
      item.style.height = this.itemHeight + 'px';
      workAddbox.style.display = 'none';
      workExist.style.display = 'none';
      this.publicVarYourPlace.removePoint();
      this.cancelOtherLiWork();
      this.publicVarYourPlace.isOpenWork = false;
    } else {
      this.publicVarYourPlace.isOpenWork = true;
      //---- for better show ----
      // we dont have any address
      if (this.workAddresses.length == 0) {
        console.log('donthaswork');
        item.style.height = '146px';
        setTimeout(() => {
          workAddbox.style.display = 'flex';
          this.publicVarYourPlace.CreatAddresFromPoint('place-item-work-addbox-input');
        }, 500);
      } else {
        console.log('haswork');
        workAddbox.style.display = 'none';
        item.style.height = 'auto';
        setTimeout(() => {
          workExist.style.display = 'flex';
          workExistAddBox.style.display = 'flex';
        }, 500);
      }
    }
  }

  addFirstNewWork() {
    const input = document.getElementById('place-item-work-addbox-input') as HTMLInputElement;
    const inputVal = input.value.split(',');
    this.workAddresses.push({ addres: 'ادرس 1', location: [parseFloat(inputVal[0]), parseFloat(inputVal[1])] });
    this.publicVarYourPlace.removePoint();
    this.publicVarYourPlace.isOpenWork = false;
    this.openWork();
  }

  GotoNewWork() {
    if (this.ActiveEditWorkElementIndex >= 0) {
      this.cancelEditWork(this.ActiveEditWorkElementIndex);
    }
    const creatWork = document.getElementById('place-item-work-showExistLocations-addbox-creatnew') as HTMLElement;
    const addNewWork = document.getElementById('place-item-work-showExistLocations-addbox-add') as HTMLElement;
    addNewWork.style.display = 'flex';
    creatWork.style.display = 'none';
    // create point layer
    this.publicVarYourPlace.CreatAddresFromPoint('place-item-work-addbox-add-input');
  }

  addNewWork() {
    const item = document.getElementById('place-item-work'); //LI
    const creatWork = document.getElementById('place-item-work-showExistLocations-addbox-creatnew') as HTMLElement;
    const addWork = document.getElementById('place-item-work-showExistLocations-addbox-add') as HTMLElement;
    const existLocation = document.getElementById('place-item-work-showExistLocation-box') as HTMLElement;
    const input = document.getElementById('place-item-work-addbox-add-input') as HTMLInputElement;
    const inputVal = input.value.split(',');
    addWork.style.display = 'none';
    creatWork.style.display = 'flex';
    // remove point layer
    this.publicVarYourPlace.removePoint();
    // handel height work li by browser size
    const browserHeight = document.body.offsetHeight;
    const maxHeightLiWork = browserHeight - 4 * 60 - 20; // 4 *60 for blue header and home and other place and work -20 tolerance
    if (item.offsetHeight > maxHeightLiWork) {
      // adad tajrobi bedast amadeh
      existLocation.style.maxHeight = maxHeightLiWork - 22 + 'px';
    }
    this.workAddresses.push({
      addres: 'ادرس 1' + inputVal[0],
      location: [parseFloat(inputVal[0]), parseFloat(inputVal[1])]
    });
  }
  cancelNewWork() {
    const creatWork = document.getElementById('place-item-work-showExistLocations-addbox-creatnew') as HTMLElement;
    const addNewWork = document.getElementById('place-item-work-showExistLocations-addbox-add') as HTMLElement;
    addNewWork.style.display = 'none';
    creatWork.style.display = 'flex';
    this.publicVarYourPlace.removePoint();
  }
  // --- for direct Work ----
  closePlaces() {
    this.publicVarYourPlace.closePlace();
    this.publicVarYourPlace.isOpenWork = true;
    this.openWork();
  }
  opendirectionWork(ElmentIndex) {
    this.publicVarYourPlace.removePoint();
    setTimeout(e => {
      this.closePlaces();
    }, this.publicVar.timeUtility / 4);

    setTimeout(e => {
      this.direction.openDirection();
      this.direction.getClickLoctionAddress();
      const inside = require('point-in-polygon');
      const startPoint = document.getElementById('start-point') as HTMLInputElement;
      const elementLocation = this.workAddresses[ElmentIndex].location;
      const StringCoord = toStringXY(elementLocation, 0);
      this.publicVar.isDirectionInIran = inside(elementLocation, this.IranBoundry.Iran);
      if (this.publicVar.isDirectionInIran) {
        startPoint.value = StringCoord;
      }
    }, this.publicVar.timeUtility / 3);
  }
  // --- for direct Work ----

  // --- for Edit Work ----
  openWorkEdit(ElmentIndex) {
    this.cancelOtherLiWork();
    this.ActiveEditWorkElementIndex = ElmentIndex;
    const existWork = document.getElementById('place-item-work-showExistLocation-' + ElmentIndex) as HTMLElement;
    const deletetWork = document.getElementById(
      'place-item-home-showExistLocation-editWork-' + ElmentIndex
    ) as HTMLElement;
    existWork.style.display = 'none';
    deletetWork.style.display = 'flex';
    this.publicVarYourPlace.CreatAddresFromPoint('place-item-home-showExistLocation-editWork-input-' + ElmentIndex);
    console.log(this.workAddresses);
  }

  cancelEditWork(ElmentIndex) {
    this.ActiveEditWorkElementIndex = -1;
    const existWork = document.getElementById('place-item-work-showExistLocation-' + ElmentIndex) as HTMLElement;
    const deletetWork = document.getElementById(
      'place-item-home-showExistLocation-editWork-' + ElmentIndex
    ) as HTMLElement;
    existWork.style.display = 'flex';
    deletetWork.style.display = 'none';
    this.publicVarYourPlace.removePoint();
  }

  saveEditWork(ElmentIndex) {
    this.ActiveEditWorkElementIndex = -1;
    //for go bak to home
    const existWork = document.getElementById('place-item-work-showExistLocation-' + ElmentIndex) as HTMLElement;
    const deletetWork = document.getElementById(
      'place-item-home-showExistLocation-editWork-' + ElmentIndex
    ) as HTMLElement;
    const input = document.getElementById(
      'place-item-home-showExistLocation-editWork-input-' + ElmentIndex
    ) as HTMLInputElement;
    const inputVal = input.value.split(',');
    existWork.style.display = 'flex';
    deletetWork.style.display = 'none';
    this.workAddresses[ElmentIndex] = {
      addres: 'ادرس' + inputVal[0],
      location: [parseFloat(inputVal[0]), parseFloat(inputVal[1])]
    };
    console.log(this.workAddresses);

    this.publicVarYourPlace.removePoint();
  }

  // --- for Edit Work ----
  deleteWork(ElmentIndex) {
    this.cancelOtherLiWork();
    this.ActiveDeleteWorkElementIndex = ElmentIndex;
    const existWork = document.getElementById('place-item-work-showExistLocation-' + ElmentIndex) as HTMLElement;
    const deletetWork = document.getElementById(
      'place-item-work-showExistLocation-deleteWork-' + ElmentIndex
    ) as HTMLElement;
    existWork.style.display = 'none';
    deletetWork.style.display = 'flex';
  }

  YesDeleteWork(ElmentIndex) {
    this.ActiveDeleteWorkElementIndex = -1;
    this.workAddresses.splice(ElmentIndex, 1);
    if (this.workAddresses.length == 0) {
      this.openWork();
      this.openWork();
    }
    console.log(this.workAddresses);
  }

  NoDeleteWork(ElmentIndex) {
    this.ActiveDeleteWorkElementIndex = -1;
    const existWork = document.getElementById('place-item-work-showExistLocation-' + ElmentIndex) as HTMLElement;
    const deletetWork = document.getElementById(
      'place-item-work-showExistLocation-deleteWork-' + ElmentIndex
    ) as HTMLElement;
    deletetWork.style.display = 'none';
    existWork.style.display = 'flex';
  }

  cancelOtherLiWork() {
    this.cancelNewWork();
    if (this.ActiveDeleteWorkElementIndex >= 0) {
      this.NoDeleteWork(this.ActiveDeleteWorkElementIndex);
    }
    if (this.ActiveEditWorkElementIndex >= 0) {
      this.cancelEditWork(this.ActiveEditWorkElementIndex);
    }
  }
}
