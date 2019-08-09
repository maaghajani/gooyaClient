import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lable',
  template: `
    <label class="switch">
      <input id="checkboxLable" type="checkbox" checked />
      <div class="slider"></div>
    </label>
  `,
})
export class LableComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  switchLable() {
    (document.getElementById('checkboxLable') as HTMLInputElement).checked = true;
    const checkbox = document.querySelector('input#checkboxLable') as HTMLInputElement;
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
