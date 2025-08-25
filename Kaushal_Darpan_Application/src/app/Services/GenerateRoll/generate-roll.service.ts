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
import { DownloadnRollNoModel, GenerateRollData, GenerateRollSearchModel, VerifyRollNumberList } from '../../Models/GenerateRollDataModels';
import { CollegeMasterSearchModel } from '../../Models/CollegeMasterDataModels';
@Injectable({
  providedIn: 'root'
})
export class GetRollService {
  readonly APIUrl = this.appsettingConfig.apiURL + "GenerateRoll";
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
  public async GetGenerateRollData(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request); 
    return await this.http.post(this.APIUrl + "/GetGenerateRollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetGenerateRevelData(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateRevelData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveRolledData(request: GenerateRollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/SaveRolledData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAllRevelData(request: GenerateRollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/SaveAllRevelData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async OnPublish(request: GenerateRollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/OnPublish`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async OnPublishRevelData(request: GenerateRollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/OnPublishRevelData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetGenerateRollDataForPrint(request: DownloadnRollNoModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateRollDataForPrint", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadStudentRollNumber(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/DownloadStudentRollNumber`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPublishedRollData(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request); 
    return await this.http.post(this.APIUrl + "/GetPublishedRollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRevalRollNoData_Verify(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request); 
    return await this.http.post(this.APIUrl + "/GetRevalRollNoData_Verify", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetVerifyRollData(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetVerifyRollList", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async VerifyRollListPdf(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetVerifyRollListPdf", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //For ITI Admit & Roll List PDF Generation
  public async GetITIAdmit_RollListPdf(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetITIAdmit_RollListPdf", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async ChangeRollNoStatus(request: GenerateRollSearchModel)
  {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ChangeRollNoStatus", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ChangeRevalRollNoStatus(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ChangeRevalRollNoStatus", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRollNumberDetails_History(request: GenerateRollSearchModel)
  {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetRollNumberDetails_History", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetPublishedEnrollollData(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetPublishedEnrollollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveWorkflow(request: VerifyRollNumberList[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/SaveWorkflow`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeRollListAndAdmitCard(searchRequest: CollegeMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetCollegeRollListAndAdmitCard", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ViewGenerateRollData(request: GenerateRollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ViewGenerateRollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
      
