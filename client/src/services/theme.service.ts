import { Injectable } from '@angular/core';

type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'edu-theme';
  private mode: ThemeMode = 'dark';

  init(): void {
    const saved = (localStorage.getItem(this.key) as ThemeMode) || 'dark';
    this.set(saved);
  }

  toggle(): void {
    this.set(this.mode === 'dark' ? 'light' : 'dark');
  }

  set(mode: ThemeMode): void {
    this.mode = mode;
    localStorage.setItem(this.key, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }

  get current(): ThemeMode {
    return this.mode;
  }
}