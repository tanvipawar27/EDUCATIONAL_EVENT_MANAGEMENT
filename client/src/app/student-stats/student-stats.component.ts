import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-student-stats',
  templateUrl: './student-stats.component.html',
  styleUrls: ['./student-stats.component.scss']
})
export class StudentStatsComponent implements OnInit {
 
  totalEvents = 0;
  upcomingEvents = 0;
  registeredEvents = 0;
 
  studentId!: number;
 
  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}
 
  ngOnInit(): void {
    this.studentId = Number(this.authService.getId());
 
    this.loadEventStats();
    this.loadStudentRegistrations();
  }
 
  private loadEventStats(): void {
    this.httpService.getAllEventAgenda().subscribe({
      next: (events: any[]) => {
        this.totalEvents = events.length;
 
        const today = new Date();
        this.upcomingEvents = events.filter(
          e => e.date && new Date(e.date) > today
        ).length;
      },
      error: () => console.error('Failed to load events')
    });
  }
 
  private loadStudentRegistrations(): void {
    this.httpService.getStudentRegistrations(this.studentId).subscribe({
      next: (registrations: any[]) => {
        this.registeredEvents = registrations.length;
      },
      error: () => console.error('Failed to load student registrations')
    });
  }
}