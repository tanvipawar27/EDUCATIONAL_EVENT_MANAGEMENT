import { HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbaord.component.html',
  styleUrls:['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit{
  constructor( private router: Router,
    private location: PlatformLocation,
    private authService: AuthService
   ){}
  ngOnInit(): void {
    this.getRoles();
    this.getName();
     // Listen for back navigation
   this.location.onPopState(() => {
      // ✅ Check if current route is dashboard
      if (this.router.url === '/dashboard') {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  };
  roles:string | null=null;
  userName:string | null=null;
 
  getRoles(){
   this.roles= this.authService.getRole();
  }
  getName(){
    this.userName=this.authService.getName();
  }
}