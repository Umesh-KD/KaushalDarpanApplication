import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { SearchSlidingModel } from '../../Models/InternalSlidingDataModel';

@Injectable({
  providedIn: 'root'
})
export class InternalSlidingService {

  readonly APIUrl = this.appsettingConfig.apiURL + "InternalSliding";
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

  // Get

  public async GetInternalSliding(searchRequest: SearchSlidingModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetInternalSliding`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDDLInternalSliding(searchRequest: SearchSlidingModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDDLInternalSliding`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDDLInternalSlidingUnitList(searchRequest: SearchSlidingModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDDLInternalSlidingUnitList`, body,  this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(searchRequest: SearchSlidingModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + '/SaveData', searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveSawpData(searchRequest: SearchSlidingModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + '/SaveSawpData', searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  

}
