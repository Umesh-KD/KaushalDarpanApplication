import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { TeacherHigherEducationApplicationVerificationModel, TeacherHigherEducationApplicationVerificationSaveModel } from '../../Models/TeacherHigherEducationApplicationDataModel';

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

}
