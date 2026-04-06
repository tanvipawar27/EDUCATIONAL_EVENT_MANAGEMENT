import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-for-event',
  templateUrl: './register-for-event.component.html',
  styleUrls: ['./register-for-event.component.scss']
})
export class RegisterForEventComponent implements OnInit {

  eventList: any[] = [];
  filteredEvents: any[] = [];
  searchTerm: string = '';

  // Set of event IDs the student has selected
  selectedIds: Set<number> = new Set();

  // Set of event IDs the student is already registered for
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
    this.loadEvents();
    this.loadRegisteredEvents();
  }

  // ── Load all events ─────────────────────────────────────
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

  // ── Load already-registered events for this student ─────
  loadRegisteredEvents(): void {
    const studentId = this.authService.getId();
    if (!studentId) return;

    this.httpService.getRegistrationStatus(Number(studentId)).subscribe({
      next: (res: any[]) => {
        this.registeredIds = new Set((res || []).map((r: any) => r.eventId ?? r.event?.id));
      },
      error: () => {
        // Non-critical — just means we can't pre-mark registered events
        console.warn('Could not fetch registration status.');
      }
    });
  }

  // ── Toggle a checkbox ───────────────────────────────────
  toggleEvent(eventId: number): void {
    if (this.registeredIds.has(eventId)) return; // already registered, ignore

    const next = new Set(this.selectedIds);
    if (next.has(eventId)) {
      next.delete(eventId);
    } else {
      next.add(eventId);
    }
    this.selectedIds = next;
  }

  // ── Clear all selections ────────────────────────────────
  clearAll(): void {
    this.selectedIds = new Set();
  }

  // ── Search filter ────────────────────────────────────────
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

  // ── Check if event date is upcoming ─────────────────────
  isUpcoming(date: string | Date): boolean {
    return new Date(date) >= new Date();
  }

  // ── Submit registrations ────────────────────────────────
  submit(): void {
    if (this.selectedIds.size === 0) return;

    this.isSubmitting = true;
    this.showError = false;
    this.showMessage = false;

    const studentId = this.authService.getId();
    const ids = Array.from(this.selectedIds);

    // Register sequentially using Promise chain
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
            resolve(); // continue with others even if one fails
          }
        });
      }).then(() => registerOne(index + 1));
    };

    registerOne(0).then(() => {
      this.isSubmitting = false;
      this.selectedIds = new Set(); // clear selections
      this.showMessage = true;
      this.responseMessage = `🎉 Successfully registered for ${ids.length} event${ids.length > 1 ? 's' : ''}!`;

      // Auto-hide success message after 5s
      setTimeout(() => { this.showMessage = false; }, 5000);
    });
  }
}
