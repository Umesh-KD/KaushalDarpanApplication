import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITIGenerateEnrollData, ITIGenerateEnrollSearchModel } from '../../../Models/ITI/ITIGenerateEnrollDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIGenrateEnrollService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIGenerateEnroll";
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
  public async GetGenerateEnrollData(request: ITIGenerateEnrollSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetGenerateEnrollData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveEnrolledData(request: ITIGenerateEnrollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/SaveEnrolledData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async OnPublish(request: ITIGenerateEnrollData[]) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/OnPublish`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}

