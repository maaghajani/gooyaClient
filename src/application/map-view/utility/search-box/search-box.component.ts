import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapService } from './../../../shared/services/map.service';
import { transform } from 'ol/proj.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchResultComponent } from './../search-result/search-result.component';
import { SearchService } from './search.service';
@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  animations: [
    trigger('moreState', [
      state(
        'inactive',
        style({
          transform: 'translateY(0)', // X (0)
        })
      ),
      state(
        'active',
        style({
          transform: 'translateY(100%)', // X (100px)
        })
      ),
      transition('* => active', [animate('0.5s')]),
    ]),
  ],
})
export class SearchBoxComponent implements OnInit {
  searchUrl;
  currentState = 'inactive';

  openMore(): void {
    this.currentState = this.currentState === 'inactive' ? 'active' : 'inactive';
  }
  constructor(
    private mapservice: MapService,
    public searchResult: SearchResultComponent,
    private searchService: SearchService
  ) {}

  ngOnInit() {}

  Search(sreachTxt: HTMLInputElement) {
    if (sreachTxt.value.length > 0) {
      const mapCenter = this.mapservice.map.getView().getCenter();
      const mapCenterTransform: Array<number> = transform(mapCenter, this.mapservice.project, 'EPSG:4326');
      const loction = mapCenterTransform.join(',');
      const url = 'http://place.frdid.com/api/place/nearbysearch/?query=' + sreachTxt.value + '&location=' + loction;
      this.searchService.SearchUrl = url;
    }
  }
}
