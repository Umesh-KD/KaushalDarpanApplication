import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';


export interface DevToolsConfig {
  enableDevTools: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class DevelopertoolnotopenService {

  readonly APIUrl = this.appsettingConfig.apiURL + "Developertoolnotopen";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }

  getDevToolsConfig(): Observable<DevToolsConfig> {
    return this.http.get<DevToolsConfig>(this.APIUrl +"/devtools-config");
  }
}
