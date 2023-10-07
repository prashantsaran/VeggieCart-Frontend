import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { register } from '../interface/register';
import { HttpResponse } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.data.authLoggedIn(this.data.verify);
    if (this.data.verify == false)
      this.router.navigate(['home']);
    console.log("this is verify", this.data.verify);
    this.getProfileData();
  }
  profile: register = {
    email: '',
    password: '',
    otp: 0,
    name: '',
    address: '',
  };
  getProfileData() {
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
  };
}