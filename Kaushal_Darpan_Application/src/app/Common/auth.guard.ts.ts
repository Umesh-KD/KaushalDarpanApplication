// src/app/Common/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SSOLoginService } from '../Services/SSOLogin/ssologin.service';

@Injectable({
  providedIn: 'root'  // This makes AuthGuard available globally in the application
})
export class AuthGuard implements CanActivate {

  constructor(private authService: SSOLoginService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // If the user is logged in, allow navigation, otherwise, redirect to login
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
