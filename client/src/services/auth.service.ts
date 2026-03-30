import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

  
//   token: string = '';
//   isLoggedIn: boolean = false;
//   id: string = '';

//   constructor(private router: Router) {}

//   saveToken(token: string): void {
//     this.token = token;
//     this.isLoggedIn = true;
//     localStorage.setItem('token', token);
//   }

//   SetRole(role: any): void {
//     localStorage.setItem('role', role);
//   }

//   get getLoginStatus(): boolean {
//     return this.isLoggedIn || !!localStorage.getItem('token');
//   }

//   getToken(): string | null {
//     return this.token || localStorage.getItem('token');
//   }

//   logout(): void {
//     this.token = '';
//     this.isLoggedIn = false;
//     this.id = '';
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     this.router.navigate(['/login']);
//   }

// }
// //todo: Complete missing code..



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string = '';
  isLoggedIn: boolean = false;
  id: string = '';

  constructor(private router: Router) {}

  saveToken(token: string): void {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  SetRole(role: any): void {
    localStorage.setItem('role', role);
  }

  getRole(): string | null  {
    return localStorage.getItem('role');
  }

  get getLoginStatus(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  logout(): void {
    this.token = '';
    this.isLoggedIn = false;
    this.id = '';
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

}
