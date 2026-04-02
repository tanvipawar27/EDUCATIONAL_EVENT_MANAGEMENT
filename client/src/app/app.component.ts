// import { Component } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   IsLoggin:any=false;
//   roleName: string | null;
//   constructor(public authService: AuthService, private router:Router)
//   {
   
//     this.IsLoggin=authService.getLoginStatus;
//     this.roleName=authService.getRole();
//     if(this.IsLoggin==false)
//     {
//       this.router.navigateByUrl('/login'); 
    
//     }
//   }
//   logout()
// {
//   this.authService.logout();
//   window.location.reload();
// }

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
  roleName: string |null = '';
  IsLoggin: boolean = false;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide sidebar on login/registration routes
        if (event.url === '/login' || event.url === '/registration') {
          this.IsLoggin = false;
        } else {
          this.IsLoggin = this.authService.getLoginStatus;
          this.roleName = this.authService.getRole();
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.IsLoggin = false;
  }
}


