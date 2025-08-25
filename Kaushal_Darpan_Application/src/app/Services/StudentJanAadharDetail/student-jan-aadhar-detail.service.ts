import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ApplicationStudentDatamodel, IStudentJanAadharDetailModel, SearchApplicationStudentDatamodel } from '../../Models/StudentJanAadharDetailModel';
import { BoardDat } from '../../Models/ApplicationFormDataModel';

@Injectable({
  providedIn: 'root'
})


export class StudentJanAadharDetailService {

  readonly APIUrl = this.appsettingConfig.apiURL + "StudentJanAadharDetail";
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

 
  

  //GetDetailsByJanAadhaar
  public async JanAadhaarMembersList(JAN_AADHAR: string) {
    return await this.http.get(`${this.APIUrl}/JanAadhaarMembersList/${JAN_AADHAR}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //save data
  public async SendJanaadharOTP(row: IStudentJanAadharDetailModel) {
    var body = JSON.stringify(row);
    return await this.http.post(`${this.APIUrl}/SendJanaadharOTP`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async VerifyOTP(ResposeOTPModel: IStudentJanAadharDetailModel) {
    var body = JSON.stringify(ResposeOTPModel);
    return await this.http.post(`${this.APIUrl}/VerifyRecheckOTP`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SavePersonalData(model: ApplicationStudentDatamodel) {

    const body = JSON.stringify(model);
    return await this.http.post(this.APIUrl + '/SavePersonalData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDTEApplicationData(model: ApplicationStudentDatamodel) {

    const body = JSON.stringify(model);
    return await this.http.post(this.APIUrl + '/SaveDTEApplicationData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationId(searchRequest: SearchApplicationStudentDatamodel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetApplicationId`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBoardData(Board: BoardDat) {
    var body = JSON.stringify(Board);
    return await this.http.post(`${this.APIUrl}/GetBoardData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDTEDirectApplicationData(model: ApplicationStudentDatamodel) {

    const body = JSON.stringify(model);
    return await this.http.post(this.APIUrl + '/SaveDTEDirectApplicationData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
