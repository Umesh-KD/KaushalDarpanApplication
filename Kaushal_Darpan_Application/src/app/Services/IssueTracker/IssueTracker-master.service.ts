import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { IssueTrackerDataModels, IssueTrackerDataSearchModels } from '../../Models/IssueTrackerDataModels';
//import { AdminDashboardSearchModel } from '../../../Models/AdminDashboardDataModel';

@Injectable({
  providedIn: 'root'
})
export class IssueTrackerMasterService {
  [x: string]: any;
  readonly APIUrl = this.appsettingConfig.apiURL + "IssueTracker";
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
  public async GetAllData(searchRequest: IssueTrackerDataSearchModels) {
    var body = JSON.stringify(searchRequest);
    debugger;
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
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

  public async SaveData(request: IssueTrackerDataModels) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/saveData', request, this.headersOptions)
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
  public async GetKDUserMasterDDL(RoleID: number): Promise<any> {
    return await this.http.post(
      `${this.APIUrl}/GetUserList/${RoleID}`, this.headersOptions
    )
      .pipe(
        catchError(this.handleErrorObservable)
      )
      .toPromise();
  }
  public async AssignIssure(request: any[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/AssignIssure`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
