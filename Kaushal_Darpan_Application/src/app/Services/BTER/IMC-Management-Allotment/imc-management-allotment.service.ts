import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { BTERIMCAllocationDataModel, BTERIMCAllocationSearchModel } from '../../../Models/BTERIMCAllocationDataModel';

@Injectable({
  providedIn: 'root'
})
export class IMCManagementAllotmentService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIIMCAllocation";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetAllData(searchRequest: BTERIMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

   public async GetAllDataPhoneVerify(searchRequest: BTERIMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataPhoneVerify`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async StudentDetailsList(searchRequest: BTERIMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/StudentDetailsList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ShiftUnitList(searchRequest: BTERIMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ShiftUnitList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateAllotments(request: BTERIMCAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateAllotments`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateMobileNo(request: BTERIMCAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateMobileNo`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBranchListByCollege(searchRequest: BTERIMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetBranchListByCollege`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async RevertAllotments(request: BTERIMCAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/RevertAllotments`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

 

}
