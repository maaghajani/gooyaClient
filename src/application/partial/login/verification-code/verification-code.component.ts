import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit {
  @ViewChild('verificationCode') verificationCode: NgForm;
  constructor() { }

  ngOnInit() {
  }
  onSubmitPass(){
    console.log(this.verificationCode)
  }
}
