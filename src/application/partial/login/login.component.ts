import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <div class="container" id="container">
      <app-login-page id="login-page-box"></app-login-page>
      <app-signin id="signin-page"></app-signin>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
