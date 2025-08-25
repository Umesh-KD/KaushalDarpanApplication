import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { ApplicationSearchDataModel, SeatAllocationDataModel, SeatMatrixSearchModel } from '../../Models/CollegeAdmissionSeatAllotmentModel';

@Injectable({
  providedIn: 'root'
})
export class CollegeAdmissionSeatAllotmentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "CollegeAdmissionSeatAllotment";
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

  public async GetApplicationDatabyID(searchRequest: ApplicationSearchDataModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetApplicationDatabyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTradeListByCollege(searchRequest: SeatMatrixSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTradeListByCollege`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBranchListByCollege(searchRequest: SeatMatrixSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetBranchListByCollege`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ShiftUnitList(searchRequest: SeatMatrixSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ShiftUnitList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateAllotments(request: SeatAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateAllotments`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
