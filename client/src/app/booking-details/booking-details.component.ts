import { Component, OnInit } from '@angular/core';

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

    // ✅ Apply theme variables globally

    this.applyTheme(LIGHT_VARS);
 
    this.loadBookingDetails();

    console.log(this.eventList);

  }
 
  private applyTheme(vars: Record<string, string>): void {

    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {

      root.style.setProperty(key, value);

    });

  }
 
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

 