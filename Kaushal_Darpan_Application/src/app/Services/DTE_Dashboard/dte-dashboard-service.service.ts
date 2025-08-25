import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError, Observable, firstValueFrom } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { DownloadZipDocumentModel, DTEApplicationDashboardDataModel } from '../../Models/DTEApplicationDashboardDataModel';
import { DTEDashApplicationSearchModel } from '../../Models/ApplicationFormDataModel';

@Injectable({
  providedIn: 'root'
})
export class DTEDashboardServiceService {
  readonly APIUrl = this.appsettingConfig.apiURL + "DTEApplicationDashboard";
  readonly headersOptions: any;
  readonly headersOptions1: any;
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
  public async GetDTEDashboard(searchRequest: DTEApplicationDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDTEDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllApplication(searchRequest: DTEApplicationDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllApplication`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadZipFolder(searchRequest: DTEApplicationDashboardDataModel): Promise<any>  {
    const url = `${this.APIUrl}/download-student?FinancialYear=${searchRequest.FinancialYearID}&Eng_NonEng=${searchRequest.Eng_NonEng}`;
    return this.http.post(url, searchRequest, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    }).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetDTEDashboardReports(searchRequest: DTEApplicationDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDTEDashboardReports`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDashApplicationData(searchRequest: DTEDashApplicationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDTEDashboardReportsNew`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadFeePaidStudentDoc(searchRequest: DownloadZipDocumentModel): Promise<any> {
    return this.http.post(`${this.APIUrl}/DownloadFeePaidStudentDoc`, searchRequest, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    }).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
 
}
