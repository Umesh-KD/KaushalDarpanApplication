import { Injectable } from '@angular/core';
import { CenterObserverDataModel, CenterObserverDeployModel, CenterObserverSearchModel, CODeploymentDataModel, DeploymentDataModel, GenerateDutyOrder, StaffMasterDDLDataModel } from '../../Models/CenterObserverDataModel';
import { catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../Common/appsetting.service';
import { TimeTableSearchModel } from '../../Models/TimeTableModels';

@Injectable({
  providedIn: 'root'
})
export class CenterObserverService {
 readonly APIUrl = this.appsettingConfig.apiURL + "CenterObserver";
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

  public async DeployTeam(request: CenterObserverDeployModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DeployTeam', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(ID: number, DepartmentID: number=0) {
    return await this.http.get(this.APIUrl + '/GetByID/' + ID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById_Attendance(ID: number, DepartmentID: number=0) {
    return await this.http.get(this.APIUrl + '/GetById_Attendance/' + ID + '/' + DepartmentID, this.headersOptions)
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

  public async GenerateCenterObserverDutyOrder(request: CODeploymentDataModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GenerateCenterObserverDutyOrder', body, this.headersOptions)
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

  public async ForwardToVerify(request: CODeploymentDataModel[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/ForwardToVerify', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetObserverDataByID_Status_ForWeb(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetObserverDataByID_Status_ForWeb', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTeamCount(request: CenterObserverSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetTeamCount', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async IsRequestCenterObserver(model: any) {
    return await this.http.post(this.APIUrl + '/IsRequestCenterObserver', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
}
