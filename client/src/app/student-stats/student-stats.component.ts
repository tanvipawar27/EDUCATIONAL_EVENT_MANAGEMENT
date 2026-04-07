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

  selector: 'app-student-stats',

  templateUrl: './student-stats.component.html',

  styleUrls: ['./student-stats.component.scss']

})

export class StudentStatsComponent implements OnInit {
 
  totalEvents = 0;

  upcomingEvents = 0;

  registeredEvents = 0;
 
  studentId!: number;
 role:string|null=null;
  constructor(

    private httpService: HttpService,

    private authService: AuthService

  ) {}
 
  ngOnInit(): void {

    // ✅ Apply theme variables globally

    this.applyTheme(LIGHT_VARS);
 
    this.studentId = Number(this.authService.getId());
 
    this.loadEventStats();
    this.role=this.authService.getRole();

    this.loadStudentRegistrations();

  }
 
  private applyTheme(vars: Record<string, string>): void {

    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {

      root.style.setProperty(key, value);

    });

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


