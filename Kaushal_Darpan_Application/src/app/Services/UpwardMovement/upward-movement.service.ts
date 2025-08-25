import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ItiStuAppSearchModelUpward, UpwardMoment } from '../../Models/CommonMasterDataModel';

@Injectable({
  providedIn: 'root'
})
export class UpwardMovementService {
  readonly APIUrl = this.appsettingConfig.apiURL + "UpwardMovement";
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

  public async UpwardMomentUpdate(request: UpwardMoment) {
    var body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/UpwardMomentUpdate' , body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDataItiStudentApplication(searchRequest: ItiStuAppSearchModelUpward) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDataItiStudentApplication`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDataItiUpwardMoment(searchRequest: ItiStuAppSearchModelUpward) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDataItiUpwardMoment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ITIUpwardMomentUpdate(request: UpwardMoment) {
    var body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/ITIUpwardMomentUpdate', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
