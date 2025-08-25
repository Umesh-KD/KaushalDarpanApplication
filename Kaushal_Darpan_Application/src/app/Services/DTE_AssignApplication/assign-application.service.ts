import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { AssignApplicationDataModel, AssignApplicationSearchModel, RevertApplicationDataModel, SearchModelAssignedApplication } from '../../Models/DTE_AssignApplicationDataModel';
import { catchError, throwError } from 'rxjs';
import { BterSearchmodel } from '../../Models/ApplicationFormDataModel';
import { copycheckdashsearchmodel } from '../../Models/CopycheckDashboardDataModel';
import { RequestBaseModel } from '../../Models/RequestBaseModel';

@Injectable({
  providedIn: 'root'
})
export class AssignApplicationService {
  readonly APIUrl = this.appsettingConfig.apiURL + "AssignApplicationMaster";
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


  public async SaveData(request: AssignApplicationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(searchRequest: AssignApplicationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(id: number, UserId: number) {
    return await this.http.delete(`${this.APIUrl}/DeleteDataByID/${id}/${UserId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentsData(searchRequest: SearchModelAssignedApplication) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetVerifierData(searchRequest: SearchModelAssignedApplication) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetVerifierData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationsById(ID: number) {
    return await this.http.get(`${this.APIUrl}/GetApplicationsById/${ID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentDataById(ApplicationID: number) {
    return await this.http.get(`${this.APIUrl}/GetStudentDataById/${ApplicationID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DocumentScrunityData(request: BterSearchmodel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DocumentScrunityData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTotalAssignApplication(request: RequestBaseModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetTotalAssignApplication", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async AssignChecker(request: any[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/AssignChecker`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async RevertApplication(request: RevertApplicationDataModel) {
    return await this.http.post(`${this.APIUrl}/RevertApplication`, request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
