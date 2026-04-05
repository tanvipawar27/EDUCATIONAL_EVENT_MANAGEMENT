import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {

  showError = false;
  errorMessage = '';
  showMessage = false;
  responseMessage = '';
  eventList: any[] = [];

  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ Keep init clean
    this.loadBookingDetails();
    console.log(this.eventList)
  }

  // 🔹 New method for fetching bookings
  private loadBookingDetails(): void {
    const studentId = this.authService.getId();

    if (!studentId) {
      this.showError = true;
      this.errorMessage = 'No student ID found in session. Please log in again.';
      return;
    }

    const numericId = Number(studentId); // ensure numeric

    this.httpService.getBookingDetails(numericId).subscribe({
      next: (res: any) => {
        this.eventList = res || [];
        this.showError = false;

        if (!res || res.length === 0) {
          this.showMessage = true;
          this.responseMessage = 'No bookings right now.';
        } else {
          this.showMessage = false;
        }
      },
      error: (err) => {
  this.eventList = [];
  this.showError = true;
  if (err.status === 404) {
    this.errorMessage = 'No bookings found for this student.';
  } else if (err.status === 401) {
    this.errorMessage = 'Session expired. Please log in again.';
  } else {
    this.errorMessage = 'Failed to fetch booking details. Please try later.';
  }
}

    });
  }
}
