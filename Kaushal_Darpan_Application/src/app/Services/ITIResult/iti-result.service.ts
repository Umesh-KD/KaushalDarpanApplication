import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ItiGetPassFailResultDataModel, ItiGetResultDataModel } from '../../Models/ITI/ITI_ResultModel';

@Injectable({
  providedIn: 'root'
})
export class ITIResultService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIResult";
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

  public async GetGenerateResult(requestObj: ItiGetResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GenerateResult`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetResultData(requestObj: ItiGetResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GetResultData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPublishResult(requestObj: ItiGetResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/PublishResult`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetResultCurrentStatus(requestObj: ItiGetResultDataModel)
  {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GetCurrentResultStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCFormReport(requestObj: ItiGetResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GetCFormReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadCFormReport(requestObj: ItiGetResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/DownloadCFormReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentPassFailResultData(requestObj: ItiGetPassFailResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GetStudentPassFailResultData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCurrentPassFailResultStatus(requestObj: ItiGetPassFailResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GetCurrentPassFailResultStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegeList(requestObj: ItiGetPassFailResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GetCollegeList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITITradeList(requestObj: ItiGetPassFailResultDataModel) {
    var body = JSON.stringify(requestObj);
    return await this.http.post(`${this.APIUrl}/GetITITradeList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
