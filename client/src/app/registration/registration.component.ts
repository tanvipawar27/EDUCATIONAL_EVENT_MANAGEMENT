import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls:['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
 
  itemForm!: FormGroup;
  showMessage: boolean = false;
  responseMessage: any = '';
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      role: ['', Validators.required]
    });
  }
 
  //  Custom password validator
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
 
    // Must contain uppercase, lowercase, number, special char, min 8 chars
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(value) ? null : { invalidPassword: true };
  }
 
  onRegister() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    this.httpService.registerUser(this.itemForm.value).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Registration successfull! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.showMessage = true;
        this.responseMessage = 'Registration failed. Please try again.';
      }
    });
  }
}


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpService } from '../../services/http.service';

// @Component({
//   selector: 'app-registration',
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss']
// })
// export class RegistrationComponent implements OnInit {

//   itemForm!: FormGroup;
//   showMessage: boolean = false;
//   responseMessage: string = '';

//   captchaText: string = '';
//   captchaChars: any[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private httpService: HttpService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.generateCaptcha();

//     this.itemForm = this.fb.group({
//       username: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(4),
//           Validators.maxLength(20),
//           Validators.pattern(/^[a-zA-Z0-9_]+$/) // only letters, numbers, underscore
//         ]
//       ],
//       password: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(8),
//           Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
//           // must contain uppercase, lowercase, number, special char
//         ]
//       ],
//       confirmPassword: ['', Validators.required], // confirm password field
//       email: ['', [Validators.required, Validators.email]],
//       role: ['', Validators.required],
//       captcha: ['', Validators.required]
//     }, { validators: this.passwordMatchValidator });
//   }

//   // ✅ Custom validator for confirm password
//   passwordMatchValidator(form: FormGroup) {
//     const password = form.get('password')?.value;
//     const confirmPassword = form.get('confirmPassword')?.value;
//     return password === confirmPassword ? null : { mismatch: true };
//   }

//   generateCaptcha() {
//     const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*qwertyuiopasdfghjklzxcvbnm';
//     this.captchaText = '';
//     this.captchaChars = [];

//     for (let i = 0; i < 5; i++) {
//       const char = chars.charAt(Math.floor(Math.random() * chars.length));
//       this.captchaText += char;

//       this.captchaChars.push({
//         char,
//         rotate: Math.floor(Math.random() * 40) - 20, // -20° to +20°
//         size: Math.floor(Math.random() * 10) + 18,   // 18px–28px
//         top: Math.floor(Math.random() * 10) - 5      // vertical shift
//       });
//     }
//   }

//   onRegister() {
//     if (this.itemForm.invalid) {
//       this.itemForm.markAllAsTouched();
//       return;
//     }

//     // ✅ CAPTCHA VALIDATION
//     if (this.itemForm.value.captcha.toUpperCase() !== this.captchaText) {
//       this.showMessage = true;
//       this.responseMessage = 'Invalid captcha. Please try again.';
//       this.generateCaptcha();
//       this.itemForm.get('captcha')?.reset();
//       return;
//     }

//     const payload = { ...this.itemForm.value };
//     delete payload.captcha;
//     delete payload.confirmPassword;

//     this.httpService.registerUser(payload).subscribe({
//       next: () => {
//         this.showMessage = true;
//         this.responseMessage = 'Registration successful! Please login.';
//         setTimeout(() => this.router.navigate(['/login']), 1500);
//       },
//       error: () => {
//         this.showMessage = true;
//         this.responseMessage = 'Registration failed. Please try again.';
//         this.generateCaptcha();
//       }
//     });
//   }
// }


// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { Router } from '@angular/router';
// // import { HttpService } from '../../services/http.service';

// // @Component({
// //   selector: 'app-registration',
// //   templateUrl: './registration.component.html',
// //   styleUrls: ['./registration.component.scss']
// // })
// // export class RegistrationComponent implements OnInit {

// //   itemForm!: FormGroup;
// //   formModel: any = {};
// //   showMessage: boolean = false;
// //   responseMessage: any = '';

// //   captchaText: string = '';
// //   captchaChars: any[] = [];

// //   constructor(
// //     private fb: FormBuilder,
// //     private httpService: HttpService,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.generateCaptcha();

// //     this.itemForm = this.fb.group({
// //       username: ['', Validators.required],
// //       password: ['', Validators.required],
// //       email: ['', [Validators.required, Validators.email]],
// //       role: ['', Validators.required],
// //       captcha: ['', Validators.required]   // ✅ added
// //     });
// //   }

// //   generateCaptcha() {
// //     const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*';
// //     this.captchaText = '';
// //     this.captchaChars = [];

// //     for (let i = 0; i < 5; i++) {
// //       const char = chars.charAt(Math.floor(Math.random() * chars.length));
// //       this.captchaText += char;

// //       this.captchaChars.push({
// //         char,
// //         rotate: Math.floor(Math.random() * 40) - 20, // -20° to +20°
// //         size: Math.floor(Math.random() * 10) + 18,   // 18px–28px
// //         top: Math.floor(Math.random() * 10) - 5      // vertical shift
// //       });
// //     }
// //   }

// //   onRegister() {
// //     if (this.itemForm.invalid) {
// //       this.itemForm.markAllAsTouched();
// //       return;
// //     }

// //     // ✅ CAPTCHA VALIDATION
// //     if (this.itemForm.value.captcha.toUpperCase() !== this.captchaText) {
// //       this.showMessage = true;
// //       this.responseMessage = 'Invalid captcha. Please try again.';
// //       this.generateCaptcha();
// //       this.itemForm.get('captcha')?.reset();
// //       return;
// //     }

// //     const payload = { ...this.itemForm.value };
// //     delete payload.captcha;

// //     this.httpService.registerUser(payload).subscribe({
// //       next: () => {
// //         this.showMessage = true;
// //         this.responseMessage = 'Registration successful! Please login.';
// //         setTimeout(() => this.router.navigate(['/login']), 1500);
// //       },
// //       error: () => {
// //         this.showMessage = true;
// //         this.responseMessage = 'Registration failed. Please try again.';
// //         this.generateCaptcha();
// //       }
// //     });
// //   }
// // }



// // // import { Component, OnInit } from '@angular/core';
// // // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // // import { Router } from '@angular/router';
// // // import { HttpService } from '../../services/http.service';

// // // @Component({
// // //   selector: 'app-registration',
// // //   templateUrl: './registration.component.html',
// // //   styleUrls:['./registration.component.scss']
// // // })
// // // export class RegistrationComponent implements OnInit {

// // //   itemForm!: FormGroup;
// // //   formModel: any = {};
// // //   showMessage: boolean = false;
// // //   responseMessage: any = '';

// // //   constructor(
// // //     private fb: FormBuilder,
// // //     private httpService: HttpService,
// // //     private router: Router
// // //   ) {}

// // //   ngOnInit(): void {
// // //     this.itemForm = this.fb.group({
// // //       username: ['', Validators.required],
// // //       password: ['', Validators.required],
// // //       email: ['', [Validators.required, Validators.email]],
// // //       role: ['', Validators.required]
// // //     });
// // //   }

// // //   onRegister() {
// // //     if (this.itemForm.invalid) {
// // //       this.itemForm.markAllAsTouched();
// // //       return;
// // //     }
// // //     this.httpService.registerUser(this.itemForm.value).subscribe({
// // //       next: (res: any) => {
// // //         this.showMessage = true;
// // //         this.responseMessage = 'Registration successful! Please login.';
// // //         setTimeout(() => this.router.navigate(['/login']), 1500);
// // //       },
// // //       error: (err: any) => {
// // //         this.showMessage = true;
// // //         this.responseMessage = 'Registration failed. Please try again.';
// // //       }
// // //     });
// // //   }
// // // }
