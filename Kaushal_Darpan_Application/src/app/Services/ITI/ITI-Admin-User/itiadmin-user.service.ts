import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { AdminUserSearchModel, AdminUserDetailModel } from '../../../Models/AdminUserDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIAdminUserService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIAdminUser";
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
  public async GetAllData(searchRequest: AdminUserSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get by id
  public async GetById(UserID: number, UserAdditionID: number, ProfileID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${UserID}/${UserAdditionID}/${ProfileID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(UserID: number, UserAdditionID: number, ProfileID: number) {
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${UserID}/${UserAdditionID}/${ProfileID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //save data
  public async SaveData(request: AdminUserDetailModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
