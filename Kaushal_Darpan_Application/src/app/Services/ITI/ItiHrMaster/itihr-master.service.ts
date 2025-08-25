import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiHrMaster_Action, ItiHrMasterDataModel, ItiHrMasterSearchModel } from '../../../Models/ITI/ItiHrMasterDataModel';


@Injectable({
  providedIn: 'root'
})
export class ItiHrMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ItiHrMaster";
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
  public async GetAllData(searchRequest: ItiHrMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get by id
  public async GetById(HRManagerID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${HRManagerID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //save data
  public async SaveData(request: ItiHrMasterDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(HRManagerID: number, userId: number) {
    var body = JSON.stringify({ "HRManagerID": HRManagerID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${HRManagerID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async HrValidationList(searchRequest: ItiHrMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/HrValidationList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //public async Save_HrValidation_NodalAction({ request }: { request: ItiHrMaster_Action; }) {
  //  const body = JSON.stringify(request);
  //  return await this.http.post(this.APIUrl + "/Save_HrValidation_NodalAction", body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async Save_HrValidation_NodalAction(request: ItiHrMaster_Action) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Save_HrValidation_NodalAction", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
