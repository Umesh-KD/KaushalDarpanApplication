import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { PayLevelMasterDataModel } from '../../../Models/BTER/PayLevelMasterDataModel';

@Injectable({
  providedIn: 'root'
})
export class PayLevelMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "PayLevelMaster";
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

  public async SavePayLevelMasterData(request: PayLevelMasterDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SavePayLevelMasterData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetPayLevelMasterData(request: PayLevelMasterDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetPayLevelMasterData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeletePayLevel_ByID(request: PayLevelMasterDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeletePayLevel_ByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
