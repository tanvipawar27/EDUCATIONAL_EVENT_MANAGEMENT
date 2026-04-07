import { Component, OnInit } from '@angular/core';

import { HttpService } from '../../services/http.service';

import { AuthService } from '../../services/auth.service';
 
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

  selector: 'app-register-for-event',

  templateUrl: './register-for-event.component.html',

  styleUrls: ['./register-for-event.component.scss']

})

export class RegisterForEventComponent implements OnInit {
 
  eventList: any[] = [];

  filteredEvents: any[] = [];

  searchTerm: string = '';
 
  selectedIds: Set<number> = new Set();

  registeredIds: Set<number> = new Set();
 
  isLoading = true;

  isSubmitting = false;
 
  showError = false;

  errorMessage = '';

  showMessage = false;

  responseMessage = '';
 
  constructor(

    private httpService: HttpService,

    private authService: AuthService

  ) {}
 
  ngOnInit(): void {

    // ✅ Apply theme variables globally

    this.applyTheme(LIGHT_VARS);
 
    this.loadEvents();

    this.loadRegisteredEvents();

  }
 
  private applyTheme(vars: Record<string, string>): void {

    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {

      root.style.setProperty(key, value);

    });

  }
 
  loadEvents(): void {

    this.httpService.getAllEventAgenda().subscribe({

      next: (res: any[]) => {

        this.eventList = res || [];

        this.filteredEvents = this.eventList;

        this.isLoading = false;

      },

      error: () => {

        this.showError = true;

        this.errorMessage = 'Failed to load events. Please try again.';

        this.isLoading = false;

      }

    });

  }
 
  loadRegisteredEvents(): void {

    const studentId = this.authService.getId();

    if (!studentId) return;
 
    this.httpService.getRegistrationStatus(Number(studentId)).subscribe({

      next: (res: any[]) => {

        this.registeredIds = new Set((res || []).map((r: any) => r.eventId ?? r.event?.id));

      },

      error: () => {

        console.warn('Could not fetch registration status.');

      }

    });

  }
 
  toggleEvent(eventId: number): void {

    if (this.registeredIds.has(eventId)) return;
 
    const next = new Set(this.selectedIds);

    if (next.has(eventId)) {

      next.delete(eventId);

    } else {

      next.add(eventId);

    }

    this.selectedIds = next;

  }
 
  clearAll(): void {

    this.selectedIds = new Set();

  }
 
  applySearch(): void {

    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {

      this.filteredEvents = this.eventList;

      return;

    }

    this.filteredEvents = this.eventList.filter(e =>

      e.name?.toLowerCase().includes(term) ||

      e.description?.toLowerCase().includes(term) ||

      e.materials?.toLowerCase().includes(term)

    );

  }
 
  isUpcoming(date: string | Date): boolean {

    return new Date(date) >= new Date();

  }
 
  submit(): void {

    if (this.selectedIds.size === 0) return;
 
    this.isSubmitting = true;

    this.showError = false;

    this.showMessage = false;
 
    const studentId = this.authService.getId();

    const ids = Array.from(this.selectedIds);
 
    const registerOne = (index: number): Promise<void> => {

      if (index >= ids.length) return Promise.resolve();
 
      const eventId = ids[index];

      return new Promise<void>((resolve) => {

        this.httpService.registerForEvent(eventId, { studentId }).subscribe({

          next: () => {

            this.registeredIds = new Set([...this.registeredIds, eventId]);

            resolve();

          },

          error: (err) => {

            console.warn(`Failed to register for event ${eventId}:`, err);

            resolve();

          }

        });

      }).then(() => registerOne(index + 1));

    };
 
    registerOne(0).then(() => {

      this.isSubmitting = false;

      this.selectedIds = new Set();

      this.showMessage = true;

      this.responseMessage = `🎉 Successfully registered for ${ids.length} event${ids.length > 1 ? 's' : ''}!`;
 
      setTimeout(() => { this.showMessage = false; }, 5000);

    });

  }

}

 
