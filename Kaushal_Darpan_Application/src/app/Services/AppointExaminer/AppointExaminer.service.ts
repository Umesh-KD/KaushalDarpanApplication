import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { AppointExaminerSearchModel, AppointmentExaminerDataModel } from '../../Models/AppointExaminerDataModel';


@Injectable({
  providedIn: 'root'
})
export class AppointExaminerService {

  readonly APIUrl = this.appsettingConfig.apiURL + "AppointExaminer";
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

  //Get all data
  public async GetAllData(searchRequest: AppointExaminerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAllData" + "/", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get by id
  public async GetById(AppointExaminerID: number, DepartmentID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${AppointExaminerID}/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //save data
  public async SaveData(request: AppointmentExaminerDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(AppointExaminerID: number, userId: number) {
    var body = JSON.stringify({ "AppointExaminerID": AppointExaminerID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteDataByID/${AppointExaminerID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
