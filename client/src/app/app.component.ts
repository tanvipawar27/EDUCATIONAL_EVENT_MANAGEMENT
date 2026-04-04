// import { Component } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   roleName: string |null = '';
//   IsLoggin: boolean = false;

//   constructor(public authService: AuthService, private router: Router) {
//     this.router.events.subscribe(event => {
//       if (event instanceof NavigationEnd) {
//         // Hide sidebar on login/registration routes
//         if (event.url === '/login' || event.url === '/registration') {
//           this.IsLoggin = false;
//         } else {
//           this.IsLoggin = this.authService.getLoginStatus;
//           this.roleName = this.authService.getRole();
//         }
//       }
//     });
//   }
//   ngOnInit(): void {
//   this.setFixedHeight();
//   window.addEventListener('resize', this.setFixedHeight.bind(this));
// }

// setFixedHeight(): void {
//   const landing = document.querySelector('.landing') as HTMLElement;
//   if (landing) {
//     landing.style.height = `${window.innerHeight}px`;
//     landing.style.position = 'fixed';
//     landing.style.top = '0';
//     landing.style.left = '0';
//     landing.style.width = '100%';
//   }
// }


//   logout() {
//     this.authService.logout();
//     this.IsLoggin = false;
//   }
// }


import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  roleName: string | null = '';
  IsLoggin: boolean = false;
  currentUrl: string = '';

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;

        // Hide sidebar on public routes
        if (this.isPublicPage()) {
          this.IsLoggin = false;
        } else {
          this.IsLoggin = this.authService.getLoginStatus;
          this.roleName = this.authService.getRole();
        }
      }
    });
  }

  isPublicPage(): boolean {
    return ['/app-landing', '/login', '/registration'].includes(this.currentUrl);
  }

  logout() {
    this.authService.logout();
    this.IsLoggin = false;
  }
}
