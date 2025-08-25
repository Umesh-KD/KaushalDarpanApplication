import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';

import { ITICampusDetailsWebSearchModel } from '../../../Models/ITI/ITICampusDetailsWebDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIHomeService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITICampusDetailsWeb";
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
  public async GetITIAllPost(postId: number = 0, DepartmentID: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetITIAllPost/${postId}/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIAllPostwithSearch(postId: number = 0, DepartmentID: number = 0, request: any = {}) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetITIAllPost/${postId}/${DepartmentID}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //Get all placement company
  public async GetAllPlacementCompany(searchRequest: ITICampusDetailsWebSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllPlacementCompany`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllPostExNonList(postId: number = 0, DepartmentID: number = 0) {
    return await this.http.get(`${this.APIUrl}/GetAllPostExNonList/${postId}/${DepartmentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITITradeList() {
    return await this.http.get(this.APIUrl + '/GetITIAllTrade', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
