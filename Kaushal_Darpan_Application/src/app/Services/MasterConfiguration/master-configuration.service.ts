import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { BterCommonSignatureModel, CommonSignatureModel, FeeConfigurationModel, SerialMasterConfigurationModel } from '../../Models/MasterConfigurationModel';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterConfigurationService {

  readonly APIUrl = this.appsettingConfig.apiURL + "MasterConfiguration";
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

  //Get all data
  public async GetAllFeeData(request: FeeConfigurationModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllFeeData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveFeeData(request: FeeConfigurationModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveFeeData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetFeeByID(ID: number) {
    return await this.http.get(this.APIUrl + "/GetFeeByID/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteFeeByID(ID: number) {
    return await this.http.post(this.APIUrl + "/DeleteFeeByID/", { FeeID:ID}, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  // Serial master
  public async GetAllSerialData(request: SerialMasterConfigurationModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllSerialData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveSerialData(request: SerialMasterConfigurationModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveSerialData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSerialByID(ID: number) {
    return await this.http.get(this.APIUrl + "/GetSerialByID/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteSerialByID(ID: number) {
    return await this.http.post(this.APIUrl + "/DeleteSerialByID/", { SerialID: ID }, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CommonSignature(request: CommonSignatureModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/CommonSignature`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BterCommonSignature(request: BterCommonSignatureModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/BterCommonSignature`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
