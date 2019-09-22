import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';
import { ForgetPassComponent } from '../forget-pass/forget-pass.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  isLoginDataValid=true
  passwordShown: boolean = false;
  constructor(
    private publicVar: PublicVarService,
    private forgetPass: ForgetPassComponent,
    private httpClient: HttpClient
  ) {}
  ngOnInit() {}

  onSubmitLogin() {
    console.log(this.loginForm);

    const userName = this.loginForm.value.userName;
    const password = this.loginForm.value.password;
    const url = this.publicVar.baseUrl + '1398/api/user/getloaduser?username=' + userName + '&userpassword=' + password;
    console.log(url);

    this.httpClient
      .get(url)
      .toPromise()
      .then(response => {
        console.log(typeof response);
        const result: object = JSON.parse(response.toString());
        const lenResult = Object.keys(result).length;
        console.log(lenResult);

        if (lenResult > 0) {
          this.closeLogin();
          this.publicVar.isauthenticate = true;
          this.isLoginDataValid=true;

        } else {
          this.isLoginDataValid=false;
          this.publicVar.isauthenticate = false;
        }
      });
  }

  closeLogin() {
    // ----use set time uot for animation fade out ----
    setTimeout(e => {
      document.getElementById('login').style.display = 'none';
      document.getElementById('login-page').style.display = 'flex';
      document.getElementById('forget-pass-box').style.display = 'none';
      this.loginForm.reset();
      this.passwordShown = false;
    }, this.publicVar.time);
    // this.forgetPass.resetForm();
  }

  showpassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      document.getElementById('login-pass-input').setAttribute('type', 'password');
    } else {
      this.passwordShown = true;
      document.getElementById('login-pass-input').setAttribute('type', 'text');
    }
  }
  // ----for animation ----
  toggle() {
    this.publicVar.isOpenLogin = false;
  }
  // ----for animation ----

  showSignIn() {
    document.getElementById('login-page-box').style.display = 'none';
    document.getElementById('signin-forgetpass-box').style.display = 'none';
    document.getElementById('signin-page').style.display = 'block';
    this.loginForm.reset();
  }
  showForgetPass() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('signin-forgetpass-box').style.display = 'none';
    document.getElementById('forget-pass-box').style.display = 'block';
    this.loginForm.reset();
  }
}
