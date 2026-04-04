import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-register-for-event',
  templateUrl: './register-for-event.component.html',
  styleUrls: ['./register-for-event.component.scss']
})
export class RegisterForEventComponent implements OnInit {
 
  registerForm!: FormGroup;
 
  showError = false;
  errorMessage = '';
  showMessage = false;
  responseMessage = '';
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {}
 
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      eventId: ['', Validators.required],
      studentId: [this.authService.getId(), Validators.required] // auto-filled from login
    });
  }
 
  submit(): void {
    if (this.registerForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please select an event.';
      return;
    }
 
    const { eventId, studentId } = this.registerForm.value;
    const registration = { studentId }; // status handled by backend
 
    this.httpService.registerForEvent(eventId, registration).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Successfully registered for the event!';
        this.showError = false;
        this.registerForm.reset({
          eventId: '',
          studentId: this.authService.getId() // keep studentId filled
        });
      },
      error: (err) => {
        this.showError = true;
        if (err.error && typeof err.error === 'string' && err.error.includes('already registered')) {
          this.errorMessage = 'You are already registered for this event.';
        } else if (err.status === 404) {
          this.errorMessage = 'Event not found.';
        } else {
          this.errorMessage = 'Failed to register for event.';
        }
      }
    });
  }
}