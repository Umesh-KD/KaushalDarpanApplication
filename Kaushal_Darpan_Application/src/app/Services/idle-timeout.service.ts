import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '../Common/GlobalConstants';


@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  //constructor(private idle: Idle, private router: Router) {
  //  
  //  this.idle.setIdle(GlobalConstants.SessionTime); // 5 minutes (300 seconds)
  //  this.idle.setTimeout(1); // 1 second after idle time for timeout action
  //  this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

  //  this.idle.onTimeout.subscribe(() => {
  //    alert('Session expired!');
  //    // Clear any stored tokens, navigate to login, etc.
  //    sessionStorage.clear();
  //    localStorage.clear();
  //  });

  //  this.idle.watch(); // Start watching
  //}

  //resetIdleTimer() {
  //  this.idle.watch(); // Restart idle watching
  //}

  //stopIdleTimer() {
  //  this.idle.stop(); // Stop watching
  //}
  
}
