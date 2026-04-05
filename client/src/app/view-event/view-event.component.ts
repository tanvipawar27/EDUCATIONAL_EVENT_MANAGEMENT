// // import { Component, OnInit } from '@angular/core';
// // import { ActivatedRoute } from '@angular/router';
// // import { HttpService } from '../../services/http.service';

// // @Component({
// //   selector: 'app-view-event',
// //   templateUrl: './view-event.component.html',
// //   styleUrls: ['./view-event.component.scss']
// // })
// // export class ViewEventComponent implements OnInit {
// //   event: any;
// //   errorMessage = '';
// //   loading = true;

// //   constructor(private route: ActivatedRoute, private httpService: HttpService) {}

// //   ngOnInit(): void {
// //     const id = this.route.snapshot.paramMap.get('id'); // ✅ get event ID from route
// //     if (id) {
// //       this.httpService.getEventById(id).subscribe({
// //         next: (res) => {
// //           this.event = res;
// //           this.loading = false;
// //         },
// //         error: () => {
// //           this.errorMessage = 'Failed to load event details.';
// //           this.loading = false;
// //         }
// //       });
// //     }
// //   }
  
// // }
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpService } from '../../services/http.service';
// import { AuthService } from '../../services/auth.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-view-event',
//   templateUrl: './view-event.component.html',
//   styleUrls: ['./view-event.component.scss']
// })
// export class ViewEventComponent implements OnInit {
//   event: any;
//   errorMessage = '';
//   responseMessage = '';
//   showError = false;
//   showMessage = false;
//   loading = true;
//   role: string | null = null;
//   registeredEvents: number[] = [];
//   isUpdate = false;
//   itemForm!: FormGroup;

//   constructor(
//     private route: ActivatedRoute,
//     private httpService: HttpService,
//     private authService: AuthService,
//     private fb: FormBuilder
//   ) {}

//   ngOnInit(): void {
//     this.role = this.authService.getRole();
//     this.itemForm = this.fb.group({
//       id: [''],
//       name: ['', Validators.required],
//       description: ['', Validators.required],
//       materials: ['']
//     });

//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.httpService.getEventById(id).subscribe({
//         next: (res) => {
//           this.event = res;
//           this.loading = false;
//         },
//         error: () => {
//           this.errorMessage = 'Failed to load event details.';
//           this.showError = true;
//           this.loading = false;
//         }
//       });

//       if (this.role === 'STUDENT') {
//         const studentId = this.authService.getId();
//         this.httpService.getRegistrationStatus(studentId).subscribe({
//           next: (res: any) => {
//             this.registeredEvents = res.map((r: any) => r.eventId);
//           }
//         });
//       }
//     }
//   }

//   edit(event: any): void {
//     this.isUpdate = true;
//     this.itemForm.patchValue({
//       id: event.id,
//       name: event.name,
//       description: event.description,
//       materials: event.materials
//     });
//   }

//   onSubmit(): void {
//     if (this.itemForm.invalid) {
//       this.itemForm.markAllAsTouched();
//       this.showError = true;
//       this.errorMessage = 'Please fill in required fields.';
//       return;
//     }

//     const eventId = this.itemForm.value.id;
//     this.httpService.updateEvent(this.itemForm.value, eventId).subscribe({
//       next: () => {
//         this.showMessage = true;
//         this.responseMessage = 'Event updated successfully!';
//         this.isUpdate = false;
//         this.itemForm.reset();
//       },
//       error: () => {
//         this.showError = true;
//         this.errorMessage = 'Failed to update event.';
//       }
//     });
//   }

//   deleteEvent(eventId: number): void {
//     if (confirm('Are you sure you want to delete this event?')) {
//       this.httpService.deleteEvent(eventId).subscribe({
//         next: () => {
//           this.showMessage = true;
//           this.responseMessage = 'Event deleted successfully!';
//         },
//         error: () => {
//           this.showError = true;
//           this.errorMessage = 'Failed to delete event.';
//         }
//       });
//     }
//   }

//   registerForEvent(eventId: number): void {
//     if (this.isRegistered(eventId)) {
//       this.showError = true;
//       this.errorMessage = 'You are already registered for this event.';
//       return;
//     }

//     const studentId = this.authService.getId();
//     const registration = { studentId };

//     this.httpService.registerForEvent(eventId, registration).subscribe({
//       next: () => {
//         this.showMessage = true;
//         this.responseMessage = 'Successfully registered for the event!';
//         this.registeredEvents.push(eventId);
//       },
//       error: (err) => {
//         this.showError = true;
//         if (err.status === 409) {
//           this.errorMessage = 'You are already registered for this event.';
//         } else if (err.status === 404) {
//           this.errorMessage = 'Event not found.';
//         } else {
//           this.errorMessage = 'Failed to register for event.';
//         }
//       }
//     });
//   }

//   isRegistered(eventId: number): boolean {
//     return this.registeredEvents.includes(eventId);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {
  event: any;
  errorMessage = '';
  responseMessage = '';
  showError = false;
  showMessage = false;
  loading = true;
  role: string | null = null;
  registeredEvents: number[] = [];
  isUpdate = false;
  itemForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.itemForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.httpService.getEventById(id).subscribe({
        next: (res) => {
          this.event = res;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load event details.';
          this.showError = true;
          this.loading = false;
        }
      });

      if (this.role === 'STUDENT') {
        const studentId = this.authService.getId();
        this.httpService.getRegistrationStatus(studentId).subscribe({
          next: (res: any) => {
            this.registeredEvents = res.map((r: any) => r.eventId);
          }
        });
      }
    }
  }

  edit(event: any): void {
    this.isUpdate = true;
    this.itemForm.patchValue({
      id: event.id,
      name: event.name,
      description: event.description,
      materials: event.materials
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.showError = true;
      this.errorMessage = 'Please fill in required fields.';
      return;
    }

    const eventId = this.itemForm.value.id;
    this.httpService.updateEvent(this.itemForm.value, eventId).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Event updated successfully!';
        this.isUpdate = false;
        this.itemForm.reset();
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to update event.';
      }
    });
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.httpService.deleteEvent(eventId).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Event deleted successfully!';
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to delete event.';
        }
      });
    }
  }

  registerForEvent(eventId: number): void {
    if (this.isRegistered(eventId)) {
      this.showError = true;
      this.errorMessage = 'You are already registered for this event.';
      return;
    }

    const studentId = this.authService.getId();
    const registration = { studentId };

    this.httpService.registerForEvent(eventId, registration).subscribe({
      next: () => {
        this.showMessage = true;
        this.responseMessage = 'Successfully registered for the event!';
        this.registeredEvents.push(eventId);
      },
      error: (err) => {
        this.showError = true;
        if (err.status === 409) {
          this.errorMessage = 'You are already registered for this event.';
        } else if (err.status === 404) {
          this.errorMessage = 'Event not found.';
        } else {
          this.errorMessage = 'Failed to register for event.';
        }
      }
    });
  }

  isRegistered(eventId: number): boolean {
    return this.registeredEvents.includes(eventId);
  }
}
