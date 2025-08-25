import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { JDConfidentialDashboardDataModel, SecretaryJDDashboardDataModel } from '../../Models/SecretaryJDDashboardDataModel';

@Injectable({
  providedIn: 'root'
})
export class SecretaryJDDashboardService {

  readonly APIUrl = this.appsettingConfig.apiURL + "SecretaryJDDashboard";
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

  public async GetDashboardCount(searchRequest: SecretaryJDDashboardDataModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDashboardCount`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetJDConfidentialDashboardCount(searchRequest: JDConfidentialDashboardDataModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetJDConfidentialDashboardCount`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
