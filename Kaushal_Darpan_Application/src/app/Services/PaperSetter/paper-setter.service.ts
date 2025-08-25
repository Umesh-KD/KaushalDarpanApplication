import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { ExaminerCodeLoginModel } from '../../Models/ExaminerCodeLoginModel';
import { TeacherForExaminerSearchModel, ExaminerDataModel, ExaminerSearchModel } from '../../Models/ExaminerDataModel';
import { AppointPaperSetterDataModel, PaperSetterDataModel, PaperSetterSearchModel, TeacherForPaperSetterSearchModel, VerifyPaperSetterDataModel } from '../../Models/PaperSetterDataModel';

@Injectable({
  providedIn: 'root'
})
export class PaperSetterService {
  readonly APIUrl = this.appsettingConfig.apiURL + "PaperSetter";
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

  public async GetTeacherForExaminer(searchRequest: TeacherForPaperSetterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTeacherForExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveExaminerData(request: PaperSetterDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerData(searchRequest: PaperSetterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteById(PaperSetterID: number, userId: number) {
    var body = JSON.stringify({ "PaperSetterID": PaperSetterID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${PaperSetterID}/${userId}`, this.headersOptions)
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


  public async GetByID(PK_ID: number, StaffSubject: number = 0, DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID + "/" + StaffSubject + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AppointPaperSetter(model: AppointPaperSetterDataModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/AppointPaperSetter`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPaperSetterStaffDetails(PaperSetterID: number) {
    return await this.http.get(this.APIUrl + "/GetPaperSetterStaffDetails/" + PaperSetterID , this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async VerifyPaperSetter(model: VerifyPaperSetterDataModel[]) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/VerifyPaperSetter`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GeneratePaperSetterOrder(model: VerifyPaperSetterDataModel[]) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/GeneratePaperSetterOrder`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetStaffOrder(model: VerifyPaperSetterDataModel) {
    var body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/GetStaffOrder`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
