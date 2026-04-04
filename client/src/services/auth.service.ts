
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

    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('username');
    const storedId = localStorage.getItem('studentId');

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

    if (storedId) {
      this.id = storedId;
    }
  }

  // ✅ Save token
  saveToken(token: string): void {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  // ✅ Save role
  setRole(role: string): void {
    this.roleName = role;
    localStorage.setItem('role', role);
  }

  // ✅ Save username
  setUsername(name: string): void {
    this.username = name;
    localStorage.setItem('username', name);
  }

  // ✅ Save user ID
  setId(id: string): void {
    this.id = id;
    localStorage.setItem('studentId', id);
  }

  // ✅ Getters
  getRole(): string | null {
    return this.roleName || localStorage.getItem('role');
  }

  getName(): string | null {
    return this.username || localStorage.getItem('username');
  }

  getId(): string | null {
    return this.id || localStorage.getItem('studentId');
  }

  get getLoginStatus(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  // ✅ Role helpers (BEST PRACTICE)
  isStudent(): boolean {
    return this.getRole() === 'STUDENT';
  }

  isEducator(): boolean {
    return this.getRole() === 'EDUCATOR';
  }

  isInstitution(): boolean {
    return this.getRole() === 'INSTITUTION';
  }

  // ✅ Logout
  logout(): void {
    this.token = '';
    this.isLoggedIn = false;
    this.id = '';
    this.roleName = '';
    this.username = '';

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('studentId');

    this.router.navigate(['/login']);
  }
}

