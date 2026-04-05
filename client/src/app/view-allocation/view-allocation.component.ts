import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-view-allocation',
  templateUrl: './view-allocation.component.html',
  styleUrls: ['./view-allocation.component.scss']
})
export class ViewAllocationComponent implements OnInit {
  allocations: any[] = [];
  filteredAllocations: any[] = [];
  searchTerm: string = '';
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getAllocations();
  }

  getAllocations() {
    this.httpService.GetAllevents().subscribe({
      next: (res: any) => {
        // ✅ only keep allocations that have study materials
        this.allocations = res.filter((a: any) => a.resourceAllocations?.length > 0);
        this.filteredAllocations = this.allocations;
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to load allocations.';
        console.error(err);
      }
    });
  }

  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredAllocations = this.allocations;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredAllocations = this.allocations.filter(a =>
      (a.event?.event_id?.toString().toLowerCase().includes(term)) ||
      (a.resourceType?.toLowerCase().includes(term)) ||
      (a.description?.toLowerCase().includes(term)) ||
      (a.resourceAllocations?.some((r: any) =>
        r.resourceType.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
      ))
    );
  }
}
