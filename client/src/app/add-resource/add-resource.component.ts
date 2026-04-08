import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
 
const LIGHT_VARS: Record<string, string> = {

  '--bg': '#fefae8',

  '--bg-2': '#fdf4cc',

  '--bg-card': 'rgba(255,252,230,0.92)',

  '--bg-glass': 'rgba(255,248,200,0.82)',

  '--nav-bg': 'rgba(254,250,232,0.94)',

  '--text': '#1a1a2e',

  '--text-sub': '#3d3d5c',

  '--text-muted': '#8a8a9a',

  '--accent-1': '#b45309',

  '--accent-2': '#7c3aed',

  '--accent-3': '#0a7c6e',

  '--accent-4': '#be123c',

  '--glow-1': 'rgba(180,83,9,0.10)',

  '--glow-2': 'rgba(124,58,237,0.08)',

  '--border': 'rgba(180,83,9,0.16)',

  '--border-card': 'rgba(180,83,9,0.22)',

  '--stat-num': '#b45309',

  '--btn-grad': 'linear-gradient(135deg,#b45309,#7c3aed)',

  '--footer-bg': '#fdf0a0',

  '--toggle-track-bg': 'rgba(180,83,9,0.14)',

};
 
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
 
  resourceList: any[] = [];
 
  constructor(private fb: FormBuilder, private httpService: HttpService, private router :Router) {}
 
  ngOnInit(): void {

    // ✅ Apply theme variables globally

    this.applyTheme(LIGHT_VARS);
 
    this.itemForm = this.fb.group({

      resourceType: ['', [Validators.required, Validators.minLength(3)]], 

      description: ['', [Validators.required, Validators.minLength(10)]]

    });
 
    this.getResources();

  }
 
  private applyTheme(vars: Record<string, string>): void {

    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {

      root.style.setProperty(key, value);

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
 
    this.httpService.addResource(this.itemForm.value).subscribe({

      next: (res: any) => {

        this.showMessage = true;

        this.responseMessage = 'Resource added successfully!';

        this.itemForm.reset();

        this.getResources();
        setTimeout(()=>{
          this.router.navigate(["./dashboard"])
        },1000)

      },

      error: (err: any) => {

        this.showError = true;

        this.errorMessage = '❌ Failed to add resource. Please try again later.';

        console.error(err);

      }

    });

  }
 
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
 
  get resourceType() { return this.itemForm.get('resourceType'); }

  get description() { return this.itemForm.get('description'); }

}

