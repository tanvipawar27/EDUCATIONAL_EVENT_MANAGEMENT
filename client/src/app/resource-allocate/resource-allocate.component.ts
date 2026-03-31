import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls:['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';
  resourceList: any = [];
  assignModel: any = {};
  showMessage: any = false;
  responseMessage: any = '';
  eventList: any = [];

  constructor(private fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      eventId: ['', Validators.required],
      resourceId: ['', Validators.required]
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
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please select event and resource.';
      return;
    }
    const { eventId, resourceId } = this.itemForm.value;
    this.httpService.allocateResources(eventId, resourceId, {}).subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = 'Resource allocated successfully!';
        this.itemForm.reset();
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to allocate resource.';
      }
    });
  }
}
