import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, DoCheck, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { PublicVarService } from 'src/application/shared/services/publicVar.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, DoCheck {
  passwordShown: boolean = false;
  token: string;
  @ViewChild('password') passwordField: ElementRef;
  // ---- valid form ----
  error: string = '';
  imageError: boolean = false;
  @ViewChild('signinForm') signinForm: NgForm;
  @ViewChild('firstName') firstName: NgModel;
  @ViewChild('lastName') lastName: NgModel;
  @ViewChild('email') email: NgModel;
  @ViewChild('confirmEmail') confirmEmail: NgModel;
  @ViewChild('phone') phone: NgModel;
  @ViewChild('image') image: NgModel;
  @ViewChild('password') password: NgModel;
  @ViewChild('confirmPassword') confirmPassword: NgModel;
  // ---- valid form ----

  constructor(public renderer: Renderer2, private publicVar: PublicVarService, private httpClient: HttpClient) { }
  ngOnInit() {
    this.noPaste('repeat-password-no-paste');
  }

  ngDoCheck() {
    if (this.signinForm.touched) {
      this.validateFormError();
    }
  }

  onSubmitSignin() {
    // console.log(this.signinForm);
    this.showVerificationCode();
    /*---------------sms------------------------
    const urlToken: string = 'https://RestfulSms.com/api/Token';
    const urlSMS: string = 'https://RestfulSms.com/api/MessageSend';
    const BodyToken = {
      UserApiKey: '66eaa4672280a89a38c8763c',
      SecretKey: 'eE?P2uA3v3Hray3B'
    };
    const TokenSMS = [];
    this.httpClient.post(urlToken, BodyToken).toPromise().then(dataToken => {
      TokenSMS.push(Object.values(dataToken)[0]);
      // TokenSMS.push(dataToken);
    }).then(sendSMS => {
      console.log(TokenSMS);
      const BodySMS = {
        Messages: ['test'],
        MobileNumbers: ['09351968559'],
        LineNumber: '50002015001398',
        SendDateTime: '',
        CanContinueInCaseOfError: 'false'
      };
      const SmsHeader = new HttpHeaders({
        'x-sms-ir-secure-token': TokenSMS[0],
        'Content-Type': 'application/json',

      });
      // SmsHeader.append('x-sms-ir-secure-token' , TokenSMS[0])
      const httpOption = { headers: SmsHeader };
      console.log(httpOption);
      this.httpClient.post(urlSMS, BodySMS, httpOption).toPromise().then(e => {
        console.log(e);
      });
    });
    // ---------------sms------------------------
    */

    const body = {
      FirstName: this.signinForm.value.firstName,
      LastName: this.signinForm.value.lastName,
      Emailadd: this.signinForm.value.email,
      MobileNo: this.signinForm.value.phone,
      UserPassword: this.signinForm.value.password,
      // UserPic: [],
      ComputerIP: '',
      Os: ''
    };




    this.signinForm.reset();
  }

  resetForm() {
    this.signinForm.reset();
    this.error = '';
    this.passwordShown = false;
    // ---- image reset ----
    document.getElementById('imageLabel').innerText = 'عکس';
    document.getElementById('imageLabel').className = 'invalid';
    this.imageError = false;
  }

  showLogIn() {
    document.getElementById('login-page-box').style.display = 'flex';
    document.getElementById('signin-forgetpass-box').style.display = 'flex';
    document.getElementById('signin-page').style.display = 'none';
    this.resetForm();
  }

  showForgetPass() {
    document.getElementById('signin-page').style.display = 'none';
    document.getElementById('login-page-box').style.display = 'flex';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('forget-pass-box').style.display = 'block';
    this.resetForm();
  }
  closeLogin() {
    // ----use set time uot for animation fade out ----
    document.getElementById('signin-forgetpass-box').style.display = 'flex';
    setTimeout(e => {
      document.getElementById('login').style.display = 'none';
      this.resetForm();
      this.error = '';
    }, this.publicVar.time);
  }

  // ----for animation ----
  toggle() {
    this.publicVar.isOpenLogin = false;
  }
  // ----for animation ----

  // ----prevent defaul paste in reapeat pass and email ----
  noPaste(id: string) {
    document.getElementById(id).onpaste = e => {
      e.preventDefault();
      return false;
    };
  }
  // ----prevent defaul paste in reapeat pass and email ----

  // ---- valid form ----
  validateFormError() {
    this.signinForm.controls['confirmPassword'].updateValueAndValidity();
    this.signinForm.controls['confirmEmail'].updateValueAndValidity();
    if (this.firstName.invalid && this.firstName.touched) {
      if (this.firstName.value.length < 3) {
        this.error = 'نام باید حداقل 3 کاراکتر باشد.';
      } else {
        this.error = 'نام باید حروف باشد.';
      }
    } else if (this.lastName.invalid && this.lastName.touched) {
      if (this.lastName.value.length < 3) {
        this.error = 'نام خانوادگی باید حداقل 3 کاراکتر باشد.';
      } else {
        this.error = 'نام خانوادگی باید حروف باشد.';
      }
    } else if (this.email.invalid && this.email.touched) {
      if (this.email.pristine || this.email.value == '') {
        this.error = 'واردکردن ایمیل الزامی است .';
      } else {
        this.error = 'ایمیل نامعتبر است .';
      }
    } else if (this.confirmEmail.invalid && this.confirmEmail.touched) {
      if (this.confirmEmail.pristine || this.confirmEmail.value == '') {
        this.error = 'واردکردن تکرار ایمیل الزامی است .';
      } else {
        if (
          this.confirmEmail.value !== '' &&
          this.email.valid &&
          this.confirmEmail.touched &&
          this.email.value !== this.confirmEmail.value
        ) {
          this.signinForm.controls['confirmEmail'].setErrors({ valid: false });
          this.error = 'ایمیل و تکرار آن یکسان نمی باشد.';
        } else {
          this.error = 'تکرار ایمیل نامعتبر است .';
        }
      }
    } else if (this.confirmEmail.valid && this.email.valid && this.email.value !== this.confirmEmail.value) {
      this.signinForm.controls['confirmEmail'].setErrors({ valid: false });
      this.error = 'ایمیل و تکرار آن یکسان نمی باشد.';
    } else if (this.phone.invalid && this.phone.touched) {
      if (this.phone.pristine || this.phone.value == '') {
        this.error = 'واردکردن شماره همراه الزامی است .';
      } else {
        this.error = 'شماره همراه نامعتبر است .';
      }
    } else if (this.imageError) {
      this.error = 'حجم عکس ارسالی بیش از 10 کیلوبایت است .';
    } else if (this.password.invalid && this.password.touched) {
      if (this.password.pristine || this.password.value == '') {
        this.error = 'وارد کردن رمز عبور الزامی است .';
      } else {
        this.error = 'رمزعبور باید حداقل 6 کاراکتر باشد.';
      }
    } else if (this.confirmPassword.invalid && this.confirmPassword.touched) {
      if (this.confirmPassword.pristine || this.confirmPassword.value == '') {
        this.error = 'وارد کردن تکرار رمزعبور الزامی است . ';
      } else {
        if (
          this.confirmPassword.value !== '' &&
          this.password.valid &&
          this.confirmPassword.touched &&
          this.password.value !== this.confirmPassword.value
        ) {
          this.signinForm.controls['confirmPassword'].setErrors({
            valid: false
          });
          this.error = 'رمزعبور و تکرار آن  یکسان نمی باشد.';
        } else {
          this.error = 'رمزعبور باید حداقل 6 کاراکتر باشد.';
        }
      }
    } else if (
      this.confirmPassword.valid &&
      this.password.valid &&
      this.password.value !== this.confirmPassword.value
    ) {
      this.signinForm.controls['confirmPassword'].setErrors({ valid: false });
      this.error = 'رمزعبور و تکرار آن  یکسان نمی باشد.';
    } else {
      this.error = '';
    }
  }

  // ---- get image size ----
  getFileDetails(fileEvent: any) {
    document.getElementById('imageLabel').innerText = this.image.value;
    const file = fileEvent.target.files[0];
    const size = file.size;
    if (size > 10000) {
      this.signinForm.controls['image'].setErrors({ valid: false });
      document.getElementById('imageLabel').className = 'ng-invalid';
      this.imageError = true;
    }
  }
  // ---- get image size ----

  // ---- valid form ----

  showpassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      document.getElementById('password-field').setAttribute('type', 'password');
    } else {
      this.passwordShown = true;
      document.getElementById('password-field').setAttribute('type', 'text');
    }
  }

  showVerificationCode() {
    document.getElementById('signin-page').style.display = 'none';
    document.getElementById('verification-code').style.display = 'block';
    document.getElementById('login-page-box').style.display = 'block';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('forget-pass-box').style.display = 'none';
  }
}
