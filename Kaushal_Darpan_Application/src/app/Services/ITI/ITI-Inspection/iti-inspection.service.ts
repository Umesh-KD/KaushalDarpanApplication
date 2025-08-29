import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { InspectionDeploymentDataModel, ITI_InspectionDataModel, ITI_InspectionDropdownModel, ITI_InspectionSearchModel, InspectionMemberDetailsDataModel, SaveCheckSSODataModel } from '../../../Models/ITI/ITI_InspectionDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIInspectionService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITI_Inspection";
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

  public async GetAllData(request: ITI_InspectionSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllInspectedData(request: ITI_InspectionSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllInspectedData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITIInspectionDropdown(request: ITI_InspectionDropdownModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/GetITIInspectionDropdown`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: ITI_InspectionDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDeploymentData(request: InspectionDeploymentDataModel[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveInspectionDeploymentData`, body, this.headersOptions1)
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

  public async GetAllData_GenerateOrder(request: ITI_InspectionSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData_GenerateOrder`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async check_Engagement(requestMember: InspectionMemberDetailsDataModel) {
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

  public async GenerateInspectionDeploymentOrder(id : number) {
    
    return await this.http.post(`${this.APIUrl}/GenerateInspectionDeploymentOrder/${id}`, this.headersOptions1)
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
  public async GetDistrictMaster(request: ITI_InspectionSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDistrictMaster`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
