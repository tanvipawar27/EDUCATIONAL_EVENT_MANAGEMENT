// import { AfterViewInit, Component, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-landing',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class LandingComponent implements AfterViewInit, OnDestroy {

//   currentYear: number = new Date().getFullYear();

//   private statsObserver?: IntersectionObserver;
//   private statsAnimated = false;

//   // For smooth active-link updates without heavy scroll work
//   private rafId: number | null = null;
//   private onScrollBound = this.handleScroll.bind(this);

//   constructor(private router: Router) {}

//   ngAfterViewInit(): void {
//     // ✅ Highlight active nav item on scroll
//     window.addEventListener('scroll', this.onScrollBound, { passive: true });
//     this.updateActiveNav(); // initial highlight

//     // ✅ Animate stats when stats section becomes visible
//     const statsSection = document.getElementById('stats');

//     // Fallback if element missing or browser doesn't support IntersectionObserver
//     if (!statsSection) {
//       // still try to animate if counters exist
//       this.animateStats();
//       return;
//     }

//     if ('IntersectionObserver' in window) {
//       this.statsObserver = new IntersectionObserver(
//         (entries) => {
//           const entry = entries[0];
//           if (entry.isIntersecting && !this.statsAnimated) {
//             this.statsAnimated = true;
//             this.animateStats();
//             this.statsObserver?.disconnect();
//           }
//         },
//         { threshold: 0.35 }
//       );

//       this.statsObserver.observe(statsSection);
//     } else {
//       // Old browser fallback: animate immediately
//       this.animateStats();
//     }
//   }

//   ngOnDestroy(): void {
//     window.removeEventListener('scroll', this.onScrollBound);
//     this.statsObserver?.disconnect();

//     if (this.rafId !== null) {
//       cancelAnimationFrame(this.rafId);
//       this.rafId = null;
//     }
//   }

//   /* =========================================================
//      ✅ NEW: Smooth scroll for navbar items (fix scroll issue)
//      Use this in HTML: (click)="scrollTo('stats')" etc.
//      ========================================================= */
//   scrollTo(id: string): void {
//     const el = document.getElementById(id);
//     if (!el) return;

//     el.scrollIntoView({ behavior: 'smooth', block: 'start' });

//     // Also update active nav quickly after click
//     // (helps when user clicks but scroll hasn't completed yet)
//     setTimeout(() => this.updateActiveNav(), 150);
//   }

//   /* =========================================================
//      ✅ Count-up animation (runs once)
//      ========================================================= */
//   private animateStats(): void {
//     const counters = document.querySelectorAll<HTMLElement>('.stat-number');
//     if (!counters.length) return;

//     counters.forEach((counter) => {
//       const targetAttr = counter.getAttribute('data-target');
//       const target = targetAttr ? Number(targetAttr) : 0;
//       if (!target || Number.isNaN(target)) return;

//       const duration = 1000; // ms
//       const start = performance.now();

//       const tick = (now: number) => {
//         const progress = Math.min((now - start) / duration, 1);
//         const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
//         const value = Math.floor(eased * target);

//         counter.innerText = value.toString();

//         if (progress < 1) {
//           requestAnimationFrame(tick);
//         } else {
//           counter.innerText = `${target}+`;
//         }
//       };

//       requestAnimationFrame(tick);
//     });
//   }

//   /* =========================================================
//      ✅ Smooth & efficient scroll handler
//      ========================================================= */
//   private handleScroll(): void {
//     // throttle using requestAnimationFrame
//     if (this.rafId !== null) return;

//     this.rafId = requestAnimationFrame(() => {
//       this.updateActiveNav();
//       this.rafId = null;
//     });
//   }

//   /* =========================================================
//      ✅ Active nav highlighting while scrolling
//      Requires <a class="nav-item" data-section="stats"> etc OR href="#stats"
//      We'll match href="#id" (works with your current setup)
//      ========================================================= */
//   private updateActiveNav(): void {
//     const ids = ['top', 'core-features', 'stats', 'roles', 'contact'];

//     const sections = ids
//       .map((id) => document.getElementById(id))
//       .filter((el): el is HTMLElement => !!el);

//     // sticky header offset
//     const scrollPos = window.scrollY + 140;

//     let activeId = 'top';
//     for (const sec of sections) {
//       if (scrollPos >= sec.offsetTop) activeId = sec.id;
//     }

//     const links = document.querySelectorAll<HTMLAnchorElement>('.nav-links a.nav-item');
//     links.forEach((a) => {
//       // Works if href="#stats" etc.
//       const href = a.getAttribute('href');
//       a.classList.toggle('active', href === `#${activeId}`);
//     });
//   }

//   /* =========================================================
//      Existing navigation (unchanged)
//      ========================================================= */
  // goToLogin() {
  //   this.router.navigate(['/login']);
  // }

  // goToRegister() {
  //   this.router.navigate(['/registration']);
  // }
// }

import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// ─────────────────────────────────────────────────────────────────────────────
//  Dark-theme CSS variables (aurora palette)
// ─────────────────────────────────────────────────────────────────────────────
const DARK_VARS: Record<string, string> = {
  '--bg':           '#080c18',
  '--bg-2':         '#0d1426',
  '--bg-card':      'rgba(15,22,45,0.82)',
  '--bg-glass':     'rgba(12,20,40,0.7)',
  '--nav-bg':       'rgba(8,12,24,0.88)',
  '--text':         '#e8eeff',
  '--text-sub':     '#8fa3cc',
  '--text-muted':   '#4e6080',
  '--accent-1':     '#5b8fff',
  '--accent-2':     '#a78bfa',
  '--accent-3':     '#34d9c3',
  '--accent-4':     '#f472b6',
  '--glow-1':       'rgba(91,143,255,0.18)',
  '--glow-2':       'rgba(167,139,250,0.14)',
  '--border':       'rgba(91,143,255,0.12)',
  '--border-card':  'rgba(91,143,255,0.18)',
  '--stat-num':     '#5b8fff',
  '--btn-grad':     'linear-gradient(135deg,#5b8fff,#a78bfa)',
  '--footer-bg':    '#050810',
  '--toggle-track-bg': 'rgba(91,143,255,0.16)',
};

// ─────────────────────────────────────────────────────────────────────────────
//  Light-theme CSS variables (golden / warm palette)
// ─────────────────────────────────────────────────────────────────────────────
const LIGHT_VARS: Record<string, string> = {
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

@Component({
  selector: 'app-landing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class LandingComponent implements AfterViewInit, OnDestroy {

  // ── Public state ────────────────────────────────────────────────────────────
  currentYear: number = new Date().getFullYear();
  activeSection: string = 'home';
  isScrolled: boolean = false;
  isDark: boolean = true;
  faqOpen: number | null = null;
  mobileMenuOpen: boolean = false;

  // ── Private internals ───────────────────────────────────────────────────────
  private statsAnimated = false;
  private statsObserver?: IntersectionObserver;
  private revealObserver?: IntersectionObserver;
  private rafId: number | null = null;
  private readonly onScrollBound = this.handleScroll.bind(this);

  constructor(private router: Router) {}

  // ══════════════════════════════════════════════════════════════════════════
  //  Lifecycle
  // ══════════════════════════════════════════════════════════════════════════
  ngAfterViewInit(): void {
    // Apply saved theme
    const saved = localStorage.getItem('edu-theme') ?? 'dark';
    this.isDark = saved === 'dark';
    this.applyTheme(this.isDark);

    // Scroll listener (passive for performance)
    window.addEventListener('scroll', this.onScrollBound, { passive: true });
    this.updateActiveNav();

    // Stats counter observer
    this.initStatsObserver();

    // Reveal-on-scroll observer
    this.initRevealObserver();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScrollBound);
    this.statsObserver?.disconnect();
    this.revealObserver?.disconnect();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  Theme toggle
  // ══════════════════════════════════════════════════════════════════════════
  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('edu-theme', this.isDark ? 'dark' : 'light');
    this.applyTheme(this.isDark);
  }

  private applyTheme(dark: boolean): void {
    const root = document.documentElement;
    const vars = dark ? DARK_VARS : LIGHT_VARS;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  Smooth scroll to section
  // ══════════════════════════════════════════════════════════════════════════
  scrollTo(id: string): void {
    this.mobileMenuOpen = false;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Fast-update active nav after click
    setTimeout(() => this.updateActiveNav(), 160);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  Scroll handler — updates navbar background + active link
  // ══════════════════════════════════════════════════════════════════════════
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
 goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/registration']);
  }
  // ══════════════════════════════════════════════════════════════════════════
  //  FAQ accordion
  // ══════════════════════════════════════════════════════════════════════════
  toggleFaq(index: number): void {
    this.faqOpen = this.faqOpen === index ? null : index;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  Stats count-up animation (runs once on intersection)
  // ══════════════════════════════════════════════════════════════════════════
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
      // Fallback: animate immediately
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

      const duration = 1400; // ms
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutCubic
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

  // ══════════════════════════════════════════════════════════════════════════
  //  Reveal-on-scroll (IntersectionObserver for all .reveal elements)
  // ══════════════════════════════════════════════════════════════════════════
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
      // Fallback: show all
      items.forEach((el) => el.classList.add('visible'));
    }
  }
}








