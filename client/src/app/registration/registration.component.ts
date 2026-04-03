import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  itemForm!: FormGroup;
  showMessage: boolean = false;
  responseMessage: any = '';

  captchaText: string = '';
  captchaChars: any[] = [];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateCaptcha();

    this.itemForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), this.usernameValidator]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      captcha: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // ✅ Custom username validator
  usernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // Must be alphanumeric or alphabetic, but not only numbers
    const regex = /^(?![0-9]+$)[a-zA-Z0-9]+$/;
    return regex.test(value) ? null : { invalidUsername: true };
  }

  // ✅ Password regex validator
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // Must contain uppercase, lowercase, number, special char, min 8 chars
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(value) ? null : { invalidPassword: true };
  }

  // ✅ Confirm password validator
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789asdfghjkmnb';
    this.captchaText = '';
    this.captchaChars = [];

    for (let i = 0; i < 5; i++) {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      this.captchaText += char;

      this.captchaChars.push({
        char,
        rotate: Math.floor(Math.random() * 40) - 20, // -20° to +20°
        size: Math.floor(Math.random() * 10) + 18,   // 18px–28px
        top: Math.floor(Math.random() * 10) - 5      // vertical shift
      });
    }
  }

  onRegister() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    // ✅ Captcha validation
    if (this.itemForm.value.captcha.toUpperCase() !== this.captchaText) {
      this.showMessage = true;
      this.responseMessage = 'Invalid captcha. Please try again.';
      this.generateCaptcha();
      this.itemForm.get('captcha')?.reset();
      return;
    }

    const payload = { ...this.itemForm.value };
    delete payload.confirmPassword;
    delete payload.captcha;

    this.httpService.registerUser(payload).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Registration successful! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.showMessage = true;
        this.responseMessage = 'Registration failed. Please try again.';
        this.generateCaptcha();
      }
    });
  }
}
