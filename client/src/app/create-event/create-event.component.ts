import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  itemForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  eventList: any[] = [];

  constructor(private fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      // ✅ Must be at least 3 characters, max 100 (realistic event name length)

      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      // ✅ Must be meaningful, at least 10 chars, max 500

      materials: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      // ✅ Must be at least 3 chars, max 200 (e.g., "Projector, Whiteboard")

      date: ['', [Validators.required]]
      // ✅ Required; you can add a custom validator to ensure future date if needed
    });

    this.getEvent();
  }

  getEvent() {
    this.httpService.GetAllevents().subscribe({
      next: (res: any) => { this.eventList = res; },
      error: (err: any) => { console.error(err); }
    });
  }

  onSubmit() {
    this.showError = false;
    this.showMessage = false;

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please correct the highlighted errors before submitting.';
      return;
    }

    this.httpService.createEvent(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = '✅ Event created successfully!';
        this.itemForm.reset();
        this.getEvent();
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = '❌ Failed to create event. Please try again later.';
        console.error(err);
      }
    });
  }

  // ✅ Helper getters for template validation
  get name() { return this.itemForm.get('name'); }
  get description() { return this.itemForm.get('description'); }
  get materials() { return this.itemForm.get('materials'); }
  get date() { return this.itemForm.get('date'); }
}
