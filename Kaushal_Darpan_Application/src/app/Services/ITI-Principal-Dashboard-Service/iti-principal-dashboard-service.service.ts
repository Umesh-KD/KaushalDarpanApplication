import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { ITIAdminDashboardSearchModel } from '../../Models/ITIAdminDashboardDataModel';
import { ITIPricipalDashboardSearchModel } from '../../Models/ITIPrincipalDashboardDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIPrincipalDashboardServiceService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIAdminDashboard";
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
  public async GetITIPrincipalDashboard(searchRequest: ITIPricipalDashboardSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetITIPrincipalDashboard", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIsWithNumberOfForms(searchRequest: ITIPricipalDashboardSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetITIsWithNumberOfFormsList", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ITIsWithNumberOfFormsPriorityList(searchRequest: ITIPricipalDashboardSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetITIsWithNumberOfFormsPriorityList", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
