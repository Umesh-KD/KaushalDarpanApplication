import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { DateConfigurationModel, SessionConfigModelModel } from '../../Models/DateConfigurationDataModels';

@Injectable({
  providedIn: 'root'
})
export class DateConfigService {

  readonly APIUrl = this.appsettingConfig.apiURL + "DateConfiguration";
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

  //Get all data
  public async GetAllData(request: DateConfigurationModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get all date data list
  public async GetDateDataList(request: DateConfigurationModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDateDataList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: DateConfigurationModel) {
    const body = JSON.stringify(request);
    
    return await this.http.post(this.APIUrl + "/SaveData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteByID(ID: number) {
    return await this.http.post(this.APIUrl + "/DeleteByID/", { DateConfigID: ID }, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
