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
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.scss']
})
export class ViewFeedbackComponent implements OnInit {
  feedbackList: any[] = [];
  filteredFeedback: any[] = [];
  searchTerm: string = '';
  loading = false;
  showError = false;
  errorMessage = '';
  showMessage = false;
  responseMessage = '';
  role: string | null = null;

  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ Apply theme variables globally
    this.applyTheme(LIGHT_VARS);

    this.role = this.authService.getRole();
    this.loadFeedback();
  }

  private applyTheme(vars: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  loadFeedback(): void {
    this.loading = true;
    this.httpService.getFeedback().subscribe({
      next: (res: any) => {
        this.feedbackList = res;
        this.filteredFeedback = this.feedbackList;
        this.loading = false;
        this.showError = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
        this.showError = true;
        this.errorMessage = 'Failed to load feedback.';
      }
    });
  }

  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredFeedback = this.feedbackList;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredFeedback = this.feedbackList.filter(f =>
      f.name.toLowerCase().includes(term) ||
      f.email.toLowerCase().includes(term) ||
      f.message.toLowerCase().includes(term)
    );
  }

//   deleteFeedback(feedbackId: number): void {
//     if (confirm('Are you sure you want to delete this feedback?')) {
//       this.httpService.deleteFeedback(feedbackId).subscribe({
//         next: () => {
//           this.showMessage = true;
//           this.responseMessage = 'Feedback deleted successfully!';
//           this.loadFeedback();
//         },
//         error: () => {
//           this.showError = true;
//           this.errorMessage = 'Failed to delete feedback.';
//         }
//       });
//     }
//   }
}
