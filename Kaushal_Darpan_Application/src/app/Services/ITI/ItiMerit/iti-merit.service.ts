import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ItiMeritSearchModel } from '../../../Models/ITI/ItiMerit';
import { SearchITIModelRequest } from '../../../Models/ITIsDataModels';
import { GenerateMeritSearchModel } from '../../../Models/ITI/GenerateMeritDataModel';

@Injectable({
  providedIn: 'root'
})
export class ItiMeritService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ItiMeritMaster";
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

  public async GetAllData(request: ItiMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateMerit(request: ItiMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GenerateMerit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PublishMerit(request: ItiMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PublishMerit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllITIStudents(searchRequest: GenerateMeritSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + '/GetAllITIStudents/', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
