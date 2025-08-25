import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { SeatSearchModel } from '../../Models/SeatMatrixDataModel';
import { ITICollegeTradeSearchModel } from '../../Models/ITI/SeatIntakeDataModel';
import { ITINCVTDataModel } from '../../Models/ITI/NCVTDataModels';

@Injectable({
  providedIn: 'root'
})

export class ITI_NCVTService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITINCVT";
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

  public async ShowSeatMetrix(searchRequest: SeatSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetShowSeatMetrix`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveData(searchRequest: SeatSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + '/SaveData', searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetNCVTExamDataFormat(request: ITINCVTDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetNCVTExamDataFormat`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveExamData(DataExcel1: any) {
    const body = JSON.stringify(DataExcel1)
    return this.http.post(`${this.APIUrl}/SaveExamData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StagingAccessToken() {
    const _apiUrl = "https://uat-api-fe-sid.betalaunch.in/api/discovery-account/token";
    const body = "";
    return this.http.post(_apiUrl , body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async LiveAccessToken() {
    const _apiUrl = "https://api-fe.skillindiadigital.gov.in/api/discovery-account/token";
    const body = "";
    return this.http.post(_apiUrl, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StagingUploadData(DataExcel1: any, BearerAuthtoken: string) {
    const _apiUrl = "https://uat-api-fe-sid.betalaunch.in/api/iti/state/trainee/register";
    const body = JSON.stringify(DataExcel1)
    const hdrOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + BearerAuthtoken
      })
    };
    return this.http.post(_apiUrl, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async LiveUploadData(DataExcel1: any, BearerAuthtoken:string) {
    const _apiUrl = "https://api-fe.skillindiadigital.gov.in/api/iti/state/trainee/register";
    const body = JSON.stringify(DataExcel1)

    const hdrOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + BearerAuthtoken
      })
    };
    return this.http.post(_apiUrl, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}

