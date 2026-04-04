import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

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

  captchaText ="";
  captchaAnswer!: number;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}
ngOnInit(): void {

    this.itemForm = this.fb.group({

      username: ['', Validators.required],

      password: ['', Validators.required],
 
      // ✅ CAPTCHA form control (NEW)

      captcha: ['', Validators.required]

    });
 
    // ✅ Generate captcha on load

    this.generateCaptcha();

  }
 
  // ✅ CAPTCHA generator (NEW)

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

    

    // ✅ CAPTCHA validation (NEW)

    if (this.itemForm.value.captcha != this.captchaAnswer) {

      this.showError = true;

      this.errorMessage = 'Invalid captcha.';

      this.generateCaptcha();

      return;

    }
 

    this.httpService.Login(this.itemForm.value).subscribe({
      next: (res: any) => {
        // ✅ Save login info via AuthService
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
