// menu-freeze.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuFreezeService {
  private freeze$ = new BehaviorSubject<boolean>(false);

  freezeMenus() {
    this.freeze$.next(true);
  }

  unfreezeMenus() {
    this.freeze$.next(false);
  }

  isFrozen() {
    return this.freeze$.asObservable();
  }
}
