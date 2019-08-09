import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-traffic-area',
  template: `
    <label class="switch">
      <input id="checkboxTrafficArea" type="checkbox" />
      <div class="slider"></div>
    </label>
  `
})
export class TrafficAreaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  switchTrafficArea() {
    (document.getElementById('checkboxTrafficArea') as HTMLInputElement).checked = false;
    const checkbox = document.querySelector('input#checkboxTrafficArea') as HTMLInputElement;
    checkbox.addEventListener('change', event => {
      console.log('Checked');

      if (checkbox.checked) {
        // do this
        console.log('Checked');
      } else {
        // do that
        // console.log('Not checked');
      }
    });
  }
}
