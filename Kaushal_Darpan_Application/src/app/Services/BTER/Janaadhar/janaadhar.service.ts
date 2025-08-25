import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { BTERAllotmentdataModel, BTERSearchModel } from '../../../Models/BTER/BTERAllotmentDataModel';

@Injectable({
  providedIn: 'root'
})

export class BTERJanaadharService {

  readonly APIUrl = this.appsettingConfig.apiURL + "Janaadhar";
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
  public async GetStudentJanaadharData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetStudentJanaadharData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetJanaadharListData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetJanaadharListData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInstituteJanaadharListData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetInstituteJanaadharListData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async IsDroppedChange(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/IsDroppedChange`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PostStudentAdmittedForm(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/postStudentAdmittedForm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
