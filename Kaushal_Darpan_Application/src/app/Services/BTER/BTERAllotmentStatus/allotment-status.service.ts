import { Injectable } from '@angular/core';
import { AllotmentStatusSearchModel } from '../../../Models/BTER/BTERAllotmentStatusDataModel';
import { catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})

export class AllotmentStatusService {
  readonly APIUrl = this.appsettingConfig.apiURL + "BTERAllotmentStatus";
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
  public async GetAllotmentStatusList(searchRequest: AllotmentStatusSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentStatusList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllotmentUpwardList(searchRequest: AllotmentStatusSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentUpwardList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIAllotmentUpwardList(searchRequest: AllotmentStatusSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIAllotmentUpwardList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
}
