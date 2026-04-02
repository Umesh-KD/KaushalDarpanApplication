import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { StaffTrainingDetailDataModel, StaffTrainingDetailSearchData } from '../../../Models/BTER/BTER_EstablishManagementDataModel';

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
}
