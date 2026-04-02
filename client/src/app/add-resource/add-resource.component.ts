import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls:['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';
  resourceList: any = [];
  assignModel: any = {};
  showMessage: any = false;
  responseMessage: any = '';

  constructor(private fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      resourceType: ['', Validators.required],
      description: ['', Validators.required],
      availability: ['', Validators.required]
    });
    this.getResources();
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
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.httpService.addResource(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = 'Resource added successfully!';
        this.itemForm.reset();
        this.getResources();
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to add resource.';
      }
    });
  }
}
