import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { BTERAllotmentdataModel, BTERSearchModel } from '../../../Models/BTER/BTERAllotmentDataModel';

@Injectable({
  providedIn: 'root'
})

export class BTERAllotmentService {

  readonly APIUrl = this.appsettingConfig.apiURL + "BTERAllotment";
  readonly headersOptions: any;
  readonly headersOptions1: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
     
    };
    this.headersOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'no-loader': 'true'
      })
    };
  }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  //Get all data
  public async GetGenerateAllotment(request: BTERAllotmentdataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetGenerateAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPublishAllotment(request: BTERAllotmentdataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetPublishAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AllotmentCounter(searchRequest: BTERSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/AllotmentCounter`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ShowSeatMetrix(searchRequest: BTERSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetShowSeatMetrix`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetOptionDetailsbyID(searchRequest: BTERSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetOptionDetailsbyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ShowStudentSeatAllotment(searchRequest: BTERSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentSeatAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ShowAllotmentDataList(searchRequest: BTERSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ShowAlGetAllotmentReport(searchRequest: BTERSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async AllotmnetFormateData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/AllotmnetFormateData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UploadAllotmentdata(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UploadAllotmentdata`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AllotmnetCollegeBranchData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/AllotmnetFormateData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DownloadAllotmentLetter(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetStudentAllotmentReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentReportingReceipt(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetStudentReportingReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentFeeReceipt(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetStudentAllotmentFeeReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
