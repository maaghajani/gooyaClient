import { Component, OnInit } from '@angular/core';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-more-search',
  templateUrl: './more-search.component.html',
  styleUrls: ['./more-search.component.scss']
})
export class MoreSearchComponent implements OnInit {
  constructor(public publicVar: PublicVarService) {}

  ngOnInit() {}

  searchNone() {
    document.getElementById('more').style.height = '113px';
    document.getElementById('ul-more').style.display = 'block';
    document.getElementById('link-more').style.display = 'none';
    document.getElementById('link-close').style.opacity = '1';
    setTimeout(() => {
      document.getElementById('ul-more').style.opacity = '1';
    }, 100);
    setTimeout(e => {
      document.getElementById('link-close').style.display = 'flex';
    }, 400);
  }

  closeNavmore() {
    document.getElementById('more').style.height = '38px';
    document.getElementById('link-close').style.display = 'none';
    document.getElementById('ul-more').style.display = 'none';
    setTimeout(() => {
      document.getElementById('link-more').style.display = 'flex';
    }, 350);
    setTimeout(() => {
      document.getElementById('ul-more').style.opacity = '0';
    }, 500);
  }

  ///////////////////////// open & closed alternatives of search///////////////////////////////

  openStreet() {
    document.getElementById('street').style.display = 'block';
    (document.getElementById('street-input') as HTMLInputElement).focus();
    this.publicVar.isOpenStreet = true;
  }
  openIntersction() {
    document.getElementById('intersect').style.display = 'block';
    (document.getElementById('intersect1') as HTMLInputElement).focus();
    this.publicVar.isOpenIntersect = true;
  }
  openPoi() {
    document.getElementById('poi').style.display = 'block';
    (document.getElementById('point') as HTMLInputElement).focus();
    this.publicVar.isOpenPoi = true;
  }
  opencoordinate() {
    document.getElementById('coordinate').style.display = 'block';
    (document.getElementById('lat') as HTMLInputElement).focus();
    this.publicVar.isOpenCoordinate = true;
  }
}
