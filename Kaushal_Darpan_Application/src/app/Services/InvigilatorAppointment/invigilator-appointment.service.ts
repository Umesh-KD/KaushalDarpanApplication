import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { catchError, throwError } from 'rxjs';
import { InvigilatorAppointmentDataModel, InvigilatorSearchModel, UnlockExamAttendanceDataModel } from '../../Models/InvigilatorAppointmentDataModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class InvigilatorAppointmentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "InvigilatorAppointmentMaster";
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

  public async GetAllData(body: InvigilatorSearchModel) {
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: InvigilatorAppointmentDataModel) {
    var body = JSON.stringify(request);
    
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById(PK_ID: number, DepartmentID: number = 0) {
    return await this.http.get(`${this.APIUrl}/GetByID/${PK_ID}/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteById(PK_Id: number, UserID: number, DepartmentID: number = 0) {
    var body = JSON.stringify({ "PK_Id": PK_Id, "UserID": UserID });
    return await this.http.delete(`${this.APIUrl}/deletebyid/${PK_Id}/${UserID}/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UnlockExamAttendance_GetCSData(body: InvigilatorSearchModel) {
    return await this.http.post(`${this.APIUrl}/UnlockExamAttendance_GetCSData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UnlockExamAttendance(request: UnlockExamAttendanceDataModel) {
    var body = JSON.stringify(request);
    
    return await this.http.post(`${this.APIUrl}/UnlockExamAttendance`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
