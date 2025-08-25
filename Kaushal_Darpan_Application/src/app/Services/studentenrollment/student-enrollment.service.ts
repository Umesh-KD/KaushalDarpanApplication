import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ForSMSEnrollmentStudentMarkedModel, StudentMarkedModel, StudentMarkedModelForJoined, StudentMasterModel } from '../../Models/StudentMasterModels';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../Models/PreExamStudentDataModel';

@Injectable({
  providedIn: 'root'
})
export class StudentEnrollmentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "StudentEnrollment";
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

  public async GetStudentAdmitted(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetStudentAdmitted", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 

  public async EditStudentData_PreExam(request: StudentMasterModel) {
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

  public async SaveAdmittedFinalStudentData(request: StudentMarkedModelForJoined[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveAdmittedFinalStudentData`, body, this.headersOptions)
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

  public async SaveDropout(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveDropout`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveRevokeDropout(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveRevokeDropout`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
