import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  wrongEmail: boolean = false;
  wrongPassword: boolean = false;
  invalidCredentials: boolean = false;
  notRegistered: boolean = false;
  notVerified: boolean = false;
  constructor(private loginservice: DataService, private router: Router) { }
  loginForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    }
  );
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  login() {
    this.notRegistered = false;
    this.wrongEmail = false;
    this.wrongPassword = false;
    this.invalidCredentials = false;
    this.notVerified = false;
    const body = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.loginservice.loginUser(body).subscribe(
      (data) => {
        if (data.status === 200) {
          console.log(data);
          this.loginservice.isLoggedIn = true;
          this.loginservice.verify = true;
          this.router.navigate(['home']);



        }
        this.loginservice.authLoggedIn(this.loginservice.verify);
        console.log("this is verify", this.loginservice.verify);
      },
      (error) => {
        console.log("inside error block");

        if (error.status === 401) {
          if (error.error === "User does not exist") {
            this.notRegistered = true;
          } else if (error.error === "Wrong Email") {
            this.wrongEmail = true;
          } else if (error.error === "Wrong Password") {
            this.wrongPassword = true;
          }
          else if (error.error) {
            this.notVerified = true;
          }
          else {
            this.invalidCredentials = true;
          }
        }
      }

    );

  }
}
