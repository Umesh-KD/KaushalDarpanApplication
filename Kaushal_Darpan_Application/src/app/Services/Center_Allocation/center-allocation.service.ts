import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { CenterMasterDataModels } from '../../Models/CenterMasterDataModels';
import { CenterAllocationSearchModel, CenterAllocationtDataModels } from '../../Models/CenterAllocationDataModels';

@Injectable({
  providedIn: 'root'
})
export class CenterAllocationService {
  readonly APIUrl = this.appsettingConfig.apiURL + "CenterAllocation";
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
  public async GetAllData(searchRequest: CenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/GetAllData", searchRequest, this.headersOptions)
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
  public async DownloadCenterSuperintendent(searchRequest: CenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/DownloadCenterSuperintendent", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateCenterSuperintendentOrder(searchRequest: any) {
    return await this.http.post(this.APIUrl + "/GenerateCenterSuperintendentOrder", searchRequest, this.headersOptions)
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
  //Get
  public async GetInstituteByCenterID(searchRequest: CenterAllocationSearchModel) {
    return await this.http.post(this.APIUrl + "/GetInstituteByCenterID", searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: CenterAllocationtDataModels) {
    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveAllData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async savedata(request: CenterAllocationtDataModels[]) {
    const body = JSON.stringify(request)
    return await this.http.post(this.APIUrl + '/SaveAllData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
