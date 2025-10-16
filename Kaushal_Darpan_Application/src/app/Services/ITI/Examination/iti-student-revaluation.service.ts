import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { RevertDataModel, Student_DataModel, StudentAttendenceModel, StudentMarkedModel, StudentMasterModel } from '../../../Models/StudentMasterModels';
import { CommonSubjectDetailsMasterModel } from '../../../Models/CommonSubjectDetailsMasterModel';
import { ITIExamination_UpdateEnrollmentNoModel, ITIExaminationOptionalSubjectRequestModel, ITIExaminationStudentDataModel } from '../../../Models/ITIExaminationDataModel';
import { PreExamStudentDataModel } from '../../../Models/PreExamStudentDataModel';
import { ITIRevaluationModel, SaveStudentDetailsModel } from '../../../Models/RevaluationModel';
import { ITIRevalRequestStudentDetailsModel, ITIRevaluationModel } from '../../../Models/RevaluationModel';

@Injectable({
  providedIn: 'root'
})


export class ITIStudentRevaluationService {
  //readonly APIUrl = this.appsettingConfig.apiURL + "ITIExamination";
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIStudentRevaluation";
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

  public async GetStudentRevaluationDetails(searchRequest: ITIRevaluationModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetStudentRevaluationDetails", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRevalation(row: any) {
    var body = JSON.stringify(row);
    return await this.http.post(this.APIUrl + "/GetAllStudentRevaluation", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveRVLPaymentData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveRVLPaymentData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRVLDetailByStudentApplicationNo(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetRVLDetailByStudentApplicationNo", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




      // ITI Student Reval Request Details
    public async GetAllRevalRequestDetails(searchRequest: ITIRevalRequestStudentDetailsModel) {
      var body = JSON.stringify(searchRequest);
      return await this.http.post(`${this.APIUrl}/GetAllRevalRequestDetails`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }


    public async UploadDocument(request:[]) {
        const body = JSON.stringify(request);
    
        return await this.http.post(this.APIUrl + '/UploadDocument', request, this.headersOptions)
          .pipe(
            catchError(this.handleErrorObservable)
          ).toPromise();
    }
    
   
}
