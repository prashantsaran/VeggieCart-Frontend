import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { help } from '../interface/help'; // Import the Help interface
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  issues: help[] = []; // Use the Help interface to type the issues array
  noIssues: boolean = false;
  constructor(private data: DataService, private router: Router) { }
  issue: boolean = false;
  ngOnInit(): void {
    this.data.authLoggedIn(this.data.verify);
    if (this.data.verify == false)
      this.router.navigate(['home']);
    console.log("this is verify", this.data.verify);
    this.data.getIssue().subscribe((data: any) => {
      if (data.status === 200 && data.body) {
        const problem: help[] = data.body;
        this.issues = problem;
        console.log(this.issues);
        this.issue = true;
      }
      else if (data.status == 204 && data.body == null)
        this.noIssues = true;
    },
    );
  }
}
