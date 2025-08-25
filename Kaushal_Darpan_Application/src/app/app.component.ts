import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReferrerService } from './Services/referrer.service';
import { UpdateService } from './Services/update.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class AppComponent {
  title = 'Kaushal_Darpan';
  private previousRoute: string = '';            // internal "referrer"
  private currentRoute: string = '';


  constructor(private router: Router, private referrerService: ReferrerService, private updateService: UpdateService) {
    this.currentRoute = this.router.url;
    this.referrerService.setCurrentUrl(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousRoute = this.currentRoute;
        this.currentRoute = event.urlAfterRedirects;
        this.referrerService.setPreviousUrl(this.referrerService.getCurrentUrl());
        this.referrerService.setCurrentUrl(event.urlAfterRedirects);
      }
    });
  }
  //constructor(private router: Router, private referrerService: ReferrerService) {
  //  this.referrerService.setCurrentUrl(this.router.url);

  //  this.router.events.subscribe(event => {
  //    if (event instanceof NavigationEnd) {
  //      this.referrerService.setPreviousUrl(this.referrerService.getCurrentUrl());
  //      this.referrerService.setCurrentUrl(event.urlAfterRedirects);
  //      console.log('urlAfterRedirects:', event.urlAfterRedirects);
  //    }
  //  });

  //}
  //@HostListener('document:click', ['$event'])
  //@HostListener('document:keydown', ['$event'])
  //@HostListener('document:scroll', ['$event'])
  ///*@HostListener('document:mousemove', ['$event'])*/
  //@HostListener('document:touchstart', ['$event'])
  //onUserEvent(event: Event) {
  //  console.log('User Event:', event.type);
  //  console.log('External Referrer (document.referrer):', this.externalReferrer);
  //  console.log('Internal Referrer (last route):', this.previousRoute);
  //  console.log('Target:', event.target);
  //}
  //ngOnInit() {
  //  if (!document.referrer) {
  //    console.log('🔍 User typed the URL directly or refreshed the page.');
  //  } else {
  //    console.log('🌐 User came from:', document.referrer);
  //  }
  //  this.router.events.subscribe(event => {
  //if (event instanceof NavigationEnd) {
  //  this.previousRoute = this.currentRoute;
  //  this.currentRoute = event.urlAfterRedirects;

  //  if (!this.previousRoute && !document.referrer) {
  //    console.log('🚨 User landed directly on this route (not via routerLink or external referrer).');
  //  }
  //}
//});
//  }
}
