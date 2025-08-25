import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError, catchError, BehaviorSubject } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITITeacherDashboardSearchModel } from '../../../Models/ITI/ITITeacherDashboardDataModel';
import { ITIsDataModels } from '../../../Models/ITIsDataModels';
@Injectable({
  providedIn: 'root'
})
export class ITITeacherDashboardService {
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

  public async GetITI_TeacherDashboard(searchRequest: ITITeacherDashboardSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetITI_TeacherDashboard", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
