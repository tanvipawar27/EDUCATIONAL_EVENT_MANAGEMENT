import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class LandingComponent implements AfterViewInit {

  currentYear: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  /* ===============================
     STATS COUNT ANIMATION (UNCHANGED)
     =============================== */
  ngAfterViewInit(): void {
    this.animateStats();
  }

  private animateStats(): void {
    const counters = document.querySelectorAll<HTMLElement>('.stat-number');

    counters.forEach(counter => {
      const target = Number(counter.getAttribute('data-target'));
      const hasPlus = counter.innerText.includes('+');
      let current = 0;

      const increment = Math.max(1, Math.floor(target / 100));

      const update = () => {
        current += increment;

        if (current < target) {
          counter.innerText = current + (hasPlus ? '+' : '');
          requestAnimationFrame(update);
        } else {
          counter.innerText = target + (hasPlus ? '+' : '');
        }
      };

      update();
    });
  }

  /* ===============================
     ✅ SAME‑PAGE AUTO SCROLL (FIXED)
     =============================== */
  scrollTo(sectionId: string): void {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/registration']);
  }
}