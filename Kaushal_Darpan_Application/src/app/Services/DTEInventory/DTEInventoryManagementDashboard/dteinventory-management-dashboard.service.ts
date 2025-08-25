import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DTEInventoryDashboardDataModel } from '../../../Models/DTEInventory/DTEInventoryDashboardDataModel';

@Injectable({
  providedIn: 'root'
})
export class DteInventoryManagementDashboardService {
  readonly APIUrl = this.appsettingConfig.apiURL + "DTEInventoryDashboard";
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

  public async GetDTEInventoryDashboard(searchRequest: DTEInventoryDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDTEInventoryDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
