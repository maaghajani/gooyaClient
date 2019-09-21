import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { transform } from 'ol/proj.js';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  resultTotal;
  searchResults = [
    {
      id: '4ecff356-8bf7-4eb8-80f7-12924145760a',
      name: 'علی فراش',
      language: 'fa',
      coordinateDocument: {
        lat: 39.62535092000007,
        lon: 44.51878946700003,
      },
      cityName: '',
      suburbName: 'شهرستان ماکو',
      distanceKM: 1900.0702736821959,
      type: 'STREET',
    },
    {
      id: '2a2a02c6-e81a-4096-bb0d-e7c495bb10b7',
      name: 'علی قندو',
      language: 'fa',
      coordinateDocument: {
        lat: 39.370531174000064,
        lon: 44.57332915100005,
      },
      cityName: '',
      suburbName: 'شهرستان ماکو',
      distanceKM: 1927.6962549665996,
      type: 'POI',
    },
    {
      id: '80ba3569-02e5-4379-806e-3b5c813629d8',
      name: 'مسجد علی ابن ابیطالب',
      language: 'fa',
      coordinateDocument: {
        lat: 39.290294922000044,
        lon: 44.45617095500006,
      },
      cityName: 'شهرک ولیعصر',
      suburbName: 'شهرک ولیعصر',
      distanceKM: 1931.5340643789086,
      type: 'POI',
    },
    {
      id: '7d853250-4353-49f4-b6b9-552079dbb55d',
      name: 'علی کندی',
      language: 'fa',
      coordinateDocument: {
        lat: 39.26935683200003,
        lon: 44.771615137000026,
      },
      cityName: '',
      suburbName: 'شهرستان شوط',
      distanceKM: 1945.1367198229857,
      type: 'POI',
    },
    {
      id: '1bdaee92-64be-4950-b085-489b0ed6fb0a',
      name: 'حسین علی کندی عجم',
      language: 'fa',
      coordinateDocument: {
        lat: 39.277008488000035,
        lon: 44.893359117000045,
      },
      cityName: '',
      suburbName: 'شهرستان پلدشت',
      distanceKM: 1948.8604089017244,
      type: 'POI',
    },
    {
      id: '0462bb09-1c20-4fd4-9234-8b4e4a9e1cc1',
      name: 'علی نظر',
      language: 'fa',
      coordinateDocument: {
        lat: 39.256192448000036,
        lon: 45.00795735500003,
      },
      cityName: '',
      suburbName: 'شهرستان پلدشت',
      distanceKM: 1955.2052165871314,
      type: 'STREET',
    },
    {
      id: '1069c5d8-d7fb-4acd-885a-231de6ac78a5',
      name: 'علی نظر',
      language: 'fa',
      coordinateDocument: {
        lat: 39.23423401900004,
        lon: 45.05697085400004,
      },
      cityName: '',
      suburbName: 'شهرستان پلدشت',
      distanceKM: 1959.2338245264034,
      type: 'POI',
    },
    {
      id: 'daef1bbd-7b84-4fa4-bf8d-0597293e8f32',
      name: 'علی پسند',
      language: 'fa',
      coordinateDocument: {
        lat: 38.959779586000025,
        lon: 44.40283256600003,
      },
      cityName: '',
      suburbName: 'شهرستان چالدران',
      distanceKM: 1963.0538126273195,
      type: 'POI',
    },
    {
      id: '5e12c1b5-46e4-4df6-9ce0-579153449509',
      name: 'علیمردان',
      language: 'fa',
      coordinateDocument: {
        lat: 39.04792263600007,
        lon: 44.66523093200004,
      },
      cityName: '',
      suburbName: 'شهرستان چالدران',
      distanceKM: 1963.5597684132572,
      type: 'POI',
    },
    {
      id: '63c69d3f-b948-4a63-b114-ed25e64bd737',
      name: 'علی کندی | محمود کن',
      language: 'fa',
      coordinateDocument: {
        lat: 39.017948545000024,
        lon: 44.95087225200007,
      },
      cityName: '',
      suburbName: 'شهرستان شوط',
      distanceKM: 1977.0154959940432,
      type: 'POI',
    },
    {
      id: '17ecfe47-1585-4b67-90e2-24897816dd54',
      name: 'علی شیخ',
      language: 'fa',
      coordinateDocument: {
        lat: 38.82159683100008,
        lon: 44.579518258000064,
      },
      cityName: '',
      suburbName: 'شهرستان خوی',
      distanceKM: 1983.3552823503362,
      type: 'POI',
    },
    {
      id: '6ae08f09-6c22-46b8-a6c9-8cf974229f9b',
      name: 'کارواش علی',
      language: 'fa',
      coordinateDocument: {
        lat: 38.94390160000006,
        lon: 45.64106760000004,
      },
      cityName: 'شهر جلفا',
      suburbName: 'جلفا',
      distanceKM: 2010.3149440735097,
      type: 'POI',
    },
    {
      id: 'db5e7925-4066-4ca7-8694-96b0a7f3eff6',
      name: 'قوچ علی کندی',
      language: 'fa',
      coordinateDocument: {
        lat: 38.79312270300005,
        lon: 45.39278668800006,
      },
      cityName: '',
      suburbName: 'شهرستان مرند',
      distanceKM: 2016.008530096903,
      type: 'POI',
    },
    {
      id: '65365119-d992-4942-9cca-e3d818e6ea05',
      name: 'السرمه | علی سورمه',
      language: 'fa',
      coordinateDocument: {
        lat: 38.43272709800004,
        lon: 44.513230349000025,
      },
      cityName: '',
      suburbName: 'شهرستان خوی',
      distanceKM: 2020.4795412093333,
      type: 'POI',
    },
    {
      id: 'b5a50e66-d9bc-4b79-9f5a-9ef2d3c712db',
      name: 'کافه علی اکبرلو',
      language: 'fa',
      coordinateDocument: {
        lat: 38.55262550600003,
        lon: 44.93042520300003,
      },
      cityName: 'شهر خوی',
      suburbName: 'شمال',
      distanceKM: 2023.1983013897861,
      type: 'POI',
    },
    {
      id: 'f1156aac-3954-4530-a3e0-0fc54cea3618',
      name: 'شانزده متری علی آباد',
      language: 'fa',
      coordinateDocument: {
        lat: 38.55554019700003,
        lon: 44.96987850800008,
      },
      cityName: 'شهر خوی',
      suburbName: 'شمال',
      distanceKM: 2024.3331006355384,
      type: 'STREET',
    },
    {
      id: 'f9bce2f8-4a24-44c5-8ae6-09de8a4f58db',
      name: 'رستوران حاج علی',
      language: 'fa',
      coordinateDocument: {
        lat: 38.55145441500008,
        lon: 44.96078117700006,
      },
      cityName: 'شهر خوی',
      suburbName: 'شمال',
      distanceKM: 2024.4161403940832,
      type: 'POI',
    },
    {
      id: '4d007ef8-06e9-452c-8449-efbe993f8536',
      name: 'شانزده متری علی آباد',
      language: 'fa',
      coordinateDocument: {
        lat: 38.55317627900007,
        lon: 44.96983932000006,
      },
      cityName: 'شهر خوی',
      suburbName: 'جنوب',
      distanceKM: 2024.5705734721043,
      type: 'STREET',
    },
  ];
  constructor(private httpClient: HttpClient, public publicVar: PublicVarService, private mapservice: MapService) {}
  ngOnInit() {}

  openSearchResult(URL) {
      // this.httpClient
      //   .get(url)
      //   .toPromise()
      //   .then(searchResultResponse => {
      //     // this.searchResult = searchResultResponse;
      //     console.log(searchResultResponse)
      //   });

      (document.getElementById('streetTabRadio') as HTMLInputElement).checked = true;
      document.getElementById('search-result').style.display = 'block';
      document.getElementById('utility').style.zIndex = '1';
      document.getElementById('utility').style.position = 'absolute';
      document.getElementById('utility').style.boxShadow = 'none';
      document.getElementById('dirct-icon').style.display = 'none';
      this.publicVar.isOpenSearchResult = true;

}

  closeSearch() {
    document.getElementById('search-result').style.display = 'none';
    document.getElementById('utility').style.zIndex = '0';
    document.getElementById('utility').style.position = 'static';
    document.getElementById('utility').style.boxShadow = 'rgba(17, 17, 17, 0.5) 0 5px 10px';
    document.getElementById('dirct-icon').style.display = 'flex';
  }

  showResult() {
    const streetTabRadio = document.getElementById('streetTabRadio') as HTMLInputElement;
    const resultStreet: Array<object> = [];
    const resultPoi: Array<object> = [];

    this.searchResults.forEach(resultRow => {
      if (resultRow.type === 'STREET') {
        resultStreet.push(resultRow);
      } else {
        resultPoi.push(resultRow);
      }
    });
    if (streetTabRadio.checked) {
      this.resultTotal = resultStreet;
    } else {
      this.resultTotal = resultPoi;
    }
    //console.log(this.resultTotal);
  }

  GotoLocation(i) {
    let x;
    let y;
    const resultTotalI: object = this.resultTotal[i];
    for (const key in resultTotalI) {
      if (key === 'coordinateDocument') {
        const coord = resultTotalI[key];
        for (const xy in coord) {
          if (xy === 'lat') {
            y = coord[xy];
          } else {
            x = coord[xy];
          }
        }
      }
    }
    const center = transform([x, y], 'EPSG:4326', this.mapservice.project);
    this.mapservice.map.getView().setCenter(center);
    this.mapservice.map.getView().setZoom(15);
  }

//*ngFor="let item of resultTotal ; let i = index"
}

