import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html'
})
export class BookingDetailsComponent implements OnInit {

  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';
  eventObj: any = null;
  assignModel: any = {};
  showMessage: any = false;
  responseMessage: any = '';
  isUpdate: any = false;
  eventList: any = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.formModel = { studentId: '' };
  }

  searchEvent() {
    if (!this.formModel.studentId) {
      this.showError = true;
      this.errorMessage = 'Please enter a student ID.';
      return;
    }
    this.httpService.getBookingDetails(this.formModel.studentId).subscribe({
      next: (res: any) => {
        this.eventList = res;
        this.showError = false;
        if (res.length === 0) {
          this.showMessage = true;
          this.responseMessage = 'No registrations found for this student.';
        }
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch booking details.';
      }
    });
  }
}
