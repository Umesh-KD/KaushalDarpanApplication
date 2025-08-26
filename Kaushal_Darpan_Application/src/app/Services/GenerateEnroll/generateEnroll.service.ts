import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../Models/PreExamStudentDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { EligibleStudentButPendingForVerification, StudentMarkedModel, StudentMasterModel, Student_DataModel } from '../../Models/StudentMasterModels';
import { AppsettingService } from '../../Common/appsetting.service';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { CommonSubjectDetailsMasterModel } from '../../Models/CommonSubjectDetailsMasterModel';
import { GenerateEnrollData, GenerateEnrollSearchModel } from '../../Models/GenerateEnrollDataModel';
@Injectable({
  providedIn: 'root'
})
export class GetEnrollService {
  readonly APIUrl = this.appsettingConfig.apiURL + "GenerateEnroll";
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
  public async GetGenerateEnrollData(request: GenerateEnrollSearchModel ) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateEnrollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPublishedEnRollData(request: GenerateEnrollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetPublishedEnRollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEnrolledData(request: GenerateEnrollData[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ChangeEnRollNoStatus(request: GenerateEnrollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ChangeEnRollNoStatus", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async OnPublish(request: GenerateEnrollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/OnPublish`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveApplicationWorkFlow(request: GenerateEnrollSearchModel) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/SaveApplicationWorkFlow`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetEligibleStudentButPendingForVerification(request: GenerateEnrollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetEligibleStudentButPendingForVerification", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEligibleStudentVerified(request: GenerateEnrollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetEligibleStudentVerified", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEligibleStudentButPendingForVerification(request: EligibleStudentButPendingForVerification[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEligibleStudentButPendingForVerification`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StudentEnrollment_RegistrarStatus(request: EligibleStudentButPendingForVerification[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/StudentEnrollment_RegistrarStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StudentEnrollment_ReturnByRegistrar(request: EligibleStudentButPendingForVerification[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/StudentEnrollment_ReturnByRegistrar`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnRollData_RegistrarVerify(request: GenerateEnrollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetEnRollData_RegistrarVerify", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}

