import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';

import { PlatformLocation } from '@angular/common';

import { HttpService } from '../../services/http.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
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

  selector: 'app-dashboard',

  templateUrl: './dashbaord.component.html',

  styleUrls: ['./dashbaord.component.scss']

})

export class DashbaordComponent implements OnInit {

  itemForm!: FormGroup;

  showError: boolean = false;

  errorMessage: string = '';

  showMessage: boolean = false;

  responseMessage: string = '';

  isUpdate: boolean = false;

  eventList: any[] = [];

  role: string | null = null;

  roles: string | null = null;

  userName: string | null = null;

  today: Date = new Date();
 
  constructor(

    private fb: FormBuilder,

    private httpService: HttpService,

    private authService: AuthService,

    private router: Router,

    private location: PlatformLocation

  ) {}
 
  ngOnInit(): void {

    // ✅ Apply theme variables globally

    this.applyTheme(LIGHT_VARS);
 
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
 
    // Listen for back navigation

    this.location.onPopState(() => {

      if (this.router.url === '/dashboard') {

        this.authService.logout();

        this.router.navigate(['/login']);

      }

    });

  }
 
  private applyTheme(vars: Record<string, string>): void {

    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {

      root.style.setProperty(key, value);

    });

  }
 
  getRoles() {

    this.roles = this.authService.getRole();

  }
 
  getName() {

    this.userName = this.authService.getName();

  }
 
  loadEvents(): void {

    this.httpService.getAllEventAgenda().subscribe({

      next: (res: any) => {

         this.eventList = res.filter((event: any) => {
      const eventDate = new Date(event.date); // adjust property name if needed
      return eventDate >= this.today;
    });

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

 