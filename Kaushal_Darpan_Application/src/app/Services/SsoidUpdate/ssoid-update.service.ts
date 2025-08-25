import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { StaffDashboardSearchModel } from '../../Models/StaffDashboardDataModel';
import { SsoidUpdateDataModel, SsoidUpdateSearchModel } from '../../Models/BTER/SsoidUpdateDataModel';

@Injectable({
  providedIn: 'root'
})
export class SsoidUpdateService {
  readonly APIUrl = this.appsettingConfig.apiURL + "SsoidUpdate";
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
  //Get 
  public async GetAllData(searchRequest: SsoidUpdateSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAllData(request: SsoidUpdateDataModel[]) {
    const body = JSON.stringify(request); 
    return await this.http.post(this.APIUrl + '/SaveAllData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
