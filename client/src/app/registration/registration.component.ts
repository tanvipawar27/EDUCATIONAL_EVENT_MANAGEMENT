import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service'; // ✅ fixed path
 
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  itemForm!: FormGroup;
 
  showMessage: boolean = false;
  responseMessage: string = '';
 
  captchaText = '';
  captchaAnswer!: number;
 
  otpSent: boolean = false;
  otpVerified: boolean = false;
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), this.usernameValidator]],
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],   // ✅ OTP included in main form
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      captcha: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
 
    this.generateCaptcha();
  }
 
  // ✅ CAPTCHA generator
  generateCaptcha(): void {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    this.captchaText = `${a} + ${b}`;
    this.captchaAnswer = a + b;
    this.itemForm.get('captcha')?.reset();
  }
 
  // ✅ Custom username validator
  usernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^(?![0-9]+$)[a-zA-Z0-9]+$/;
    return regex.test(value) ? null : { invalidUsername: true };
  }
 
  // ✅ Password regex validator
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(value) ? null : { invalidPassword: true };
  }
 
  // ✅ Confirm password validator
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
 
  // ✅ Send OTP
  sendOtp() {
    const email = this.itemForm.value.email;
    if (!email || !this.itemForm.get('email')?.valid) {
      this.responseMessage = 'Please enter a valid email first.';
      this.showMessage = true;
      return;
    }
 
    this.httpService.sendOtp(email).subscribe({
      next: () => {
        this.otpSent = true;
        this.responseMessage = 'OTP sent successfully to your email. Valid for 5 minutes.';
        this.showMessage = true;
      },
      error: (err) => {
        console.error('OTP send error:', err);
        this.responseMessage = 'Failed to send OTP. Try again.';
        this.showMessage = true;
      }
    });
  }
 
  // ✅ Verify OTP
  verifyOtp() {
    const email = this.itemForm.value.email;
    const otp = this.itemForm.value.otp;
 
    if (!email || !otp) {
      this.responseMessage = 'Please enter both email and OTP.';
      this.showMessage = true;
      return;
    }
 
    this.httpService.verifyOtp(email, otp).subscribe({
      next: () => {
        this.otpVerified = true;
        this.responseMessage = 'OTP verified successfully!';
        this.showMessage = true;
      },
      error: (e) => {
        console.log(e)
        this.otpVerified = false;
        this.itemForm.get('otp')?.reset(); // ✅ clear invalid OTP
        this.responseMessage = 'Invalid or expired OTP.';
        this.showMessage = true;
      }
    });
  }
 
  // ✅ Register user only if OTP verified
  onRegister() {
    if (!this.otpVerified) {
      this.responseMessage = 'Please verify OTP before registering.';
      this.showMessage = true;
      return;
    }
 
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
 
    if (this.itemForm.value.captcha != this.captchaAnswer) {
      this.showMessage = true;
      this.responseMessage = 'Invalid captcha.';
      this.generateCaptcha();
      return;
    }
 
    const payload = { ...this.itemForm.value };
    delete payload.confirmPassword;
    delete payload.captcha;
    delete payload.otp; // ✅ not needed in backend registration
 
    this.httpService.registerUser(payload).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Registration successful! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.showMessage = true;
        this.responseMessage = 'Registration failed. Please try again.';
      }
    });
  }
 
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
 
 