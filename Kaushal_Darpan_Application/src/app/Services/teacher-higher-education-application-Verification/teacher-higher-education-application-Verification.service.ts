import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { PrincipleApplicationListSearchModel, TeacherHigherEducationApplicationVerificationModel, TeacherHigherEducationApplicationVerificationSaveModel, UpdateApplicationStatusDataModel_Committee, UpdateApplicationStatusDataModel_Principle } from '../../Models/TeacherHigherEducationApplicationDataModel';

@Injectable({
  providedIn: 'root'
})

export class TeacherHigherEducationApplicationVerificationService {
  readonly APIUrl = this.appsettingConfig.apiURL + "TeacherHigherEducationApplicationVerification";
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

  public async GetEnrolledStudent_Promoted(request: TeacherHigherEducationApplicationVerificationModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_Promoted", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async SaveEnrolledStudentVerify_VerifyandForwardtoExamIncharge(request: TeacherHigherEducationApplicationVerificationSaveModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_VerifyandForwardtoExamIncharge`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEnrolledStudentVerify_ReturnbyExamIncharge(request: TeacherHigherEducationApplicationVerificationSaveModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_ReturnbyExamIncharge`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApplicationList_ForPrinciple_THTE(request: PrincipleApplicationListSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/ApplicationList_ForPrinciple_THTE`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateApplicationStatus_Principle_THTE(request: UpdateApplicationStatusDataModel_Principle[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/UpdateApplicationStatus_Principle_THTE`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ApplicationList_ForDTE_THTE(request: PrincipleApplicationListSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/ApplicationList_ForDTE_THTE`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateApplicationStatus_DTE_THTE(request: UpdateApplicationStatusDataModel_Principle[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/UpdateApplicationStatus_DTE_THTE`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    public async ApplicationList_ForCommittee_THTE(request: PrincipleApplicationListSearchModel) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/ApplicationList_ForCommittee_THTE`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

    public async UpdateApplicationStatus_Committee_THTE(request: UpdateApplicationStatusDataModel_Committee) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/UpdateApplicationStatus_Committee_THTE`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }
}
