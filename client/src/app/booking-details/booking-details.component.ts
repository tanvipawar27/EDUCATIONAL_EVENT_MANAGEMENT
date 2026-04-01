import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
 
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls:['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
 
  bookingForm!: FormGroup;
  showError = false;
  errorMessage = '';
  showMessage = false;
  responseMessage = '';
  eventList: any[] = [];
 
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService
  ) {}
 
  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      studentId: ['', Validators.required]
    });
  }
 
  searchEvent(): void {
    if (this.bookingForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please enter a student ID.';
      return;
    }
 
    const studentId = this.bookingForm.value.studentId;
 
    this.httpService.getBookingDetails(studentId).subscribe({
      next: (res: any) => {
        this.eventList = res;
        this.showError = false;
 
        if (!res || res.length === 0) {
          this.showMessage = true;
          this.responseMessage = 'No registrations found for this student.';
        } else {
          this.showMessage = false;
        }
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch booking details.';
      }
    });
  }
}  