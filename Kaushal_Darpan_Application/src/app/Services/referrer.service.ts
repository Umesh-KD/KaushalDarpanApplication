// referrer.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReferrerService {
  private previousUrl: string = '';
  private currentUrl: string = '';

  setPreviousUrl(url: string) {
    this.previousUrl = url;
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  setCurrentUrl(url: string) {
    this.currentUrl = url;
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }
}
