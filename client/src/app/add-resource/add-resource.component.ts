import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {

  itemForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';

  // 🔑 Added resourceList so template can use it
  resourceList: any[] = [];

  constructor(private fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      resourceType: ['', [Validators.required, Validators.minLength(3)]], 
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Load resources initially
    this.getResources();
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

    this.httpService.addResource(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.showMessage = true;
        this.responseMessage = '✅ Resource added successfully!';
        this.itemForm.reset();
        this.getResources(); // Refresh list after adding
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = '❌ Failed to add resource. Please try again later.';
        console.error(err);
      }
    });
  }

  // 🔑 Fetch resources from backend
  getResources() {
    this.httpService.GetAllResources().subscribe({
      next: (res: any) => {
        this.resourceList = res;
      },
      error: (err: any) => {
        console.error('Failed to fetch resources', err);
      }
    });
  }

  // ✅ Helper getters
  get resourceType() { return this.itemForm.get('resourceType'); }
  get description() { return this.itemForm.get('description'); }
}
