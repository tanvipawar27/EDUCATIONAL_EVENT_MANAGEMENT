
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class LandingComponent implements AfterViewInit, OnDestroy {

  currentYear: number = new Date().getFullYear();
  activeSection: string = 'home';
  isScrolled: boolean = false;
  faqOpen: number | null = null;
  mobileMenuOpen: boolean = false;

  private statsAnimated = false;
  private statsObserver?: IntersectionObserver;
  private revealObserver?: IntersectionObserver;
  private rafId: number | null = null;
  private readonly onScrollBound = this.handleScroll.bind(this);

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Always apply light theme — no toggle
    this.applyLightTheme();

    window.addEventListener('scroll', this.onScrollBound, { passive: true });
    this.updateActiveNav();
    this.initStatsObserver();
    this.initRevealObserver();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScrollBound);
    this.statsObserver?.disconnect();
    this.revealObserver?.disconnect();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);

    // Clean up inline styles when leaving landing page
    // so app pages get clean CSS variable slate
    document.documentElement.style.cssText = '';
  }

  private applyLightTheme(): void {
    const root = document.documentElement;
    // Clear any stale inline styles first
    root.style.cssText = '';
    root.setAttribute('data-theme', 'light');

    const lightVars: Record<string, string> = {
      '--bg':           '#fefae8',
      '--bg-2':         '#fdf4cc',
      '--bg-card':      'rgba(255,252,230,0.92)',
      '--bg-glass':     'rgba(255,248,200,0.82)',
      '--nav-bg':       'rgba(254,250,232,0.94)',
      '--text':         '#1a1a2e',
      '--text-sub':     '#3d3d5c',
      '--text-muted':   '#8a8a9a',
      '--accent-1':     '#b45309',
      '--accent-2':     '#7c3aed',
      '--accent-3':     '#0a7c6e',
      '--accent-4':     '#be123c',
      '--glow-1':       'rgba(180,83,9,0.10)',
      '--glow-2':       'rgba(124,58,237,0.08)',
      '--border':       'rgba(180,83,9,0.16)',
      '--border-card':  'rgba(180,83,9,0.22)',
      '--stat-num':     '#b45309',
      '--btn-grad':     'linear-gradient(135deg,#b45309,#7c3aed)',
      '--footer-bg':    '#fdf0a0',
      '--toggle-track-bg': 'rgba(180,83,9,0.14)',
    };

    Object.entries(lightVars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  scrollTo(id: string): void {
    this.mobileMenuOpen = false;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => this.updateActiveNav(), 160);
  }

  private handleScroll(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.isScrolled = window.scrollY > 20;
      this.updateActiveNav();
    });
  }

  updateActiveNav(): void {
    const sections = [
      'home', 'features', 'stats',
      'institution', 'educator', 'student',
      'about', 'faq', 'contact',
    ];
    const offset = 120;
    let current = 'home';

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= offset) current = id;
    }
    this.activeSection = current;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/registration']);
  }

  toggleFaq(index: number): void {
    this.faqOpen = this.faqOpen === index ? null : index;
  }

  private initStatsObserver(): void {
    const statsSection = document.getElementById('stats');
    if (!statsSection) { this.animateStats(); return; }

    if ('IntersectionObserver' in window) {
      this.statsObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateStats();
            this.statsObserver?.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      this.statsObserver.observe(statsSection);
    } else {
      this.animateStats();
    }
  }

  private animateStats(): void {
    const counters = document.querySelectorAll<HTMLElement>('.stat-number');
    if (!counters.length) return;

    counters.forEach((counter) => {
      const targetAttr = counter.getAttribute('data-target');
      const target = targetAttr ? Number(targetAttr) : 0;
      if (!target || Number.isNaN(target)) return;

      const duration = 1400;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.innerText = Math.floor(eased * target).toString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.innerText = `${target}`;
        }
      };

      requestAnimationFrame(tick);
    });
  }

  private initRevealObserver(): void {
    const items = document.querySelectorAll<HTMLElement>('.reveal');
    if (!items.length) return;

    if ('IntersectionObserver' in window) {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      items.forEach((el) => this.revealObserver!.observe(el));
    } else {
      items.forEach((el) => el.classList.add('visible'));
    }
  }
}
