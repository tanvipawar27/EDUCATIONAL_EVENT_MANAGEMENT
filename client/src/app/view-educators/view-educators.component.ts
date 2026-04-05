import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-view-educators',
  templateUrl: './view-educators.component.html',
  styleUrls: ['./view-educators.component.scss']
})
export class ViewEducatorsComponent implements OnInit {
  educators: any[] = [];
  filteredEducators: any[] = [];   // ✅ new array
  searchTerm: string = '';         // ✅ new property
  loading = true;
  errorMessage = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getEducators();
  }

  getEducators(): void {
    this.httpService.getAllUsers().subscribe({
      next: (res: any[]) => {
        // ✅ filter only EDUCATOR role
        this.educators = res.filter(u => u.role === 'EDUCATOR' || u.role === 'educator');
        this.filteredEducators = this.educators; // initialize
        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage = 'Failed to load educators.';
        this.loading = false;
      }
    });
  }

  // ✅ search function
  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredEducators = this.educators;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredEducators = this.educators.filter(e =>
      e.username.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term)
    );
  }
}
