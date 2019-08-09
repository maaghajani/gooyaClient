import { state, style, trigger } from '@angular/animations';
import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { toStringXY } from 'ol/coordinate.js';
import { IranBoundryService } from 'src/application/shared/services/iranBoundry.service';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-add-missing-place',
  templateUrl: './add-missing-place.component.html',
  styleUrls: ['./add-missing-place.component.scss'],
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
export class AddMissingPlaceComponent implements OnInit, DoCheck {
  isopenSelect: boolean = false;
  categoryType = [
    { value: '', type: 'لطفاانتخاب کنید...' },
    { value: '1', type: 'مراکز حمل و نقل' },
    { value: '2', type: 'مراکز خرید' },
    { value: '3', type: 'مکانهای تفریحی' },
    { value: '4', type: 'مکانهای توریستی' },
    { value: '5', type: 'رستوران و کافی شاپ' },
    { value: '6', type: 'مراکز دولتی' },
    { value: '7', type: 'اورژانسها' },
    { value: '8', type: 'مراکز اقامتی' },
    { value: '9', type: 'مراکز خدماتی' },
    { value: '10', type: 'بانک ها و موسسات مالی' },
    { value: '12', type: 'مراکز آموزشی و فرهنگی' },
    { value: '13', type: 'مراکز مذهبی' },
    { value: '14', type: 'آرامگاه' },
    { value: '16', type: 'شرکت های خودرو سازی' },
    { value: '17', type: 'مراکز تولیدی' },
    { value: '19', type: 'شرکت های بیمه' },
    { value: '0', type: 'سایر موارد' }
  ];
  misingSelect = '';

  @ViewChild('missingPlace') MissingPlace: NgForm;
  constructor(
    public mapservice: MapService,
    public publicVar: PublicVarService,
    public IranBoundry: IranBoundryService
  ) {}

  ngOnInit() {}

  ngDoCheck() {
    if (this.publicVar.isAddmissingMap) {
      this.publicVar.missingMap.getView().on('change', (evt: Event) => {
        this.missingAddress();
      });
    }
  }

  closeMissingPlace() {
    // ----use set time uot for animation fade out ----
    setTimeout(e => {
      document.getElementById('missing-place-box').style.display = 'none';
      this.MissingPlace.reset();
    }, this.publicVar.time);
  }
  // ---- for popup animation ----
  toggleMissingPlace() {
    this.publicVar.isOpenMissingPlace = false;
  }
  // ---- for popup animation ----

  submit() {
    const submitInfo = {
      placeName: this.MissingPlace.value.nameMissing,
      category: this.MissingPlace.value.category,
      phone: this.MissingPlace.value.phone,
      postalCode: this.MissingPlace.value.postalCode,
      address: this.MissingPlace.value.addressWrong,
      location: this.publicVar.missingMap.getView().getCenter(),
      ip: this.publicVar.ipAddress.ip,
      city: this.publicVar.clientInfo.city,
      browser: this.publicVar.deviceInfo.browser,
      browserVersion: this.publicVar.deviceInfo.browser_version,
      OS: this.publicVar.deviceInfo.os,
      OSVersion: this.publicVar.deviceInfo.os_version,
      deviceType: this.publicVar.deviceType
    };
    console.log(submitInfo);
    setTimeout(e => {
      this.MissingPlace.reset();
      // ---- show succsess popup ----
      document.getElementById('missing-box').style.display = 'none';
      document.getElementById('popup-missing-success').style.display = 'flex';
    }, 300);
  }

  // ---- add address of error point ----
  missingAddress() {
    const inside = require('point-in-polygon');
    const getCenter = this.publicVar.missingMap.getView().getCenter();
    const StringXY = toStringXY(getCenter, 0);
    (document.getElementById('missing-address') as HTMLInputElement).value = StringXY;
    this.publicVar.isMisingMapInIran = inside(getCenter, this.IranBoundry.Iran);
  }
  // ---- add address of error point ----

  selectArrow() {
    const svg = document.getElementById('select-svg-missing');
    this.isopenSelect = !this.isopenSelect;
    if (this.isopenSelect) {
      svg.style.transform = 'rotateX(180deg)';
    } else {
      svg.style.transform = 'none';
    }
  }
  matcher(event) {
    const allowedRegex = /[0-9]/;
    if (!event.key.match(allowedRegex)) {
      event.preventDefault();
    }
  }
}
