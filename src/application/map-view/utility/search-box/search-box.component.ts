import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { transform } from 'ol/proj.js';
import { MapService } from './../../../shared/services/map.service';
import { SearchResultComponent } from './../search-result/search-result.component';
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
  ) {}

  ngOnInit() {}

  Search(sreachTxt: HTMLInputElement) {
    if (sreachTxt.value.length > 0) {
      const mapCenter = this.mapservice.map.getView().getCenter();
      const mapCenterTransform: Array<number> = transform(mapCenter, this.mapservice.project, 'EPSG:4326');
      const loction = mapCenterTransform.join(',');
      const url = 'http://place.frdid.com/api/place/nearbysearch/?query=' + sreachTxt.value + '&location=' + loction;
      this.searchResult.openSearchResult(url);
    }
  }
}
