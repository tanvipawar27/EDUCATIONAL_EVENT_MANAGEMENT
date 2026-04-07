import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { Router } from '@angular/router';

import { HttpService } from '../../services/http.service';
 
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

    // ✅ Apply theme variables globally

    this.applyTheme(LIGHT_VARS);
 
    this.itemForm = this.fb.group({

      username: ['', [Validators.required, Validators.minLength(2), this.usernameValidator]],

      email: ['', [Validators.required, Validators.email]],

      otp: ['', Validators.required],

      password: ['', [Validators.required, this.passwordValidator]],

      confirmPassword: ['', Validators.required],

      role: ['', Validators.required],

      captcha: ['', Validators.required]

    }, { validators: this.passwordsMatchValidator });
 
    this.generateCaptcha();

  }
 
  private applyTheme(vars: Record<string, string>): void {

    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {

      root.style.setProperty(key, value);

    });

  }
 
  generateCaptcha(): void {

    const a = Math.floor(Math.random() * 10);

    const b = Math.floor(Math.random() * 10);

    this.captchaText = `${a} + ${b}`;

    this.captchaAnswer = a + b;

    this.itemForm.get('captcha')?.reset();

  }
 
  usernameValidator(control: AbstractControl): ValidationErrors | null {

    const value = control.value;

    if (!value) return null;

    const regex = /^(?![0-9]+$)[a-zA-Z0-9]+$/;

    return regex.test(value) ? null : { invalidUsername: true };

  }
 
  passwordValidator(control: AbstractControl): ValidationErrors | null {

    const value = control.value;

    if (!value) return null;

    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return regex.test(value) ? null : { invalidPassword: true };

  }
 
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {

    const password = group.get('password')?.value;

    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };

  }
 
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

        console.log(e);

        this.otpVerified = false;

        this.itemForm.get('otp')?.reset();

        this.responseMessage = 'Invalid or expired OTP.';

        this.showMessage = true;

      }

    });

  }
 
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

    delete payload.otp;
 
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

 