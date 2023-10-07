import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../service/data.service';
import { register } from '../interface/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
    this.registerForm.get('email')?.valueChanges.subscribe(() => {
      this.otpSent = false;
      this.existingUser = false;
      this.registrationSuccess = false;
    });
  }
  // // ...

  // ngAfterViewInit(): void {
  //   console.log(this.existingUser);
  //   console.log(this.otpSent);
  // }
  emailVerified: boolean = false;
  registrationSuccess: boolean = false;
  existingUser: boolean = false;
  otpSent = false;
  registered: boolean = false;
  invalidOtp: boolean = false;
  constructor(private registerService: DataService) { }
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    cart: new FormControl(''),
    address: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get otp() {
    return this.registerForm.get('otp');
  }
  get name() {
    return this.registerForm.get('name');
  }
  get address() {
    return this.registerForm.get('address');
  }

  // verifyPresence(){
  //   this.registerService.checkPresence(this.registerForm.value.email!).subscribe((data:any)=>{
  //   }),
  //   (error:any)=>{
  //     console.log("hello jikaise ho");

  //     if(error.status==200)
  //     this.emailVerified=true;
  //   else if(error.status==409){
  //     console.log("hello");

  //   this.emailVerified=false;
  // this.existingUser=true;  
  // this.otpSent=false;
  // }
  //   }
  //   if(this.emailVerified!=true)
  //    this.verifyEmail();
  //   this.resetAll();
  // }
  // resetAll(){
  //  this.existingUser=false;
  //  this.emailVerified=false;
  //  this.emailVerified=false;
  // }
  verifyEmail() {
    // Simulate email verification process
    console.log("enter trying to enter subscribe");
    this.registerService.checkPresenceAndSendOtp(this.registerForm.value.email!).subscribe((data) => {
      console.log("this is subscribe");
      console.log(data);
      if (data.status == 200) {
        this.otpSent = true;
        console.log("data.status==200");
        this.emailVerified = true;
        this.emailVerified = true;
      }
      if (data.status == 409) {
        console.log("insdie 409 error");

        this.existingUser = true;
        this.otpSent = false;
      }
    },
      (error: any) => {
        if (error.status == 409) {
          console.log("inside error");
          this.emailVerified = false;

          console.log(this.emailVerified);

          this.existingUser = true;
          this.otpSent = false;

        }
      });

    // this.otpSent = true;
    // this.existingUser = false;
  }
  // verifyEmail() {
  //   this.registerService.checkPresenceAndSendOtp(this.registerForm.value.email!)
  //     .subscribe((data) => {
  //       if (data.status === 200) {
  //         this.otpSent = true;
  //         this.existingUser = false;
  //       } else if (data.status === 409) {
  //         this.existingUser = true;
  //         this.otpSent = false;
  //       }
  //     }, (error: HttpErrorResponse) => {
  //       if (error.status === 409) {
  //         this.existingUser = true;
  //         this.otpSent = false;
  //       }
  //     });
  // }

  register(): void {
    const otpValue: number = parseInt(this.registerForm.value.otp!, 10);
    const login: register = {
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      otp: otpValue,
      name: this.registerForm.value.name!,
      address: this.registerForm.value.address!,
    };

    console.log("this is login by angular", login);

    this.registerService.registerUser(login).subscribe((data: any) => {
      console.log("this is subscribe of register", data);
      if (data.status == 200) {
        this.registered = true;
        this.existingUser = false;
      }
    },
      (error: Error) => {
        console.log(error);
      }
    );
  }
}
