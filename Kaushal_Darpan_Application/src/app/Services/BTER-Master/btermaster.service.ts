import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { ITIFeesPerYearListSearchModel, CollegeLoginInfoSearchModel } from '../../Models/ITI/ITIFeesPerYearList';

@Injectable({
  providedIn: 'root'
})

export class BTERMasterService {
  readonly APIUrl = this.appsettingConfig.apiURL + "BTERMaster";
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


  public async GetBTER_CollegeLoginInfoMaster(searchRequest: CollegeLoginInfoSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetBTER_CollegeLoginInfoMaster`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async BTERGetCollegeLoginInfoByCode(searchRequest: CollegeLoginInfoSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/BTERGetCollegeLoginInfoByCode`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTERUpdate_CollegeLoginInfo(request: CollegeLoginInfoSearchModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/BTERUpdate_CollegeLoginInfo`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
}
