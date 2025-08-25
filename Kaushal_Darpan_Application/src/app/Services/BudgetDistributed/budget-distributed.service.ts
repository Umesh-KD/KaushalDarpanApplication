import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { CompanyMasterSearchModel, CompanyMasterDataModels, CompanyMaster_Action } from '../../Models/CompanyMasterDataModel';
import { BudgetDistributeModel, BudgetHeadSearchFilter, BudgetRequestModel } from '../../Models/ITI/BudgetDistributeDataModel';

@Injectable({
  providedIn: 'root'
})

export class BudgetDistributedService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIBudgetHead";
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
  
  //save data
  public async SaveData(request: BudgetDistributeModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Save_CollegeBudgetAlloted`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(searchRequest: BudgetHeadSearchFilter) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllBudgetManagementData(searchRequest: BudgetHeadSearchFilter) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllBudgetManagementData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBudgetUtilizationsData(searchRequest: BudgetHeadSearchFilter) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetBudgetUtilizationsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BudgetUtilizeSave(BudgetUtilizationsList: any[]) {
    var body = JSON.stringify(BudgetUtilizationsList);
    return await this.http.post(`${this.APIUrl}/Save_CollegeBudgetUtilizations`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveBudgetRequest(BudgetModel: BudgetRequestModel) {
    var body = JSON.stringify(BudgetModel);
    return await this.http.post(`${this.APIUrl}/Save_CollegeBudgetRequest`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetRequeststatusAllData(BudgetModel: BudgetHeadSearchFilter) {
    var body = JSON.stringify(BudgetModel);
    return await this.http.post(`${this.APIUrl}/GetBudgetRequestData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  
}
