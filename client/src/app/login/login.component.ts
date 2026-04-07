import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { HttpService } from '../../services/http.service';

import { AuthService } from '../../services/auth.service';
 
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

  selector: 'app-login',

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.scss']

})

export class LoginComponent implements OnInit {
 
  itemForm!: FormGroup;

  showError = false;

  errorMessage = '';

  currentYear: number = new Date().getFullYear();
 
  captchaText = '';

  captchaAnswer!: number;
 
  constructor(

    private fb: FormBuilder,

    private httpService: HttpService,

    private authService: AuthService,

    private router: Router

  ) {}
 
  ngOnInit(): void {

    // ✅ Apply theme variables globally

    this.applyTheme(LIGHT_VARS);
 
    this.itemForm = this.fb.group({

      username: ['', Validators.required],

      password: ['', Validators.required],

      captcha: ['', Validators.required]

    });
 
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
 
  registration(): void {

    this.router.navigate(['/registration']);

  }
 
  onSubmit(): void {

    if (this.itemForm.invalid) {

      this.showError = true;

      this.errorMessage = 'Please fill in all required fields.';

      return;

    }
 
    if (this.itemForm.value.captcha != this.captchaAnswer) {

      this.showError = true;

      this.errorMessage = 'Invalid captcha.';

      this.generateCaptcha();

      return;

    }
 
    this.httpService.Login(this.itemForm.value).subscribe({

      next: (res: any) => {

        this.authService.saveToken(res.token);

        this.authService.setRole(res.role);

        this.authService.setUsername(res.username);

        this.authService.setId(res.id);
 
        this.router.navigate(['/dashboard']);

      },

      error: () => {

        this.showError = true;

        this.errorMessage = 'Invalid username or password.';

      }

    });

  }

}

 