import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-view-resources',
  templateUrl: './view-resources.component.html',
  styleUrls: ['./view-resources.component.scss']
})
export class ViewResourceComponent implements OnInit {
  resourceList: any[] = [];
  filteredResources: any[] = [];   // ✅ new array
  searchTerm: string = '';         // ✅ new property

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getResources();
  }

  getResources() {
    this.httpService.GetAllResources().subscribe({
      next: (res: any) => {
        this.resourceList = res;
        this.filteredResources = this.resourceList; // initialize
      },
      error: (err: any) => { console.error(err); }
    });
  }

  // ✅ search function
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
}
