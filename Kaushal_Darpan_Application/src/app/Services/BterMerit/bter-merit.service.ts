import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { BterMeritSearchModel } from '../../Models/BterMeritDataModel';

@Injectable({
  providedIn: 'root'
})
export class BterMeritService {
  readonly APIUrl = this.appsettingConfig.apiURL + "BterMeritMaster";
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

  public async GetAllData(request: BterMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateMerit(request: BterMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GenerateMerit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PublishMerit(request: BterMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PublishMerit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetMeritUploadExeclFormate(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/MeritFormateData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UploadMeritdata(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UploadMeritdata`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DowanloadMeritDataPDF(request: BterMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DowanloadMeritDataPDF`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DowanloadMeritDataExcel(request: BterMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DowanloadMeritDataExcel`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
