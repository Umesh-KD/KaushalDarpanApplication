import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError, BehaviorSubject } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { IssueTrackerDataModels } from '../../Models/IssueTrackerDataModels';
//import { AdminDashboardIssueTrackerSearchModel } from '../../Models/AdminDashboardIssueTrackerSearchModel';
import { AdminDashboardSearchModel } from '../../Models/AdminDashboardDataModel';
//import { IssuetrackerDashboardComponent } from '../Models/IssuetrackerDashboardComponent';



import { ITIsDataModels } from '../../Models/ITIsDataModels';
;

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardIssueTrackerService {

  readonly APIUrl = this.appsettingConfig.apiURL + "AdminDashboardIssueTracker";
  readonly headersOptions: any;
  private dataSource = new BehaviorSubject<any>(null);
  data$ = this.dataSource.asObservable();
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetAdminDashData(searchRequest: AdminDashboardSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAdminDashData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
