import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../service/data.service';
import { ObservableInput, catchError, map, mergeMap, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { resetPassword } from '../interface/resetPassword';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {
  click: boolean = false;
  passwordChanged: boolean = false;
  isRegistered: boolean = false;
  constructor(private reset: DataService) { }
  changePasswordForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email])

    }
  );
  resetPasswordForm = new FormGroup(
    {
      otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required])
    }
  );
  get email() {
    return this.changePasswordForm.get('email');
  }
  get password() {
    return this.resetPasswordForm.get('password');
  }
  get otp() {
    return this.resetPasswordForm.get('otp');
  }

  //   resetPassword() {
  //     if (this.changePasswordForm.valid) {
  //       this.reset.checkReset(this.changePasswordForm.value.email!).pipe(
  //           switchMap((presenceResponse: HttpResponse<any>) => {
  //             if (presenceResponse.status === 200) {
  //               console.log(presenceResponse.body)
  //               return this.sendOTP(email);
  //             } else {
  //               return throwError(presenceResponse.body);
  //             }
  //           }),
  // }
  //   }
  checkReset() {

    this.reset.checkReset(this.changePasswordForm.value.email!).subscribe((statusCode: any) => {
      console.log("Received status code:", statusCode);

      if (statusCode.status === 200) {
        console.log("User registered");
        this.isRegistered = false;
        this.click = true;
      } else if (statusCode.status === 409) {
        console.log("User not registered");
      } else {
        console.log("Unexpected status code:", statusCode);
        this.isRegistered = true;
        this.click = true;
      }
    },
      error => {
        console.log('error', 'inside the api call ', error.status);
        this.isRegistered = true;

      }
    );

  }
  resetPassword() {
    const otpValue: number = parseInt(this.resetPasswordForm.value.otp!, 10);
    const reset: resetPassword = {
      email: this.changePasswordForm.value.email!,
      otp: otpValue,
      password: this.resetPasswordForm.value.password!
    };
    this.reset.resetPassword(reset).subscribe((data) => {
      if (data.status == 200) {
        this.passwordChanged = true;
      }
      else {
        console.log("this is else part");

      }
    },
      (error) => {
        console.log(error);

      })
  }

}
