import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITIBudgetDropdownDataModel } from '../../../Models/ITI/ITIBudgetCreateDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIBudgetCreateService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIBudgetCreate";
  readonly headersOptions: any;
  readonly headersOptions1: any;
  constructor(
    private http: HttpClient, 
    private appsettingConfig: AppsettingService
  ) {
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

  public async GetITIBudgetDropdown(request: ITIBudgetDropdownDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetITIBudgetDropdown`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDataBudgetCreate_Admin(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveDataBudgetCreate_Admin`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBudgetData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetBudgetData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
