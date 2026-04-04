
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
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {

  itemForm!: FormGroup;
  showError = false;
  errorMessage = '';
  showMessage = false;
  responseMessage = '';
  isUpdate = false;
  eventList: any[] = [];

  roles: string | null = null;
  userName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    public authService: AuthService,   // ✅ MUST BE PUBLIC
    private router: Router,
    private location: PlatformLocation
  ) {}

  ngOnInit(): void {

    this.itemForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['']
    });

    this.roles = this.authService.getRole();
    this.userName = this.authService.getName();

    this.loadEvents();

    // ✅ Back navigation logout protection
    this.location.onPopState(() => {
      if (this.router.url === '/dashboard') {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  loadEvents(): void {
    this.httpService.getAllEventAgenda().subscribe({
      next: (res: any) => {
        this.eventList = res;
        this.showError = false;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load events.';
      }
    });
  }

  edit(event: any): void {
    this.isUpdate = true;
    this.itemForm.patchValue(event);
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

