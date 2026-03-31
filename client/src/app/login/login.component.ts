import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:['./login.component.scss']
})
export class LoginComponent implements OnInit {

  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  registration() {
    this.router.navigate(['/registration']);
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    this.httpService.Login(this.itemForm.value).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.authService.SetRole(res.role);
        localStorage.setItem('username', res.username);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Invalid username or password.';
      }
    });
  }
}
