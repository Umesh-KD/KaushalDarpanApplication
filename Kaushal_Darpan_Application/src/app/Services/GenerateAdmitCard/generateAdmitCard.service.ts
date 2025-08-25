import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../Models/PreExamStudentDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { StudentMarkedModel, StudentMasterModel, Student_DataModel } from '../../Models/StudentMasterModels';
import { AppsettingService } from '../../Common/appsetting.service';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { CommonSubjectDetailsMasterModel } from '../../Models/CommonSubjectDetailsMasterModel';
import { GenerateEnrollData, GenerateEnrollSearchModel } from '../../Models/GenerateEnrollDataModel';
import { GenerateAdmitCardModel, GenerateAdmitCardSearchModel } from '../../Models/GenerateAdmitCardDataModel';
@Injectable({
  providedIn: 'root'
})
export class GetAdmitCardService {
  readonly APIUrl = this.appsettingConfig.apiURL + "GenerateAdmitCard";
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
  public async GetGenerateAdmitCardData(request: GenerateAdmitCardSearchModel ) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateAdmitCardData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetGenerateAdmitCardDataBulk(request: GenerateAdmitCardSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateAdmitCardDataBulk", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGetGenerateAdmitCardDataBulk(request: GenerateAdmitCardSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ITIGetGenerateAdmitCardDataBulk", body, this.headersOptions)
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

  public async OnPublish(request: GenerateEnrollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/OnPublish`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 
}

