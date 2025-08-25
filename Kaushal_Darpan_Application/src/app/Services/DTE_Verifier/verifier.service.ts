import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NodalVerifierDataModel, TotalStudentReportedListModel, VerifierApiDataModel, VerifierDataModel, VerifierSearchModel } from '../../Models/VerifierDataModel';
import { DTEApplicationDashboardDataModel } from '../../Models/DTEApplicationDashboardDataModel';

@Injectable({
  providedIn: 'root'
})
export class VerifierService {
  readonly APIUrl = this.appsettingConfig.apiURL + "VerifierMaster";
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


  public async SaveDTENodalVerifierData(request: NodalVerifierDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveDTENodalVerifierData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveVerifierData(request: VerifierDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveVerifierData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllData(searchRequest: VerifierSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllNodalVerifierData(searchRequest: VerifierSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllNodalVerifierData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTotalStudentReportedList(searchRequest: TotalStudentReportedListModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTotalStudentReportedList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDteNodalVerifierDashboard(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDteNodalVerifierDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetNodalVerifierDashboard(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetNodalVerifierDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDataById(VerifierID: number) {
    return await this.http.get(`${this.APIUrl}/GetDataById/${VerifierID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(id: number, UserId: number) {
    return await this.http.delete(`${this.APIUrl}/DeleteDataByID/${id}/${UserId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetVerifierDashboard(searchRequest: DTEApplicationDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetVerifierDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async VerifierApiSSOIDGetSomeDetails(request: VerifierApiDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/VerifierApiSSOIDGetSomeDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
