import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '../../services/http.service';

import { AuthService } from '../../services/auth.service';
 
@Component({

  selector: 'app-view-events',

  templateUrl: './view-events.component.html',

  styleUrls: ['./view-events.component.scss']

})

export class ViewEventsComponent implements OnInit {
 
  itemForm!: FormGroup;

  showError = false;

  errorMessage = '';

  showMessage = false;

  responseMessage = '';

  isUpdate = false;

  eventList: any[] = [];

  registeredEvents: number[] = [];

  role: string | null = null;
 
  // ✅ New properties for filtering/sorting

  filterOption: string = 'ALL';   // Default filter option

  sortAscending = true;

  filteredEvents: any[] = [];
 
  constructor(

    private fb: FormBuilder,

    private httpService: HttpService,

    private authService: AuthService

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
 
    if (this.role === 'STUDENT') {

      const studentId = this.authService.getId();

      this.httpService.getRegistrationStatus(studentId).subscribe({

        next: (res: any) => {

          this.registeredEvents = res.map((r: any) => r.eventId);

        },

        error: () => console.error('Failed to fetch registration status')

      });

    }

  }
 
  loadEvents(): void {

    this.httpService.getAllEventAgenda().subscribe({

      next: (res: any) => {

        this.eventList = res;

        this.applyFilters(); // ✅ Apply filters after loading

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
 
  registerForEvent(eventId: number): void {

    if (this.isRegistered(eventId)) {

      this.showError = true;

      this.errorMessage = 'You are already registered for this event.';

      return;

    }
 
    const studentId = this.authService.getId();

    const registration = { studentId }; // ✅ status handled by backend
 
    this.httpService.registerForEvent(eventId, registration).subscribe({

      next: () => {

        this.showMessage = true;

        this.responseMessage = 'Successfully registered for the event!';

        this.showError = false;

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
 
  isUpcoming(eventDate: string | Date): boolean {

    const today = new Date();

    const date = new Date(eventDate);

    return date >= today;

  }
 
  isRegistered(eventId: number): boolean {

    return this.registeredEvents.includes(eventId);

  }
 
  // ✅ Toggle Sort Asc/Desc

  toggleSortOrder(): void {

    this.sortAscending = !this.sortAscending;

    this.applyFilters();

  }
searchTerm: string = '';  // new property

applyFilters(): void {
  const today = new Date();

  this.filteredEvents = this.eventList.filter(event => {
    const eventDate = new Date(event.date);

    // Filter by status
    if (this.filterOption === 'UPCOMING' && eventDate < today) return false;
    if (this.filterOption === 'COMPLETED' && eventDate >= today) return false;

    // ✅ Additional search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      const matchesName = event.name.toLowerCase().includes(term);
      const matchesDesc = event.description.toLowerCase().includes(term);
      const matchesMaterials = event.materials?.toLowerCase().includes(term);
      return matchesName || matchesDesc || matchesMaterials;
    }

    return true;
  });

  // Sort
  this.filteredEvents.sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return this.sortAscending ? diff : -diff;
  });
}

}

 