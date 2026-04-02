import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls:['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';
  eventObj: any = null;
  assignModel: any = {};
  showMessage: any = false;
  responseMessage: any = '';
  isUpdate: any = false;
  eventList: any = [];

  constructor(private fb: FormBuilder, private httpService: HttpService,private authService:AuthService) {}
  role:string|null=null;
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['']
    });
    this.loadEvents();
    this.role=this.authService.getRole()
  }

  loadEvents() {
    this.httpService.getAllEventAgenda().subscribe({
      
      next: (res: any) => { this.eventList = res; console.log(res) },
      error: (err: any) => { console.error(err); }
    });
  }

  edit(val: any) {
    this.isUpdate = true;
    this.eventObj = val;
    this.itemForm.patchValue({
      id: val.id,
      name: val.name,
      description: val.description,
      materials: val.materials
    });
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please fill in required fields.';
      return;
    }
    const eventId = this.itemForm.value.id;
    this.httpService.updateEvent(this.itemForm.value, eventId).subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = 'Event updated successfully!';
        this.isUpdate = false;
        this.itemForm.reset();
        this.loadEvents();
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to update event.';
      }
    });
  }
}
