import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ExaminerDataModel, ExaminerSearchModel, TeacherForExaminerSearchModel } from '../../Models/ExaminerDataModel';
import { ExaminerCodeLoginModel, ExaminerDashboardSearchModel } from '../../Models/ExaminerCodeLoginModel';

@Injectable({
  providedIn: 'root'
})
export class ExaminerService {
  readonly APIUrl = this.appsettingConfig.apiURL + "Examiners";
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

  public async GetTeacherForExaminer(searchRequest: TeacherForExaminerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTeacherForExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveExaminerData(request: ExaminerDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerData(searchRequest: ExaminerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteById(ExaminerID: number, userId: number) {
    var body = JSON.stringify({ "ExaminerID": ExaminerID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${ExaminerID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerByCode(model: ExaminerCodeLoginModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/GetExaminerByCode`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetByID(PK_ID: number, StaffSubject: number = 0, DepartmentID: number = 0, EndTermID: number = 0, CourseTypeID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID + "/" + StaffSubject + "/" + DepartmentID + "/" + EndTermID + "/" + CourseTypeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ExaminerInchargeDashboard(model: ExaminerDashboardSearchModel)
  {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/ExaminerInchargeDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async RegistrarDashboard(model: ExaminerDashboardSearchModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/RegistrarDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITSupportDashboard(model: ExaminerDashboardSearchModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/ITSupportDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SectionInchargeDashboard(model: ExaminerDashboardSearchModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/SectionInchargeDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ACPDashboard(model: ExaminerDashboardSearchModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/ACPDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StoreKeeperDashboard(model: ExaminerDashboardSearchModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/StoreKeeperDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetRevalTeacherForExaminer(searchRequest: TeacherForExaminerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetRevalTeacherForExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //----------------------------------------------------------------- REVAL ----------------------------------------------------------

  public async Getexaminer_byID_Reval(PK_ID: number, StaffSubject: number = 0, DepartmentID: number = 0, EndTermID: number = 0, CourseTypeID: number = 0) {
    return await this.http.get(this.APIUrl + "/Getexaminer_byID_Reval/" + PK_ID + "/" + StaffSubject + "/" + DepartmentID + "/" + EndTermID + "/" + CourseTypeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveExaminerData_Reval(request: ExaminerDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveExaminerData_Reval`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerData_Reval(searchRequest: ExaminerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetExaminerData_Reval`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteByID_Reval(ExaminerID: number, userId: number) {
    var body = JSON.stringify({ "ExaminerID": ExaminerID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID_Reval/${ExaminerID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerByCode_Reval(model: ExaminerCodeLoginModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/GetExaminerByCode_Reval`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
