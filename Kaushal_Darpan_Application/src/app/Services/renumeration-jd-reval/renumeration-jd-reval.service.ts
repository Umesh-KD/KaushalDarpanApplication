import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { RenumerationJDRequestModel, RenumerationJDSaveModel } from '../../Models/RenumerationJDModel';

@Injectable({
  providedIn: 'root'
})
export class RenumerationJdRevalService {
  readonly APIUrl = this.appsettingConfig.apiURL + "RenumerationJDReval";
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

  public async GetAllData(model: RenumerationJDRequestModel) {
    return await this.http.post(`${this.APIUrl}/GetAllData`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDataApprovedAndSendToAccounts(model: RenumerationJDSaveModel[]) {
    return await this.http.post(`${this.APIUrl}/SaveDataApprovedAndSendToAccounts`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
