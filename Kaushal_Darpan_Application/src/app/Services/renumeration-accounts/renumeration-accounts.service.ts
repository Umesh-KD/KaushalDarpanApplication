import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { RenumerationJDRequestModel, RenumerationJDSaveModel } from '../../Models/RenumerationJDModel';
import { RenumerationAccountsRequestModel, RenumerationAccountsSaveModel } from '../../Models/RenumerationAccountsModel';

@Injectable({
  providedIn: 'root'
})

export class RenumerationAccountsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "RenumerationAccounts";
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

  public async GetAllData(model: RenumerationAccountsRequestModel) {
    return await this.http.post(`${this.APIUrl}/GetAllData`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDataApprovedFromAccounts(AccountsSave: RenumerationAccountsSaveModel) {
    return await this.http.post(`${this.APIUrl}/SaveDataApprovedFromAccounts`, AccountsSave, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateDataApprovedFromAccounts(AccountsSave: RenumerationAccountsSaveModel) {
    return await this.http.post(`${this.APIUrl}/UpdateDataApprovedFromAccounts`, AccountsSave, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
