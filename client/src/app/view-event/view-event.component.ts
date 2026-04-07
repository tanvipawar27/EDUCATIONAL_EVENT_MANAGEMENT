import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from 'express';
 
const LIGHT_VARS: Record<string, string> = {
  '--bg': '#fefae8',
  '--bg-2': '#fdf4cc',
  '--bg-card': 'rgba(255,252,230,0.92)',
  '--bg-glass': 'rgba(255,248,200,0.82)',
  '--nav-bg': 'rgba(254,250,232,0.94)',
  '--text': '#1a1a2e',
  '--text-sub': '#3d3d5c',
  '--text-muted': '#8a8a9a',
  '--accent-1': '#b45309',
  '--accent-2': '#7c3aed',
  '--accent-3': '#0a7c6e',
  '--accent-4': '#be123c',
  '--glow-1': 'rgba(180,83,9,0.10)',
  '--glow-2': 'rgba(124,58,237,0.08)',
  '--border': 'rgba(180,83,9,0.16)',
  '--border-card': 'rgba(180,83,9,0.22)',
  '--stat-num': '#b45309',
  '--btn-grad': 'linear-gradient(135deg,#b45309,#7c3aed)',
  '--footer-bg': '#fdf0a0',
  '--toggle-track-bg': 'rgba(180,83,9,0.14)',
};
 
@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {
  event: any;
  errorMessage = '';
  responseMessage = '';
  showError = false;
  showMessage = false;
  loading = true;
  role: string | null = null;
  registeredEvents: number[] = [];
  isUpdate = false;
  itemForm!: FormGroup;
 
  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router:Router
  ) {}
 
  ngOnInit(): void {
    // ✅ Apply theme variables globally
    this.applyTheme(LIGHT_VARS);
 
    this.role = this.authService.getRole();
    this.itemForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['']
    });
 
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.httpService.getEventById(id).subscribe({
        next: (res) => {
          this.event = res;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load event details.';
          this.showError = true;
          this.loading = false;
        }
      });
 
      if (this.role === 'STUDENT') {
        const studentId = this.authService.getId();
        this.httpService.getRegistrationStatus(studentId).subscribe({
          next: (res: any) => {
            this.registeredEvents = res.map((r: any) => r.eventId);
          }
        });
      }
    }
  }
 
  private applyTheme(vars: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
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
 
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please fill in required fields.';
    }
 
    const eventId = this.itemForm.value.id;
    this.httpService.updateEvent(this.itemForm.value, eventId).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Event updated successfully!';
        this.isUpdate = false;
        this.itemForm.reset();
        this.router.navigate(['/view-event',eventId]);
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to update event.';
      }
    });
  }
 
  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.httpService.deleteEvent(eventId).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Event deleted successfully!';
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to delete event.';
        }
      });
    }
  }
 
  registerForEvent(eventId: number): void {
    if (this.isRegistered(eventId)) {
      this.showError = true;
      this.errorMessage = 'You are already registered for this event.';
      return;
    }
 
    const studentId = this.authService.getId();
    const registration = { studentId };
 
    this.httpService.registerForEvent(eventId, registration).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Successfully registered for the event!';
        this.registeredEvents.push(eventId);
      },
      error: (err) => {
        this.showError = true;
        if (err.status === 409) {
          this.errorMessage = 'You are already registered for this event.';
        } else if (err.status === 404) {
          this.errorMessage = 'Event not found.';
        } else {
          this.errorMessage = 'Failed to register for event.';
        }
      }
    });
  }
 
  isRegistered(eventId: number): boolean {
    return this.registeredEvents.includes(eventId);
  }
}