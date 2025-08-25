import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ApprenticeshipDeploymentDataModel, ITI_ApprenticeshipDataModel, ITI_ApprenticeshipDropdownModel, ITI_ApprenticeshipSearchModel, ApprenticeshipMemberDetailsDataModel, SaveCheckSSODataModel } from '../../../Models/ITI/ITI_ApprenticeshipDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIApprenticeshipService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIApprenticeship";
  readonly headersOptions: any;
  readonly headersOptions1: any;
  constructor(
    private http: HttpClient, 
    private appsettingConfig: AppsettingService
  ) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
     
    };
    this.headersOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'no-loader': 'true'
      })
    };
  }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  public async GetAllData(request: ITI_ApprenticeshipSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllInspectedData(request: ITI_ApprenticeshipSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllInspectedData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITIApprenticeshipDropdown(request: ITI_ApprenticeshipDropdownModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/GetITIApprenticeshipDropdown`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: ITI_ApprenticeshipDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDeploymentData(request: ApprenticeshipDeploymentDataModel[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveApprenticeshipDeploymentData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById_Team(id: number) {

    return await this.http.get(`${this.APIUrl}/GetById_Team/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById_Deployment(id: number) {

    return await this.http.get(`${this.APIUrl}/GetById_Deployment/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData_GenerateOrder(request: ITI_ApprenticeshipSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData_GenerateOrder`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async check_Engagement(requestMember: ApprenticeshipMemberDetailsDataModel) {
    var body = JSON.stringify(requestMember);
    debugger;
    return await this.http.post(`${this.APIUrl}/check_Engagement`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Save_CheckSSOData(requestMember: SaveCheckSSODataModel) {
    var body = JSON.stringify(requestMember);
  
    return await this.http.post(`${this.APIUrl}/SaveCheckSSODataModel`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateDeployment(id: number) {
    
    return await this.http.post(`${this.APIUrl}/UpdateDeployment/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateApprenticeshipDeploymentOrder(id : number) {
    
    return await this.http.post(`${this.APIUrl}/GenerateApprenticeshipDeploymentOrder/${id}`, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateCOAnsweredReport(id: number) {

    return await this.http.post(`${this.APIUrl}/GenerateCOAnsweredReport/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async RequestApprove(Deployeid: number) {
    return await this.http.post(this.APIUrl + '/RequestApprovedbyAdmin/' + Deployeid, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
