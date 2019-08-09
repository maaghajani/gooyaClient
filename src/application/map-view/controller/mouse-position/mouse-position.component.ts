import { LocationSharingComponent } from './../../utility/location-sharing/location-sharing.component';
import { MapService } from '../../../shared/services/map.service';
import { Component, OnInit, DoCheck } from '@angular/core';
// layer controller ==> MousePosition
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate.js';

@Component({
  selector: 'app-mouse-position',
  templateUrl: './mouse-position.component.html',
  styleUrls: ['./mouse-position.component.scss']
})
export class MousePositionComponent implements OnInit, DoCheck {
  ismetric = false;

  constructor(private mapservice: MapService) {}
  ngOnInit() {
    this.setMousePosition(5, 'EPSG:4326');
    this.changeMousePosProject();
  }
  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    this.changeMousePositionFormat();
  }
  setMousePosition(numberStringX: number, projects: string) {
    this.mapservice.map.addControl(
      new MousePosition({
        coordinateFormat: createStringXY(numberStringX),
        projection: projects,
        target: document.getElementById('mouse-position'),
        undefinedHTML: 'نامشخص'
      })
    );
  }

  changeMousePositionFormat() {
    const checkbox = document.getElementById('checkboxMouseposition') as HTMLInputElement;

    const mousePosContent = document.getElementById('mouse-position').innerText;
    const arrayMouse = mousePosContent.split(',');
    const long = parseFloat(arrayMouse[0]);
    const lat = parseFloat(arrayMouse[1]);
    let longFormat:string=null
    let latFormat:string=null
    if (long > 0) {
      longFormat=long + 'E' 
    }else if (long < 0){
      longFormat=long + 'W' 
    }else{
      longFormat=long.toString()
    }
    if (lat > 0) {
      latFormat=lat + 'N' 
    }else if (lat < 0){
      latFormat=lat + 'S' 
    }else{
      latFormat=lat.toString()
    }
    
    const moseFormat =longFormat+ ' , ' +latFormat;
    if (mousePosContent !== 'نامشخص' && (arrayMouse[0] != undefined && arrayMouse[1] != undefined)) {
      if (!checkbox.checked) {
      document.getElementById('mouse-position-fromat').innerText = moseFormat;
      }else{
        document.getElementById('mouse-position-fromat').innerText =mousePosContent
      }
    } else {
      document.getElementById('mouse-position-fromat').innerText = 'نامشخص';
    }
    
}
  changeMousePosProject() {
    const checkbox = document.getElementById('checkboxMouseposition') as HTMLInputElement;
    const control = this.mapservice.map.getControls();
    //----element is object of control----
    checkbox.addEventListener('change', event => {
      this.mapservice.map.getControls().forEach(element => {
        const elemKey = element.getKeys();
        elemKey.forEach(elm => {
          if (elm == 'projection') {
            // console.log('loopremove');
            this.mapservice.map.removeControl(element);
            if (checkbox.checked) {
              this.setMousePosition(0, this.mapservice.project);
            } else {
              this.setMousePosition(5, 'EPSG:4326');
            }
          }
        });
      });
    });
  }
}

