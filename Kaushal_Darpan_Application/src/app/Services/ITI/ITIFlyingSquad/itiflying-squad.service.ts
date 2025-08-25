import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CenterObserverDataModel, CenterObserverSearchModel, CenterObserverDeployModel, DeploymentDataModel, CODeploymentDataModel, CenterMasterDDLDataModel } from '../../../Models/CenterObserverDataModel';
import { TimeTableSearchModel } from '../../../Models/TimeTableModels';

@Injectable({
  providedIn: 'root'
})
export class ITIFlyingSquadService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIFlyingSquadManage";
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

  public async SaveData(request: CenterObserverDataModel) {
    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetAllData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllInspectedData(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetAllInspectedData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeployTeam(request: CenterObserverDeployModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DeployTeam', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(ID: number, DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + '/GetByID/' + ID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(request: CenterObserverDataModel) {
    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/DeleteDataByID', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveDeploymentData(request: DeploymentDataModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDeploymentData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDeploymentDetailsByID(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetDeploymentDetailsByID', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllTimeTableData(request: TimeTableSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetAllTimeTableData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDataForVerify(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetAllDataForVerify', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDeploymentVerifiedData(request: CODeploymentDataModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDeploymentVerifiedData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDataForGenerateOrder(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetAllDataForGenerateOrder', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateFlyingSquadDutyOrder(request: CODeploymentDataModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GenerateFlyingSquadDutyOrder', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateCOAnsweredReport(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GenerateCOAnsweredReport', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTimeTableDates(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetTimeTableDates', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDeploymentDataByID(request: CenterObserverDataModel) {
    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/DeleteDeploymentDataByID', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenter_DistrictWise(request: CenterMasterDDLDataModel) {
    var body = JSON.stringify(request);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + '/GetCenter_DistrictWise', body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetExamShift(DepartmentID: number = 2) {
    return await this.http.get(this.APIUrl + '/GetExamShift/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async ForwardToVerify(request: CODeploymentDataModel[]) {
  //  debugger;
  //  const body = JSON.stringify(request);
  //  return await this.http.post(this.APIUrl + '/ForwardToVerify', body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}


  //public async RequestApprove(Deployeid: number , Remark : string ) {
  //  return await this.http.post(this.APIUrl + '/RequestApprovedbyAdmin/' + Deployeid +"/"+ Remark , this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async RequestApprove(DeplomentId: number) {
    return await this.http.post(this.APIUrl + '/RequestApprovedbyAdmin/' + DeplomentId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
