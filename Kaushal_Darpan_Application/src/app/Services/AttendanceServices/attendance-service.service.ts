import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, throwError } from 'rxjs';
import { StreamMasterDataModelsTesting } from '../../Models/StreamMasterDataModelsTesting';
import { AppsettingService } from '../../Common/appsetting.service';
import { CalendarEventModel, PostAttendanceTimeTable } from '../../Models/StaffMasterDataModel';

@Injectable({
  providedIn: 'root'
})
export class AttendanceServiceService {
  readonly APIUrl = this.appsettingConfig.apiURL + "Student";
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

  public async SaveAttendanceTimeTable(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveAttendanceTimeTable', request, this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async GetAttendanceTimeTable(model:any) {
    return await this.http.post(this.APIUrl + '/GetAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async PostAttendanceTimeTable(model: any) {
    return await this.http.post(this.APIUrl + '/PostAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetStudentAttendance(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetStudentAttendance_ITI(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async saveAttendanceData(model: any) {
    return await this.http.post(this.APIUrl + '/AddStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async saveAttendanceRopsteData(model: any) {
    return await this.http.post(this.APIUrl + '/saveAttendanceRopsteData', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async saveITI_AttendanceData(model: any) {
    return await this.http.post(this.APIUrl + '/ITI_AddStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async ITIGetAttendanceTimeTable(model: any) {
    return await this.http.post(this.APIUrl + '/ITI_GetAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async PostAttendanceTimeTableList(model: PostAttendanceTimeTable[]) {
    return await this.http.post(this.APIUrl + '/PostAttendanceTimeTableList', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async SetCalendarEventModel(model: CalendarEventModel[]) {
    return await this.http.post(this.APIUrl + '/SetCalendarEventModel', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
  public async getCalendarEventModel(model: CalendarEventModel) {
    return await this.http.post(this.APIUrl + '/getCalendarEventModel', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  
}
