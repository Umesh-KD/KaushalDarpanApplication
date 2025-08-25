import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../Common/appsetting.service';
import { GenerateAdmitCardModel } from '../../Models/GenerateAdmitCardDataModel';
import { PrincipalIssueCertificateModel } from '../../Models/PrincipalIssueCertificateModel';
import { ReportBasedModel } from '../../Models/ReportBasedDataModel';
import { DataPagingListModel } from '../../Models/DataPagingListModel';
import { DownloadnRollNoModel } from '../../Models/GenerateRollDataModels';
import { ItiApplicationSearchmodel } from '../../Models/ItiApplicationPreviewDataModel';
import { BterSearchmodel } from '../../Models/ApplicationFormDataModel';
@Injectable({
  providedIn: 'root'
})
export class ResultService
{
  readonly APIUrl = this.appsettingConfig.apiURL + "Results";
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

  public async GetStudentResults(data: any)
  {
    return await this.http.post(this.APIUrl + "/GetStudentResult/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



 
}


