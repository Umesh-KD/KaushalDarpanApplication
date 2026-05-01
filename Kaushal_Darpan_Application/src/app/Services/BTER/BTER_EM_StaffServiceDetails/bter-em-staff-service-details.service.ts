import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { BTER_EM_TransferSystemModle, BTER_GetStaffPersonalDetailsModel, StaffTrainingDetailDataModel, StaffTrainingDetailSearchData, StaffTrainingStatusUpdateDataModel } from '../../../Models/BTER/BTER_EstablishManagementDataModel';
import {  EM_TransferSystemSearchModel,    TransferSystemUpdateDataModel } from '../../../Models/BTER/BTER_EstablishManagementDataModel';


@Injectable({
  providedIn: 'root'
})
export class BTEREMStaffServiceDetailsService {

  readonly APIUrl = this.appsettingConfig.apiURL + "BTER_EM_StaffServiceDetails";
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

  public async Save_StaffTrainingDetails(request: StaffTrainingDetailDataModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/Save_StaffTrainingDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StaffTrainingDetails_GetData(request: StaffTrainingDetailSearchData) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/StaffTrainingDetails_GetData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StaffTrainingDetails_DeleteById(request: StaffTrainingDetailSearchData) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/StaffTrainingDetails_DeleteById`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async StaffTrainingStatusUpdate(request: StaffTrainingStatusUpdateDataModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/StaffTrainingStatusUpdate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StaffTrainingHTS_GetData(request: StaffTrainingDetailSearchData) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/StaffTrainingHTS_GetData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StaffTrainingDocUpdate(request: StaffTrainingDetailDataModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/StaffTrainingDocUpdate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //// BTER Staff Transfer System


  public async GetStaffPersonalDetails(request: BTER_GetStaffPersonalDetailsModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStaffPersonalDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  // save sP 
    public async Save_StaffTansferRequestDetails(request: BTER_EM_TransferSystemModle) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/BTER_EM_TransferSystem_IU`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    public async GetEM_TransferSystemData(request: EM_TransferSystemSearchModel) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/GetEM_TransferSystemData`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

    public async EM_TransferSystemUpdateStatus(request: TransferSystemUpdateDataModel) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/EM_TransferSystemUpdateStatus`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }
}
