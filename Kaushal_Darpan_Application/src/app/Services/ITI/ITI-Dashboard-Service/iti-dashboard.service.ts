import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class ITIDashboardService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIDashboard";
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



  public async GetRegistrarDashData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetRegistrarDashData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSecretaryJDDashData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetSecretaryJDDashData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
