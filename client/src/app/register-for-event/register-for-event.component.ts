// import { Component, OnInit } from '@angular/core';
// import { HttpService } from '../../services/http.service';

// @Component({
//   selector: 'app-register-for-event',
//   templateUrl: './register-for-event.component.html',
//   styleUrls:['./register-for-event.component.scss']
// })
// export class RegisterForEventComponent implements OnInit {

//   formModel: any = {};
//   showError: boolean = false;
//   errorMessage: any = '';
//   eventObj: any = null;
//   assignModel: any = {};
//   showMessage: any = false;
//   responseMessage: any = '';
//   isUpdate: any = false;

//   constructor(private httpService: HttpService) {}

//   ngOnInit(): void {
//     this.formModel = { eventId: '', studentId: '', status: 'REGISTERED' };
//   }

//   Submit() {
//     if (!this.formModel.eventId || !this.formModel.studentId) {
//       this.showError = true;
//       this.errorMessage = 'Please fill in all required fields.';
//       return;
//     }
//     const registration = { studentId: this.formModel.studentId, status: this.formModel.status };
//     this.httpService.registerForEvent(this.formModel.eventId, registration).subscribe({
//       next: (res: any) => {
//         this.showMessage = true;
//         this.responseMessage = 'Successfully registered for the event!';
//         this.showError = false;
//         this.formModel = { eventId: '', studentId: '', status: 'REGISTERED' };
//       },
//       error: (err: any) => {
//         this.showError = true;
//         this.errorMessage = 'Failed to register for event.';
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

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
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      eventId: ['', Validators.required],
      studentId: ['', Validators.required],
      status: ['REGISTERED']
    });
  }

  submit(): void {
    if (this.registerForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const { eventId, studentId, status } = this.registerForm.value;

    const registration = {
      studentId,
      status
    };

    this.httpService.registerForEvent(eventId, registration).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Successfully registered for the event!';
        this.showError = false;
        this.registerForm.reset({ status: 'REGISTERED' });
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to register for event.';
      }
    });
  }
}
