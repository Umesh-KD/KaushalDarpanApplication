import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { StudentMarkedModel } from '../../Models/StudentEnrollmentApprovalRejectModels';
import { EnrolledPromotedStudentModel } from '../../Models/EnrolledPromotedStudentDataModel';

@Injectable({
  providedIn: 'root'
})
export class EnrolledPromotedStudentVerifyService {
  readonly APIUrl = this.appsettingConfig.apiURL + "EnrolledPromotedStudentVerify";
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

  public async GetEnrolledStudent_Promoted(request: EnrolledPromotedStudentModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_Promoted", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnrolledStudent_VerifyandForwardtoExamIncharge(request: EnrolledPromotedStudentModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_VerifyandForwardtoExamIncharge", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnrolledStudent_VerifyandForwardtoRegistrar(request: EnrolledPromotedStudentModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_VerifyandForwardtoRegistrar", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnrolledStudent_ApprovebyRegistrar(request: EnrolledPromotedStudentModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_ApprovebyRegistrar", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnrolledStudent_ReturnbyRegistrar(request: EnrolledPromotedStudentModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_ReturnbyRegistrar", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async SaveEnrolledStudentVerify_VerifyandForwardtoExamIncharge(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_VerifyandForwardtoExamIncharge`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEnrolledStudentVerify_VerifyandForwardtoRegistrar(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_VerifyandForwardtoRegistrar`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEnrolledStudentVerify_ApprovebyRegistrar(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_ApprovebyRegistrar`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEnrolledStudentVerify_ReturnbyRegistrar(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_ReturnbyRegistrar`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEnrolledStudentVerify_SelectedforExamination(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_SelectedforExamination`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEnrolledStudentVerify_ReturnbyExamIncharge(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_ReturnbyExamIncharge`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnrolledStudent_ReturnbyExamIncharge(request: EnrolledPromotedStudentModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_ReturnbyExamIncharge", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
