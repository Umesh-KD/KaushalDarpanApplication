import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../Common/appsetting.service';
import { RequestBaseModel } from '../../Models/RequestBaseModel';


@Injectable({
  providedIn: 'root'
})
export class AnalyticDashboardService {

  readonly APIUrl = this.appsettingConfig.apiURL + "AnalyticDashboard";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })  
    };
  }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetAnalyticDashboard(searchRequest: RequestBaseModel) {
    const body = JSON.stringify(searchRequest);
    return this.http.get(`${this.APIUrl}/GetAnalyticDashboard`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      );
  }
}
