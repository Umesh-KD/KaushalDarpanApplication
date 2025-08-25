import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { PaymentServiceDataModel, PaymentServiceSearchModel } from '../../Models/PaymentServiceDataModel';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  readonly APIUrl = this.appsettingConfig.apiURL + "PaymentService";
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

  public async SaveData(request: PaymentServiceDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(request: PaymentServiceSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetAllData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
