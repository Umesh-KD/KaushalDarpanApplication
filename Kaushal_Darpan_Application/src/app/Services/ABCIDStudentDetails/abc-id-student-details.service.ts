import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { PapersMasterDataModels } from '../../Models/PaperMasterDataModels';
import { AbcIdStudentDetailsSearchModel, StudentMasterModel } from '../../Models/StudentMasterModels';
import { ABCIDStudentDetailsDataModel } from '../../Models/ABCIDStudentDetailsDataModel';

@Injectable({
  providedIn: 'root'
})
export class AbcIdStudentDetailsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "AbcIdStudentDetails";
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
  public async GetABCIDCount(request: StudentMasterModel) {
    const body = JSON.stringify(request);
    return await this.http.get(this.APIUrl + "/GetABCIDCount", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllData(request: AbcIdStudentDetailsSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DownloadConsolidateABCIDReport(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DownloadConsolidateABCIDReport", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DownloadABCIDSummaryReport(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DownloadABCIDSummaryReport", body, this.headersOptions)
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

  public async SaveData(save: ABCIDStudentDetailsDataModel) {
    const body = JSON.stringify(save);
    return await this.http.post(this.APIUrl + '/SaveData', save, this.headersOptions)
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

}
