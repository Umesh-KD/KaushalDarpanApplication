import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError, BehaviorSubject } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { AdminDashboardSearchModel, AdminDashboardIssueTrackerSearchModel } from '../../Models/AdminDashboardDataModel';
import { ITIsDataModels } from '../../Models/ITIsDataModels';


@Injectable({
  providedIn: 'root'
})
export class AdminDashboardDataService {

  readonly APIUrl = this.appsettingConfig.apiURL + "AdminDashboard";
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
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async SaveData(request: ITIsDataModels) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
    }

    public async GetAdminDashData(searchRequest: AdminDashboardSearchModel) {
        var body = JSON.stringify(searchRequest);
        return await this.http.post(this.APIUrl + "/GetAdminDashData", body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }

  public async GetAdminDashReportsData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAdminDashReportsData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  updateData(newData: any) {
    this.dataSource.next(newData);
  }

  public async GetITI_TeacherDashboard(searchRequest: AdminDashboardSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetITI_TeacherDashboard", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(searchRequest: AdminDashboardIssueTrackerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAdminDashData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
