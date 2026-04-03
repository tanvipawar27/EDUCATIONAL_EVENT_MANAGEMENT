import { Component } from '@angular/core';

import { Router } from '@angular/router';
 
@Component({

  selector: 'app-landing',

  templateUrl: './home.component.html',

  styleUrls: ['./home.component.scss']

})

export class LandingComponent {
 
  currentYear: number = new Date().getFullYear();
 
  constructor(private router: Router) {}
 
  goToLogin() {

    this.router.navigate(['/login']);

  }
 
  goToRegister() {

    this.router.navigate(['/registration']);

  }
 
}
