import { HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbaord.component.html',
  styleUrls:['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit{
  constructor(private auth: AuthService){}
  
  ngOnInit(): void {
    this.getRoles();
    this.getName();
  };
  roles:string | null=null;
  userName:string | null=null;

  getRoles(){
   this.roles= this.auth.getRole();
  }
  getName(){
    this.userName=this.auth.getName();
  }
  
}
