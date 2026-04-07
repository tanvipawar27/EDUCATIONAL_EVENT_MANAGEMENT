import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
 
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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  roleName: string | null = '';
  IsLoggin: boolean = false;
  currentUrl: string = '';
  isSidebarOpen: boolean = false;
 
  constructor(
    public authService: AuthService,
    public router: Router,
    public renderer: Renderer2
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        if (this.isPublicPage()) {
          this.IsLoggin = false;
        } else {
          this.IsLoggin = this.authService.getLoginStatus;
          this.roleName = this.authService.getRole();
        }
        this.isSidebarOpen = false;
      }
    });
  }
 
  ngOnInit(): void {
    // ✅ Apply light theme once
    this.applyThemeVars(LIGHT_VARS);
  }
 
  isPublicPage(): boolean {
    return ['/app-landing', '/login', '/registration'].includes(this.currentUrl);
  }
 
  private applyThemeVars(vars: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
 
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
 
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}