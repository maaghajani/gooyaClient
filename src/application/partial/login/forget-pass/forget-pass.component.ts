import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss']
})
export class ForgetPassComponent implements OnInit {
  @ViewChild('forgetPassword') forgetPassword: NgForm;
  constructor() {}
  ngOnInit() {}

  onSubmitPass() {
    console.log(this.forgetPassword);
  }

  showSignIn() {
    document.getElementById('login-page-box').style.display = 'none';
    document.getElementById('signin-page').style.display = 'block';
    this.forgetPassword.reset();
  }

  showLogIn() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('signin-forgetpass-box').style.display = 'flex';
    document.getElementById('forget-pass-box').style.display = 'none';
    this.forgetPassword.reset();
  }
  resetForm(){
    this.forgetPassword.reset();
  }
}
