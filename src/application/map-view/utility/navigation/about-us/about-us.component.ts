import { Component, OnInit } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {

  constructor(
    public publicVar: PublicVarService,
  ) { }

  ngOnInit() {
  }
  CloaseAboutUs(){
    this.publicVar.isOpenAboutUs=false;
    setTimeout(() => {
      document.getElementById('about-us-box').style.display = 'none';
    }, this.publicVar.time);
  }
}
