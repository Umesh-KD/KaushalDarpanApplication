import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { StudentMarkedModel, StudentEnrollmentApprovalReject } from '../../Models/StudentEnrollmentApprovalRejectModels';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../Models/PreExamStudentDataModel';
@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentApprovalRejectService {
  readonly APIUrl = this.appsettingConfig.apiURL + "PreExamStudent";
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

  public async GetPreExamStudent(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetPreExamStudent", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async EditStudentData_PreExam(request: StudentEnrollmentApprovalReject) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EditStudentData_PreExam", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData_PreExam_UpdateEnrollmentNo(request: PreExam_UpdateEnrollmentNoModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/PreExam_UpdateEnrollmentNo", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAdmittedStudentData(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveAdmittedStudentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UndoRejectAtbter(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/UndoRejectAtbter`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEligibleForEnrollment(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEligibleForEnrollment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //Get Enrolled Student Annexture
  public async GetAnnextureListPreExamStudent(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetAnnextureListPreExamStudent", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async SaveRejectAtBTER(request: StudentMarkedModel[]) {
    
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveRejectAtBTER`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentEnrollmentApprovalReject(request: PreExamStudentDataModel) {
    
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetStudentEnrollmentApprovalReject", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveRejectAtBTERApprovalReject(request: StudentMarkedModel[]) {
    
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveRejectAtBTERApprovalReject`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
