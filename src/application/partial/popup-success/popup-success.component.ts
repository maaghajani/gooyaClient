import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss'],
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
export class PopupSuccessComponent implements OnInit {
  constructor(public publicVar: PublicVarService) {}
  toggle() {
    if (this.publicVar.isOpenReportError) {
      this.publicVar.isOpenReportError = false;
    } else if (this.publicVar.isOpenMissingPlace) {
      this.publicVar.isOpenMissingPlace = false;
    }
  }
  ngOnInit() {}
  closeReportError() {
    // ----use set time uot for animation fade out ----
    if (this.publicVar.isOpenReportError) {
      setTimeout(e => {
        document.getElementById('report-error-box').style.display = 'none';
        document.getElementById('error-box').style.display = 'block';
        document.getElementById('app-popup-success').style.display = 'none';
      }, this.publicVar.time);
    } else if (this.publicVar.isOpenMissingPlace) {
      setTimeout(e => {
        document.getElementById('missing-place-box').style.display = 'none';
        document.getElementById('missing-box').style.display = 'block';
        document.getElementById('popup-missing-success').style.display = 'none';
      }, this.publicVar.time);
    }
  }
}
