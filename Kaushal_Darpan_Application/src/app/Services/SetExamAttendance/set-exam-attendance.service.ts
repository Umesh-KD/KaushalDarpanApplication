import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SetExamAttendanceModel, SetExamAttendanceSearchModel } from '../../Models/SetExamAttendanceDataModel';
import { SetExamAttendanceModule } from '../../Views/SetExamAttendance/set-exam-attendance/set-exam-attendance.module';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class SetExamAttendanceService {

  readonly APIUrl = this.appsettingConfig.apiURL + "SetExamAttendance";
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

  public async GetExamStudentData(searchRequest: SetExamAttendanceSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetExamStudentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: SetExamAttendanceModel[], id: number=0) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData/${id}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise(); 
  }

  public async GetExamAttendence(searchRequest: SetExamAttendanceSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetExamAttendence`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExamStudentData_Internal(searchRequest: SetExamAttendanceSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetExamStudentData_Internal`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
