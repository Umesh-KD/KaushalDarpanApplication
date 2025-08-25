import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { CenterAllotmentSearchModel, UpdateCCCodeDataModel } from '../../Models/CenterAllotmentSearchModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class CenterAllotmentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "CenterCreation";
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

  //Get all data
  public async GetAllData(searchRequest: CenterAllotmentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(selectedColleges: any[], StartValue: number) {
    const body = JSON.stringify(selectedColleges); // Serialize the selected colleges

    return await this.http.post(this.APIUrl + `/SaveSSOIDData?StartValue=${StartValue}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterByID(searchRequest: CenterAllotmentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCenterByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateCCCode(request: UpdateCCCodeDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + `/UpdateCCCode`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateCCCode(selectedColleges: any[], StartValue: number) {
    const body = JSON.stringify(selectedColleges); // Serialize the selected colleges

    return await this.http.post(this.APIUrl + `/GenerateCCCode?StartValue=${StartValue}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async RemoveCenter(selectedColleges: any[]) {
    const body = JSON.stringify(selectedColleges); // Serialize the selected colleges

    return await this.http.post(this.APIUrl + `/RemoveCenter`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterForCcCode(searchRequest: CenterAllotmentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCenterForCcCode`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AssignCenterSuperintendent(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/AssignCenterSuperintendent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}//




