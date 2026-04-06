import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 // ── Your existing properties (KEPT AS-IS) ──────────────
 roleName: string | null = '';
 IsLoggin: boolean = false;
 currentUrl: string = '';
 // ── New theme + sidebar properties ─────────────────────
 isDark: boolean = true;
 isSidebarOpen: boolean = false;
 constructor(
   public authService: AuthService,
   public router: Router,
   public renderer: Renderer2   // ← ADD this (needed for theme)
 ) {
   // ── Your existing router subscription (KEPT AS-IS) ───
   this.router.events.subscribe(event => {
     if (event instanceof NavigationEnd) {
       this.currentUrl = event.urlAfterRedirects;
       // Hide sidebar on public routes (your existing logic)
       if (this.isPublicPage()) {
         this.IsLoggin = false;
       } else {
         this.IsLoggin = this.authService.getLoginStatus;
         this.roleName = this.authService.getRole();
       }
       // Close mobile sidebar on every navigation
       this.isSidebarOpen = false;
     }
   });
 }
 // ── Lifecycle ───────────────────────────────────────────
 ngOnInit(): void {
   // Restore saved theme preference on app load
   const saved = localStorage.getItem('edu-theme') ?? 'dark';
   this.isDark = saved === 'dark';
   this.applyTheme(this.isDark);
 }
 // ── Your existing method (KEPT AS-IS) ──────────────────
 isPublicPage(): boolean {
   return ['/app-landing', '/login', '/registration'].includes(this.currentUrl);
 }
 // ── New: Theme toggle ───────────────────────────────────
 toggleTheme(): void {
   this.isDark = !this.isDark;
   localStorage.setItem('edu-theme', this.isDark ? 'dark' : 'light');
   this.applyTheme(this.isDark);
 }
 private applyTheme(dark: boolean): void {
   // Sets data-theme="dark" or "light" on <html>
   // All CSS variables in styles.scss respond automatically
   this.renderer.setAttribute(
     document.documentElement,
     'data-theme',
     dark ? 'dark' : 'light'
   );
 }
 // ── New: Sidebar toggle ─────────────────────────────────
 toggleSidebar(): void {
   this.isSidebarOpen = !this.isSidebarOpen;
 }
 closeSidebar(): void {
   this.isSidebarOpen = false;
 }
}