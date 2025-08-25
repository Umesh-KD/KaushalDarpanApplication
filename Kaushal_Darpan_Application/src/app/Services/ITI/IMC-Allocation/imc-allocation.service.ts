import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { IMCAllocationDataModel, IMCAllocationSearchModel } from '../../../Models/ITIIMCAllocationDataModel';

@Injectable({
  providedIn: 'root'
})
export class IMCAllocationService {
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

  public async GetAllData(searchRequest: IMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async GetAllDataPhoneVerify(searchRequest: IMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataPhoneVerify`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async StudentDetailsList(searchRequest: IMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/StudentDetailsList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ShiftUnitList(searchRequest: IMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ShiftUnitList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateAllotments(request: IMCAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateAllotments`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateMobileNo(request: IMCAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateMobileNo`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTradeListByCollege(searchRequest: IMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTradeListByCollege`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async RevertAllotments(request: IMCAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/RevertAllotments`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIMCStudentDetails(searchRequest: IMCAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetIMCStudentDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllotmentReceipt(AllotmentId: any) {
    return await this.http.get(this.APIUrl + "/GetAllotmentReceipt/" + AllotmentId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
