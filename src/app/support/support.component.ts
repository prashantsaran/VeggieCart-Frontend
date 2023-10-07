import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../service/data.service';
import { help } from '../interface/help';
import { register } from '../interface/register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  // invalidCredentials:boolean=false;
  help: help = {} as help;
  // registerUser:[]=[];
  query: help[] = [];
  // ticketId:number=0;
  success: boolean = false;
  notRegistered: boolean = false;
  profile: register = {
    email: '',
    password: '',
    otp: 0,
    name: '',
    address: '',
  };
  // data:DataService=inject(DataService);
  queryForm = new FormGroup({
    //Using validators and creating form fields and using prefilled values during launch
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    issue: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });
  constructor(private data: DataService, private router: Router) { }
  ngOnInit(): void {
    this.getProfileData();
  }
  getProfileData() {
    this.data.authLoggedIn(this.data.verify);
    if (this.data.verify == false)
      this.router.navigate(['home']);
    console.log("this is profile data");

    this.data.getProfile().subscribe((data: any) => {
      console.log(data);

      if (data.status === 200) {
        console.log(data.body);

        this.profile = data.body || {}; // Handle the possibility of null response
        console.log(this.profile);

      }
    }
    )
  }
  submit() {
    const issue: help = {
      email: this.profile.email,
      name: this.profile.name,
      issue: this.queryForm.value.issue!,
      ticketId: this.data.getTicketId(),
      status: "Not Resolved"
    };
    this.data.addIssue(issue).subscribe((data) => {
      if (data.status == 200)
        this.success = true;
    },
      (error) => {
        if (error.status == 500)
          this.notRegistered = true;
      });
  }
  get user() {
    return this.queryForm.get('user');
  }
  get contact() {
    return this.queryForm.get('contact');
  }
  get message() {
    return this.queryForm.get('message');
  }
}
