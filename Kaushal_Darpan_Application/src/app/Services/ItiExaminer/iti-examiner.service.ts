import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ItiAssignStudentExaminer, ItiExaminerDataModel, ITITeacherForExaminerSearchModel } from '../../Models/ItiExaminerDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { TeacherForExaminerSearchModel } from '../../Models/ExaminerDataModel';
import { ITI_AppointExaminerDetailsModel, ITI_ExaminerDashboardModel } from '../../Models/ITI/ITI_ExaminerDashboard';
import { ITITheoryExaminer } from '../../Models/ITI/AssignExaminerDataModel';

@Injectable({
  providedIn: 'root'
})
export class ItiExaminerService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ItiExaminer";
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
  //Get 
  public async GetAllData() {
    return await this.http.get(this.APIUrl + "/GetAllData", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  //public async GetByID(PK_ID: number) {
  //  return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
  
  public async SaveData(request: ItiExaminerDataModel) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTeacherForExaminer(searchRequest: ITITeacherForExaminerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTeacherForExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveExaminerData(request: ItiExaminerDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveExaminerData`, body, this.headersOptions)
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

  public async SaveStudent(request: ItiAssignStudentExaminer[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/SaveStudent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    public async GetItiExaminerDashboardTiles(request: ITI_ExaminerDashboardModel) {
        var body = JSON.stringify(request);
        return await this.http.post(`${this.APIUrl}/GetItiExaminerDashboardTiles`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

    public async GetItiAppointExaminerDetails(request: ITI_AppointExaminerDetailsModel) {
        var body = JSON.stringify(request);
        return await this.http.post(`${this.APIUrl}/GetItiAppointExaminerDetails`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

  public async GetItiRemunerationExaminerDetails(request: ITI_AppointExaminerDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetItiRemunerationExaminerDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Iti_RemunerationGenerateAndViewPdf(model: ITI_AppointExaminerDetailsModel): Promise<any> {
    debugger;
    return this.http.post(`${this.APIUrl}/Iti_RemunerationGenerateAndViewPdf`, model, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    }).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async GetITIExaminer(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStudentTheory(searchRequest: ITITeacherForExaminerSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentTheory`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveExaminerdata(request: ITITheoryExaminer) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveExaminerdata`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITIAssignedExaminerInstituteData(BundelID: number) {
    //var body = JSON.stringify(searchRequest);
    return await this.http.get(`${this.APIUrl}/GetITIAssignedExaminerInstituteDetails/` + BundelID,  this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SavePDFSubmitAndForwardToAdmin(model: ITI_AppointExaminerDetailsModel) {
    return await this.http.post(`${this.APIUrl}/SavePDFSubmitAndForwardToAdmin`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetItiRemunerationAdminDetails(request: ITI_AppointExaminerDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetItiRemunerationAdminDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateToApprove(model: ITI_AppointExaminerDetailsModel) {
    return await this.http.post(`${this.APIUrl}/UpdateToApprove`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
