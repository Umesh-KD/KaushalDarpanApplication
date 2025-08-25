import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { StudentFeesTransactionHistorySearchmodel } from '../../Models/StudentFeesTransactionHistoryRptBasedDataModel';

@Injectable({
  providedIn: 'root'
})
export class ItiStudentFeesTransactionHistoryService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIReportFeesTransaction";
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
    return await this.http.post(`${this.APIUrl}/GetITIStudentFeesTransactionHistoryRpt`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
