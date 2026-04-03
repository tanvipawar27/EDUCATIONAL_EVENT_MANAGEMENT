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
