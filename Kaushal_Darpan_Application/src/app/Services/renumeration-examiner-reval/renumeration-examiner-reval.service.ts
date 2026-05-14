import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { RenumerationExaminerRequestModel } from '../../Models/RenumerationExaminerModel';

@Injectable({
  providedIn: 'root'
})
export class RenumerationExaminerRevalService {
  readonly APIUrl = this.appsettingConfig.apiURL + "RenumerationExaminerReval";
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

  public async GetAllData(model: RenumerationExaminerRequestModel) {
    return await this.http.post(`${this.APIUrl}/GetAllData`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetTrackStatusData(model: RenumerationExaminerRequestModel) {
    return await this.http.post(`${this.APIUrl}/GetTrackStatusData`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
