import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { WebsiteSettingDataModel } from '../../../Models/BTER/WebsiteSettingsDataModel';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';

@Injectable({
  providedIn: 'root'
})
export class WebsiteSettingsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "WebsiteSettings";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async SaveData(request: WebsiteSettingDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDynamicUploadTypeDDL(request: RequestBaseModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDynamicUploadTypeDDL`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(request: WebsiteSettingDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(request: WebsiteSettingDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteDataByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById(request: WebsiteSettingDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetById`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ActiveStatusChange(request: WebsiteSettingDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ActiveStatusChange`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
