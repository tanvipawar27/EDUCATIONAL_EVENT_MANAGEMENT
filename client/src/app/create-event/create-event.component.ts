import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls:['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';
  eventList: any = [];
  assignModel: any = {};
  showMessage: any = false;
  responseMessage: any = '';

  constructor(private fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['', Validators.required],
      date:['',[Validators.required]]
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
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.httpService.createEvent(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = 'Event created successfully!';
        this.itemForm.reset();
        this.getEvent();
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to create event.';
      }
    });
  }
}
