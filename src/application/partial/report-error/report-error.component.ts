import { state, style, trigger } from '@angular/animations';
import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { toStringXY } from 'ol/coordinate.js';
import { IranBoundryService } from 'src/application/shared/services/iranBoundry.service';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-report-error',
  templateUrl: './report-error.component.html',
  styleUrls: ['./report-error.component.scss'],
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
  ],
  
  //---- if encapsulation != none custom style dosent work ----
  // encapsulation: ViewEncapsulation.None
})
export class ReportErrorComponent implements OnInit, DoCheck {
  @ViewChild('reportError') reportError: NgForm;
  isopenSelect = false;
  // isInIran: boolean = true;
  errorTypes = [
    { value: '', type: 'لطفاانتخاب کنید...' },
    { value: '1', type: 'نام معبر اشتباه است' },
    { value: '2', type: 'جهت حرکت در معبر اشتباه است' },
    { value: '3', type: 'معبر اشتباه رسم شده است' },
    { value: '4', type: 'معبر بن بست است' },
    { value: '5', type: 'معبر بن بست نیست' },
    { value: '6', type: 'معبر رسم شده وجود خارجی ندارد' },
    { value: '7', type: 'معبری که در نقشه رسم نشده است' },
    { value: '8', type: 'سایر موارد' }
  ];
  optSelect = '';

  constructor(
    public mapservice: MapService,
    public publicVar: PublicVarService,
    public IranBoundry: IranBoundryService
  ) {}

  ngOnInit() {}

  ngDoCheck() {
    if (this.publicVar.isAddErrorMap) {
      this.publicVar.errorMap.getView().on('change', (evt: Event) => {
        this.address();
      });
    }
  }

  closeReportError() {
    // ----use set time uot for animation fade out ----
    setTimeout(e => {
      document.getElementById('report-error-box').style.display = 'none';
      this.reportError.reset();
    }, this.publicVar.time);
  }
  // ---- for popup animation ----
  toggleErrorReport() {
    this.publicVar.isOpenReportError = false;
  }
  // ---- for popup animation ----

  // ---- for creat custom select with custom style ----
  customSelect() {
    var x, i, j, selElmnt, a, b, c;
    /* Look for any elements with the class 'error-type-box': */
    x = document.getElementsByClassName('error-type-box');
    for (i = 0; i < x.length; i++) {
      selElmnt = x[i].getElementsByTagName('select')[0];
      /* For each element, create a new DIV that will act as the selected item: */
      a = document.createElement('DIV');
      a.setAttribute('class', 'select-selected');
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /* For each element, create a new DIV that will contain the option list: */
      b = document.createElement('DIV');
      b.setAttribute('class', 'select-items select-hide');
      for (j = 1; j < selElmnt.length; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement('DIV');
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener('click', function(e) {
          /* When an item is clicked, update the original select box,
          and the selected item: */
          var y, i, k, s, h;
          s = this.parentNode.parentNode.getElementsByTagName('select')[0];
          h = this.parentNode.previousSibling;
          for (i = 0; i < s.length; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName('same-as-selected');
              for (k = 0; k < y.length; k++) {
                y[k].removeAttribute('class');
              }
              this.setAttribute('class', 'same-as-selected');
              break;
            }
          }
          h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener('click', function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
      });
    }
    function closeAllSelect(elmnt) {
      /* A function that will close all select boxes in the document,
      except the current select box: */
      var x,
        y,
        i,
        arrNo = [];
      x = document.getElementsByClassName('select-items');
      y = document.getElementsByClassName('select-selected');
      for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i);
        } else {
          y[i].classList.remove('select-arrow-active');
        }
      }
      for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add('select-hide');
        }
      }
    }

    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener('click', closeAllSelect);
  }
  // ---- for creat custom select with custom style ----

  submit() {
    // --- send client information ----
    const submitInfo = {
      location: this.publicVar.errorMap.getView().getCenter(),
      errorType: this.reportError.value.errorType,
      description: this.reportError.value.description,
      ip: this.publicVar.ipAddress.ip,
      city: this.publicVar.clientInfo.timezone,
      browser: this.publicVar.deviceInfo.browser,
      browserVersion: this.publicVar.deviceInfo.browser_version,
      OS: this.publicVar.deviceInfo.os,
      OSVersion: this.publicVar.deviceInfo.os_version,
      deviceType: this.publicVar.deviceType
    };
    setTimeout(e => {
      this.reportError.reset();
      // ---- show succsess popup ----
      document.getElementById('error-box').style.display = 'none';
      document.getElementById('app-popup-success').style.display = 'flex';
    }, 300);
    console.log(submitInfo);
  }

  // ---- add address of error point ----
  address() {
    const inside = require('point-in-polygon');
    const getCenter = this.publicVar.errorMap.getView().getCenter();
    const StringXY = toStringXY(getCenter, 0);
    (document.getElementById('coordinate-error-map') as HTMLInputElement).value = StringXY;
    this.publicVar.isErrorMapInIran = inside(getCenter, this.IranBoundry.Iran);
  }
  // ---- add address of error point ----

  selectArrow() {
    const svg = document.getElementById('select-svg-error-report');
    this.isopenSelect = !this.isopenSelect;
    if (this.isopenSelect) {
      svg.style.transform = 'rotateX(180deg)';
    } else {
      svg.style.transform = 'none';
    }
  }
}
