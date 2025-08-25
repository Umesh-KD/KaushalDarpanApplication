import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../../Common/appsetting.service';
import { GetApplicationFeesTransactionSearchModel, GetEmitraFeesTransactionSearchModel, StudentFeesTransactionHistoryRptModel, StudentFeesTransactionHistorySearchmodel } from '../../../Models/StudentFeesTransactionHistoryRptBasedDataModel';
import { DataPagingListModel } from '../../../Models/DataPagingListModel';
import { DownloadnRollNoModel } from '../../../Models/GenerateRollDataModels';

@Injectable({
  providedIn: 'root'
})
export class StudentFeesTransactionHistoryRptService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ReportFeesTransaction";
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

  public async GetStudentFeesTransactionHistoryData(searchRequest: StudentFeesTransactionHistorySearchmodel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentFeesTransactionHistoryRpt`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationFeesTransaction(searchRequest: GetApplicationFeesTransactionSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetApplicationFeesTransaction`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetEmitraFeesTransactionHistory(searchRequest: GetEmitraFeesTransactionSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetEmitraFeesTransactionHistory`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
