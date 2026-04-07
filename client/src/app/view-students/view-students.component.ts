import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
 
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
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.scss']
})
export class ViewStudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  loading = true;
  errorMessage = '';
  searchTerm: string = '';
 
  constructor(private httpService: HttpService) {}
 
  ngOnInit(): void {
    // ✅ Apply theme variables globally
    this.applyTheme(LIGHT_VARS);
 
    this.getStudents();
  }
 
  private applyTheme(vars: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
 
  getStudents(): void {
    this.httpService.getAllUsers().subscribe({
      next: (res: any[]) => {
        this.students = res.filter(u => u.role === 'STUDENT' || u.role === 'student');
        this.filteredStudents = this.students;
        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = 'Failed to load students.';
        this.loading = false;
      }
    });
  }
 
  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredStudents = this.students;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(s =>
      s.username.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  }
}