import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Route, Router } from '@angular/router';
 
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
 
  constructor(private fb: FormBuilder, private httpService: HttpService, private router :Router) {}
 
  ngOnInit(): void {
    // ✅ Apply theme variables globally
    this.applyTheme(LIGHT_VARS);
 
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      materials: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      date: ['', [Validators.required,this.futureDateValidator]]
    });
 
    this.getEvent();
  }
 
  private applyTheme(vars: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
 
  getEvent() {
    this.httpService.GetAllevents().subscribe({
      next: (res: any) => { this.eventList = res; },
      error: (err: any) => { console.error(err); }
    });
  }
  // Custom validator for future date
futureDateValidator(control: any) {
  if (!control.value) {
    return null; // let required validator handle empty case
  }

  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(24, 0, 0, 0); // normalize to midnight

  return selectedDate > today ? null : { pastDate: true };
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
        this.responseMessage = ' Event created successfully!';
        this.itemForm.reset();
        this.getEvent();
        setTimeout(()=>{
this.router.navigate(['/view-events'])
        },1000)
        
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