import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { CenterMasterDataModels } from '../../Models/CenterMasterDataModels';
import { CenterAllocationSearchModel, CenterAllocationtDataModels } from '../../Models/CenterAllocationDataModels';
import { ITIcenterAllocationSearchModel, ITICenterAllocationtDataModels } from '../../Models/ITI/ITICenterAllocationDataModel';
import { ExaminerDashboardModel } from '../../Models/CopyCheckerRequestModel';

@Injectable({
  providedIn: 'root'
})
export class ITICenterAllocationService {
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
  //Get 
  public async GetAllData(searchRequest: ITIcenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/GetAllData", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get
  public async GetInstituteByCenterID(searchRequest: ITIcenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/GetInstituteByCenterID", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async savedata(request: ITICenterAllocationtDataModels[]) {
    const body = JSON.stringify(request)
    return await this.http.post(this.APIUrl + '/SaveAllData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterSuperintendent(searchRequest: CenterAllocationSearchModel) {
   
    return await this.http.post(this.APIUrl + "/GetCenterSuperintendent", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetStatusCenterSuperintendentOrder(status: any, coursetype: number = 0) {
    return await this.http.get(this.APIUrl + "/GetStatusCenterSuperintendentOrder/" + status + "/" + coursetype, this.headersOptions)
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

  public async DownloadCenterSuperintendent(searchRequest: CenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/DownloadCenterSuperintendent", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveWorkflow(searchRequest: any) {
    return await this.http.post(this.APIUrl + "/SaveWorkflow", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetExamCoordinatorData(searchRequest: CenterAllocationSearchModel) {

    return await this.http.post(this.APIUrl + "/GetExamCoordinatorData", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async AssignExamCoordinatorData(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/AssignExamCoordinatorData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCenterSuperDashboard(searchRequest: ExaminerDashboardModel) {

    const body = JSON.stringify(searchRequest);

    return await this.http.post(this.APIUrl + "/GetCenterSuperDashboard", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DownloadExamCoordinate(searchRequest: CenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/DownloadExamCoordinate", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
