import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { CenterExamAllocationSearchModel, CenterAllocationtDataModels } from '../../Models/CenterAllocationDataModels';

@Injectable({
  providedIn: 'root'
})
export class CenterExamCoordinatorService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITICenterAllocation";
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

  public async GetCenterExamCoordinatorData(searchRequest: CenterExamAllocationSearchModel) {

    return await this.http.post(this.APIUrl + "/GetExamCoordinatorDataByInstitute", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetExamCoordinatorDataByUserId(searchRequest: CenterExamAllocationSearchModel) {

    return await this.http.post(this.APIUrl + "/GetExamCoordinatorDataByUserId", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();



  }

  public async GetCollageReport(searchRequest: CenterExamAllocationSearchModel) {

    return await this.http.post(this.APIUrl + "/GetCollageReport", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
