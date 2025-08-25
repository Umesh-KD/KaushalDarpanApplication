import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { PolytechnicReportSearchModel, PolytechnicReportDataModels } from '../../Models/PolytechnicReportModel/PolytechnicReportDataModel';
import { ExaminerReportDataSearchModel } from '../../Models/ExaminerReportDataSearchModel';

@Injectable({
  providedIn: 'root'
})


export class ExaminerReportService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ExaminerReport";
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
  //Get 
  public async GetAllData(searchRequest: ExaminerReportDataSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
