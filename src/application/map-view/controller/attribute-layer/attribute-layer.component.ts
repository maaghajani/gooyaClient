import { Component, OnInit } from '@angular/core';
import { toStringXY } from 'ol/coordinate.js';
import { transform } from 'ol/proj.js';
import { IranBoundryService } from 'src/application/shared/services/iranBoundry.service';
import { MapService } from 'src/application/shared/services/map.service';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-attribute-layer',
  templateUrl: './attribute-layer.component.html',
  styleUrls: ['./attribute-layer.component.scss']
})
export class AttributeLayerComponent implements OnInit {
  openpopup: boolean = false;
  widthMoreSearchContent: number = 380;
  widthpopupCircle: number = 10;
  isInIran: boolean;
  constructor(
    public mapservice: MapService,
    public publicVar: PublicVarService,
    public IranBoundry: IranBoundryService
  ) {}

  ngOnInit() {
    window.addEventListener('load', e => {
      this.clickMapservice();
    });
  }

  // ---- close popup by click on X button---
  closePopup() {
    document.getElementById('popup').style.opacity = '0';
    document.getElementById('popup').style.display = 'none';
    this.openpopup = false;
  }
  // ---- close popup by click on X button---

  // ---- Function Visible arrow ----
  showPopupArrow(visibleArrow: string) {
    const arrowList = ['arrow-bottom', 'arrow-top', 'arrow-left', 'arrow-right'];
    for (const i in arrowList) {
      if (arrowList[i] === visibleArrow) {
        document.getElementById(arrowList[i]).style.visibility = 'visible';
      } else {
        document.getElementById(arrowList[i]).style.visibility = 'hidden';
      }
    }
  }
  // ---- Function Visible arrow ----

  // ---- Add a click handler to the map to render the popup ----
  // ---- get client mouse position and show popup layer attribute in position ----
  clickMapservice() {
    const containerPopup = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const layerAtribute = document.getElementById('attribute-layer');
    const arrowB = document.getElementById('arrow-bottom');
    // ---- get width and height of popup , arrow and convert to number ----
    let widthPopup = containerPopup.offsetWidth;
    let heightPopup = containerPopup.offsetHeight;
    const Heightarrow = arrowB.offsetHeight;
    // ---- show or close popup if single click on map ----
    document.body.addEventListener('click', (evt: Event) => {
      this.mapservice.map.on('singleclick', (evt: Event) => {
        // ----  If the routing was open, the attribute popup would not work ----
        if (!this.publicVar.isOpenDirection && !this.openpopup && !this.publicVar.isOpenPlaces) {
          this.openpopup = true;
          // ---- get client clicked coordinate and set it to popup ----
          const geoLocation = (evt as any).coordinate;
          // ---- change format coordinate ----
          const StringXY = toStringXY(geoLocation, 0);
          content.innerHTML = '<code>' + StringXY + '</code>';
          // ---- get mouse position of browser when user click on map ----
          const clientXY = this.mapservice.map.getPixelFromCoordinate(geoLocation);
          let clientX = Math.round(clientXY[0]);
          let clientY = Math.round(clientXY[1]);

          // ---- is click location in iran area ----
          const inside = require('point-in-polygon');
          this.isInIran = inside(geoLocation, this.IranBoundry.Iran);
          if (this.isInIran) {
            // set geocooding
            document.getElementById('feature-name').innerHTML = 'نام عارضه';
            document.getElementById('feature-property').innerText = 'نام استان ، نام شهر';
            containerPopup.style.width = '195px';
            containerPopup.style.height = '78px';
            document.getElementById('feature-name').style.textAlign = 'inherit';
            widthPopup = 195;
            heightPopup = 78;
          } else {
            document.getElementById('feature-name').innerHTML = 'مکان مورد نظر<br> خارج از محدوده ایران است.';
            document.getElementById('feature-property').innerText = '';
            content.innerHTML = '';
            // ----change style ----
            document.getElementById('feature-name').style.margin = '0';
            document.getElementById('feature-name').style.lineHeight = '1.8';
            document.getElementById('feature-name').style.textAlign = 'center';
            containerPopup.style.width = '168px';
            containerPopup.style.height = '65px';
            widthPopup = 168;
            heightPopup = 65;
          }
          // ---- get client browser size ----
          let browserSizeX = document.documentElement.clientWidth;
          const browserSizeY = document.documentElement.clientHeight;
          if (
            this.publicVar.isOpenStreet ||
            this.publicVar.isOpenIntersect ||
            this.publicVar.isOpenPoi ||
            this.publicVar.isOpenCoordinate
          ) {
            if (
              clientX + widthPopup / 2 >
              browserSizeX - this.widthMoreSearchContent // -1 For a better view;
            ) {
              browserSizeX = browserSizeX - this.widthMoreSearchContent;
            }
          }
          // ---- Make popup movement value ----
          let moveX = 0;
          let moveY = 0;

          if (/*if click on left of browsers */ clientX < widthPopup / 2) {
            moveX = clientX + Heightarrow + this.widthpopupCircle;
            moveY = clientY - heightPopup / 2;
            this.showPopupArrow('arrow-left');
          } else if (/*if click on rigth of browsers */ clientX > browserSizeX - widthPopup / 2) {
            moveX = clientX - (widthPopup + Heightarrow + this.widthpopupCircle);
            moveY = clientY - heightPopup / 2;
            this.showPopupArrow('arrow-right');
          } else if (/*if click on top of browsers */ clientY < heightPopup + Heightarrow) {
            moveX = clientX - (widthPopup / 2 - this.widthpopupCircle);
            moveY = clientY + Heightarrow;
            this.showPopupArrow('arrow-top');
          } else {
            moveX = clientX - widthPopup / 2;
            moveY = clientY - heightPopup - Heightarrow - this.widthpopupCircle;
            this.showPopupArrow('arrow-bottom');
          }
          // ---- set position from moveX and moveY to popup style ----
          layerAtribute.style.left = moveX.toString() + 'px';
          layerAtribute.style.top = moveY.toString() + 'px';
          // ---- show popup ----
          containerPopup.style.opacity = '1';
          document.getElementById('popup').style.display = 'flex';
        } else {
          this.closePopup();
        }
      });
      this.closePopup();
    });

    // ---- Close the popup when moving in the map ----
    this.mapservice.map.on('movestart', (evt: Event) => {
      this.closePopup();
    });
    // ---- Close the popup by right click----
    window.addEventListener('contextmenu', (evt: Event) => {
      this.closePopup();
    });
    // ---- fore close popup when click on bottun ----
  }
}
