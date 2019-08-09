import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-odd-even',
  template: `
    <label class="switch">
      <input id="checkboxOddEven" type="checkbox" checked />
      <div class="slider"></div>
    </label>
  `,
})
export class OddEvenComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  switchOddEven() {
    (document.getElementById('checkboxOddEven') as HTMLInputElement).checked = false;
    const checkbox = document.querySelector('input#checkboxOddEven') as HTMLInputElement;
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
