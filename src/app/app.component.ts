import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rewaa-app';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // default navigate to place-order route
    this.router.navigateByUrl('place-order');
  }
}
