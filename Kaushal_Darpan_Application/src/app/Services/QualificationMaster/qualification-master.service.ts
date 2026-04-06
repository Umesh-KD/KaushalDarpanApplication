import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { QualificationMasterDataModel, QualificationMasterSearchModel } from '../../Models/QualificationMasterDataModel';

@Injectable({
  providedIn: 'root'
})
export class QualificationMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "QualificationMaster";
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

  public async QualificationMaster_GetData(request: QualificationMasterSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/QualificationMaster_GetData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Save_QualificationMasterData(request: QualificationMasterDataModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/Save_QualificationMasterData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
