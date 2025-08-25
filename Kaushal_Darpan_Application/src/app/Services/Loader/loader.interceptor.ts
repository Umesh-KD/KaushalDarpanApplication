// loader.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { LoaderService } from './loader.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { ReferrerService } from '../referrer.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  public sSOLoginDataModel = new SSOLoginDataModel();
  private totalRequests = 0;
  constructor(private referrerService: ReferrerService, private router: Router, private cookieService: CookieService, private loaderService: LoaderService, private Swal2: SweetAlert2, private toastr: ToastrService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  Logout() {
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('LoginID');
    sessionStorage.clear();
    localStorage.clear();
    this.cookieService.set('LoginStatus', "");
    this.cookieService.deleteAll();
    try {
      this.router.navigate(['/login']);
    }
    catch (Ex) {
      console.log(Ex);
    }
    }


  intercept123(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const internalReferrer = this.referrerService.getPreviousUrl();
    const currentReferrer = this.referrerService.getCurrentUrl();
   /* const currentUrl = this.router.url.toLowerCase().trim().replace(/^\/+/, '');*/
    const currentUrl = currentReferrer
      .split('?')[0]             // Remove query params
      .replace(/^\/+/, '')       // Remove leading slashes
      .split('/')[0];
    const referrerUrl = internalReferrer
      .split('?')[0]             // Remove query params
      .replace(/^\/+/, '')       // Remove leading slashes
      .split('/')[0];

    if (currentUrl && currentUrl != 'dashboard' && currentUrl != 'login' && this.sSOLoginDataModel?.RoleID) {
      const storedMenu = this.sSOLoginDataModel?.SSOMenu;// localStorage.getItem('Menu');
      if (storedMenu != undefined &&  storedMenu != null) {
        const filterMenuData: IMenu[] = storedMenu;// JSON.parse(storedMenu);
        const isMatched = filterMenuData.some(
          x => x.OnSelect.replaceAll("/","").toLowerCase().trim() === currentUrl.toLowerCase().trim()
        );
        if (!isMatched) {
          console.log('You only work within active session');
          if (referrerUrl == "") {
            //this.Logout();
            //this.router.navigateByUrl("404");
           // this.toastr.error("⚠️ Access Denied. Please contact your administrator for permission.");
          }
          if (referrerUrl && referrerUrl != 'dashboard' && referrerUrl != 'login' && this.sSOLoginDataModel?.RoleID) {
         
            const storedMenu = this.sSOLoginDataModel?.SSOMenu;
            if (storedMenu != undefined && storedMenu != null) {
              const filterMenuData: IMenu[] = storedMenu;// JSON.parse(storedMenu);
              const isMatched1 = filterMenuData.some(
                x => x.OnSelect.replaceAll("/", "").toLowerCase().trim() === referrerUrl.toLowerCase().trim()
              );
              if (!isMatched1) {
               // this.toastr.error("⚠️ Access Denied. Please contact your administrator for permission.");
               // this.router.navigateByUrl("404");
                //this.toastr.error("isMatched1");
              }
            }
          }          
        }
      }
    }
    
    //return next.handle(req);


    //// Check if the request has the 'no-loader' header
    if (req.headers.has('no-loader')) {
      // If the header exists, skip the loader logic
      return next.handle(req);
    }


    this.totalRequests++;
    this.loaderService.show();

    //let showLoaderTimeout: any;
    //const loaderDelay = 5000; // 5 seconds

    //// Set a timeout to show the loader only if the request takes longer than 5 seconds
    //showLoaderTimeout = setTimeout(() => {
    //  this.loaderService.show();
    //}, loaderDelay);




   
    return next.handle(req).pipe(
      mergeMap(event => {
        
        if (event instanceof HttpResponse) {
          if (event.body?.Data === GlobalConstants.UN_AUTH_ROLE) {
            // Redirect to unauthorized route
            this.router.navigate(['/**']);
            // Optionally return an empty response or cancel the stream
            return of(); // or: throwError(() => new Error('Unauthorized'))
          }
        }
        return of(event); // continue as normal
      }),
      catchError(error => {
        console.error('Error:', error);
        return of(error); // rethrow if needed
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loaderService.hide();
        }
      })
    );
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const internalReferrer = this.referrerService.getPreviousUrl();
    const currentReferrer = this.referrerService.getCurrentUrl();

    const currentUrl = this.extractFirstPath(currentReferrer);
    const referrerUrl = this.extractFirstPath(internalReferrer);
    if (this.shouldCheckAccess(currentUrl)) {
      if (!this.isMenuMatched(currentUrl)) {
        //console.warn('Access Denied: Current URL not in user menu.');
        if (!referrerUrl || !this.isMenuMatched(referrerUrl)) {
          //this.toastr.error("⚠️ Access Denied. Please contact your administrator for permission.");
          //this.router.navigateByUrl("404");
        }
      }
    }

    if (req.headers.has('no-loader')) {
      return next.handle(req);
    }

    this.totalRequests++;
    this.loaderService.show();

    return next.handle(req).pipe(
      mergeMap(event => {
        if (event instanceof HttpResponse && event.body?.Data === GlobalConstants.UN_AUTH_ROLE) {
          this.router.navigate(['/**']);
          return of();
        }
        return of(event);
      }),
      catchError(error => {
        console.error('HTTP Error:', error);
        return of(error);
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loaderService.hide();
        }
      })
    );
  }

  // --- Helpers ---

  private extractFirstPath(url: string): string {
    return url?.split('?')[0]?.replace(/^\/+/, '')?.split('/')[0]?.toLowerCase() || '';
  }

  private shouldCheckAccess(url: string): boolean {
    const hasValidUrl = typeof url === 'string' && url.trim() !== '' && url !== 'dashboard' && url !== 'login';
    const hasRole = !!this.sSOLoginDataModel?.RoleID;
    return hasValidUrl && hasRole;
  }

  private isMenuMatched(urlSegment: string): boolean {
    const menu = this.sSOLoginDataModel?.SSOMenu;
    return !!menu?.some(item =>
      item.OnSelect.replace(/\/\d+$/, "").replace(/\//g, "").toLowerCase().trim() === urlSegment.replace(/\/\d+$/, "").replace(/\//g, "").toLowerCase().trim()
    );
  }


}

export interface IMenu {
  "GroupId": Number;
  "GroupId_Count": Number;
  "IDdd": String;
  "Icon": String;
  "IsMobileMenu": Boolean;
  "LevelNo": Number;
  "MenuId": Number;
  "MenuName": String;
  "OnSelect": String;
  "ParentId": Number;
  "Priority": Number;
}
