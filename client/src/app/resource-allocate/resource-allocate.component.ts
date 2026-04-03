import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {

  itemForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  eventList: any[] = [];
  resourceList: any[] = [];

  constructor(private fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      eventId: ['', [Validators.required]],   // ✅ Added array form for clarity
      resourceId: ['', [Validators.required]] // ✅ Same here
    });

    this.getEvent();
    this.getResources();
  }

  getEvent() {
    this.httpService.GetAllevents().subscribe({
      next: (res: any) => { this.eventList = res; },
      error: (err: any) => { console.error(err); }
    });
  }

  getResources() {
    this.httpService.GetAllResources().subscribe({
      next: (res: any) => { this.resourceList = res; },
      error: (err: any) => { console.error(err); }
    });
  }

  onSubmit() {
    this.showError = false;   // ✅ Reset error state before validation
    this.showMessage = false; // ✅ Reset success state before validation

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please select both event and resource.'; // ✅ More descriptive message
      return;
    }

    const { eventId, resourceId } = this.itemForm.value;
    this.httpService.allocateResources(eventId, resourceId, {}).subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = '✅ Resource allocated successfully!'; // ✅ Success feedback
        this.itemForm.reset();
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = '❌ Failed to allocate resource. Please try again later.'; // ✅ Clearer error
        console.error(err);
      }
    });
  }

  // ✅ Helper getters for cleaner template validation
  get eventId() { return this.itemForm.get('eventId'); }
  get resourceId() { return this.itemForm.get('resourceId'); }
}
