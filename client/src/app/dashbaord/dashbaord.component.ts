import { HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbaord.component.html',
  styleUrls:['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit{
    

   itemForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  isUpdate: boolean = false;
  eventList: any[] = [];
  role: string | null = null;
constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router,
    private location: PlatformLocation,
    
  ) {}
 
  ngOnInit(): void {

    this.itemForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['']
    });
    this.loadEvents();
    this.role = this.authService.getRole();
    this.getRoles();
    this.getName();
    this.loadEvents();
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

 
  


  loadEvents(): void {
    this.httpService.getAllEventAgenda().subscribe({
      next: (res: any) => {
        this.eventList = res;
        this.showError = false;
      },
      error: (err: any) => {
        console.error(err);
        this.showError = true;
        this.errorMessage = 'Failed to load events.';
      }
    });
  }

  edit(event: any): void {
    this.isUpdate = true;
    this.itemForm.patchValue({
      id: event.id,
      name: event.name,
      description: event.description,
      materials: event.materials
    });
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.httpService.deleteEvent(eventId).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Event deleted successfully!';
          this.loadEvents();
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to delete event.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please fill in required fields.';
      return;
    }
    const eventId = this.itemForm.value.id;
    this.httpService.updateEvent(this.itemForm.value, eventId).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Event updated successfully!';
        this.isUpdate = false;
        this.itemForm.reset();
        this.loadEvents();
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to update event.';
      }
    });
  }

  
}