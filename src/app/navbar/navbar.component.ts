import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { vegetables } from '../interface/vegetables';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private data: DataService) { }
  ngOnInit(): void {
    this.isLoggedIn = this.data.isLoggedIn;
  }
  logout() {
    this.data.logoutDataClear().subscribe((data: any) => {
      if (data.status == 200) {
        console.log(data);
        this.data.isLoggedIn = !this.data.isLoggedIn
        this.isLoggedIn = this.data.isLoggedIn;
        this.data.verify = !this.data.verify;
        this.data.authLoggedIn(this.data.verify);

        console.log(this.data.isLoggedIn);
      }

    }, (error) => {


    })

  }
  searchQuery() {
    const seacrhItem = this.search.value.searchbox!;
    this.data.seacrhItem = seacrhItem;
    console.log(seacrhItem);
    this.router.navigate(['/search'], { queryParams: { search: seacrhItem } });

    // this.router.navigate(['search']);
  }
  search: FormGroup = new FormGroup({
    searchbox: new FormControl('', [Validators.required, Validators.minLength(1)])
  });
  login() {
    this.router.navigate(['login']);

  }
  register() {
    this.router.navigate(['register']);

  }
  profile() {
    this.router.navigate(['profile']);
  }

}
