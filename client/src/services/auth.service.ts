// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';





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

//   getRole(): string | null  {
//     return localStorage.getItem('role');
//   }
//   getName(): string | null {
//     return localStorage.getItem('username');
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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = '';
  private isLoggedIn: boolean = false;
  private id: string = '';
  private roleName: string = '';
  private username: string = '';

  constructor(private router: Router) {
    // Restore state from localStorage when service initializes
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('username');

    if (storedToken) {
      this.token = storedToken;
      this.isLoggedIn = true;
    }
    if (storedRole) {
      this.roleName = storedRole;
    }
    if (storedUser) {
      this.username = storedUser;
    }
  }

  saveToken(token: string): void {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  setRole(role: string): void {
    this.roleName = role;
    localStorage.setItem('role', role);
  }

  setUsername(name: string): void {
    this.username = name;
    localStorage.setItem('username', name);
  }

  getRole(): string | null {
    return this.roleName || localStorage.getItem('role');
  }

  getName(): string | null {
    return this.username || localStorage.getItem('username');
  }

  get getLoginStatus(): boolean {
    // true if logged in in memory OR token exists in localStorage
    return this.isLoggedIn || !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  logout(): void {
    this.token = '';
    this.isLoggedIn = false;
    this.id = '';
    this.roleName = '';
    this.username = '';
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
