// import { Component, OnInit } from '@angular/core';
// import { HttpService } from '../../services/http.service';
 
// const LIGHT_VARS: Record<string, string> = {
//   '--bg': '#fefae8',
//   '--bg-2': '#fdf4cc',
//   '--bg-card': 'rgba(255,252,230,0.92)',
//   '--bg-glass': 'rgba(255,248,200,0.82)',
//   '--nav-bg': 'rgba(254,250,232,0.94)',
//   '--text': '#1a1a2e',
//   '--text-sub': '#3d3d5c',
//   '--text-muted': '#8a8a9a',
//   '--accent-1': '#b45309',
//   '--accent-2': '#7c3aed',
//   '--accent-3': '#0a7c6e',
//   '--accent-4': '#be123c',
//   '--glow-1': 'rgba(180,83,9,0.10)',
//   '--glow-2': 'rgba(124,58,237,0.08)',
//   '--border': 'rgba(180,83,9,0.16)',
//   '--border-card': 'rgba(180,83,9,0.22)',
//   '--stat-num': '#b45309',
//   '--btn-grad': 'linear-gradient(135deg,#b45309,#7c3aed)',
//   '--footer-bg': '#fdf0a0',
//   '--toggle-track-bg': 'rgba(180,83,9,0.14)',
// };
 
// @Component({
//   selector: 'app-view-resources',
//   templateUrl: './view-resources.component.html',
//   styleUrls: ['./view-resources.component.scss']
// })
// export class ViewResourceComponent implements OnInit {
//   resourceList: any[] = [];
//   filteredResources: any[] = [];
//   searchTerm: string = '';
 
//   constructor(private httpService: HttpService) {}
 
//   ngOnInit(): void {
//     // ✅ Apply theme variables globally
//     this.applyTheme(LIGHT_VARS);
 
//     this.getResources();
//   }
 
//   private applyTheme(vars: Record<string, string>): void {
//     const root = document.documentElement;
//     Object.entries(vars).forEach(([key, value]) => {
//       root.style.setProperty(key, value);
//     });
//   }
 
//   getResources() {
//     this.httpService.GetAllResources().subscribe({
//       next: (res: any) => {
//         this.resourceList = res;
//         this.filteredResources = this.resourceList;
//       },
//       error: (err: any) => { console.error(err); }
//     });
//   }
 
//   applySearch(): void {
//     if (!this.searchTerm) {
//       this.filteredResources = this.resourceList;
//       return;
//     }
//     const term = this.searchTerm.toLowerCase();
//     this.filteredResources = this.resourceList.filter(r =>
//       r.resourceType.toLowerCase().includes(term) ||
//       r.description.toLowerCase().includes(term)
//     );
//   }
//   deleteResource(){

//   }
// }
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
  selector: 'app-view-resources',
  templateUrl: './view-resources.component.html',
  styleUrls: ['./view-resources.component.scss']
})
export class ViewResourceComponent implements OnInit {
  resourceList: any[] = [];
  filteredResources: any[] = [];
  searchTerm: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    // ✅ Apply theme variables globally
    this.applyTheme(LIGHT_VARS);
    this.getResources();
  }

  private applyTheme(vars: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  getResources() {
    this.httpService.GetAllResources().subscribe({
      next: (res: any) => {
        this.resourceList = res;
        this.filteredResources = this.resourceList;
      },
      error: (err: any) => { console.error(err); }
    });
  }

  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredResources = this.resourceList;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredResources = this.resourceList.filter(r =>
      r.resourceType.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  }

  // ✅ Delete resource method
  deleteResource(id: number): void {
      this.httpService.deleteResource(id).subscribe({
        next: () => {
          // Remove from local list immediately
          this.resourceList = this.resourceList.filter(r => r.id !== id);
          this.applySearch(); // re-apply search filter if active
          console.log(`Resource with ID ${id} deleted successfully`);
        },
        error: (err) => {
          console.error('Failed to delete resource', err);
        }
      });
    }
  }
