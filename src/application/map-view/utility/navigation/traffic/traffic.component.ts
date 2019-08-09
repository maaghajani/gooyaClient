import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-traffic',
  template: `
    <label class="switch">
      <input id="checkboxTraffic" type="checkbox" />
      <div class="slider"></div>
    </label>
  `,
})
export class TrafficComponent implements OnInit {
  constructor() {}
  ngOnInit() {}

  switchTraffic() {
    (document.getElementById('checkboxTraffic') as HTMLInputElement).checked = false;
    const checkbox = document.querySelector('input#checkboxTraffic') as HTMLInputElement;
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
