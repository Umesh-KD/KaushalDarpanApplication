import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { IDfFundDetailsModel, IDfFundSearchDetailsModel } from '../../../Models/ITI/IDfFundDetailsModel';
import { ITI_IIPManageDataModel, ITI_IIPManageSearchModel, IIPManageFundSearchModel, IMCFundRevenue } from '../../../Models/ITI/ITI_IIPManageDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIIIPManageService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIIIPManage";
  readonly headersOptions: any;
  readonly headersOptions1: any;
  constructor(
    private http: HttpClient, 
    private appsettingConfig: AppsettingService
  ) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
     
    };
    this.headersOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'no-loader': 'true'
      })
    };
  }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetAllData(request: ITI_IIPManageSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveIMCReg(request: ITI_IIPManageDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveIMCReg`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetById_IMC(id: number) {

    return await this.http.get(`${this.APIUrl}/GetById_IMC/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIMCHistory_ById(RegID: number) {

    return await this.http.get(`${this.APIUrl}/GetIMCHistory_ById/${RegID}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveFundDetails(request: IDfFundDetailsModel)
  
  {
    debugger
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveFundDetails`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetFundDetailsData(request: IDfFundSearchDetailsModel)
  {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetFundDetailsData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById_IMCFund(id: number) {

    return await this.http.get(`${this.APIUrl}/GetById_IMCFund/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveIMCFund(request: IIPManageFundSearchModel) {
    debugger
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveIMCFund`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllIMCFundData(request: IIPManageFundSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllIMCFundData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetQuaterlyProgressData(id: number) {

    return await this.http.get(`${this.APIUrl}/GetQuaterlyProgressData/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveQuaterlyProgressData(request: IMCFundRevenue) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveQuaterlyProgressData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetById_FundDetails(id: number) {

    return await this.http.get(`${this.APIUrl}/GetById_FundDetails/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetQuterlyData_ByID(id: number) {

    return await this.http.get(`${this.APIUrl}/GetQuterlyData_ByID/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async FinalSubmitUpdate(id: number) {

    return await this.http.post(`${this.APIUrl}/FinalSubmitUpdate/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIIPQuaterlyFundReport(id: number) {

    return await this.http.get(`${this.APIUrl}/GetIIPQuaterlyFundReport/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
