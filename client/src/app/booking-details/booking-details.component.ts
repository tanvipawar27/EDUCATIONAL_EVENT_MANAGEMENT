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
        console.log(err)
        console.error('API error:', err);
        this.eventList = []; // clear stale data
        this.showError = true;
        this.errorMessage = 'Failed to fetch booking details.';
      }
    });
  }
}
