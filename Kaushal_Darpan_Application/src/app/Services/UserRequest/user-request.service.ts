import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { UserRequestModel } from '../../Models/UserRequestDataModel';
import { BterRequestSearchModel, RequestSearchModel, JoiningLetterSearchModel, RelievingLetterSearchModel, ITI_EM_UnlockProfileDataModel } from '../../Models/ITI/UserRequestModel';
import { Bter_Govt_EM_SanctionedPostBasedInstituteSearchDataModel,  BTERRequestUpdateStatus, BterStaffUserRequestReportSearchModel, RequestUpdateStatus, } from '../../Models/ITIGovtEMStaffMasterDataModel';
import { BTER_EM_UnlockProfileDataModel } from '../../Models/BTER/BTER_EstablishManagementDataModel';

@Injectable({
  providedIn: 'root'
})

export class UserRequestService {
  readonly APIUrl = this.appsettingConfig.apiURL + "UserRequest";

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
  public async GetAllData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetAllData", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(PK_ID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: UserRequestModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UserRequest(request: RequestSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/UserRequest', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async UserRequestUpdateStatus(searchRequest: RequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/UserRequestUpdateStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StafffJoiningRequestUpdateAndPromotions(searchRequest: RequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/StafffJoiningRequestUpdateAndPromotions`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UserRequestHistoryList(request: RequestSearchModel) {
    debugger
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/UserRequestHistory', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  /*  ------------------------------- Bter Em---------------*/


  public async BterEmUserRequest(request: BterRequestSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/BterEmUserRequest', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BterEmUserRequestUpdateStatus(searchRequest: BTERRequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BterEmUserRequestUpdateStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterEmStafffJoiningRequestUpdateAndPromotions(searchRequest: BTERRequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BterEmStafffJoiningRequestUpdateAndPromotions`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterEmUserRequestHistoryList(request: BterRequestSearchModel) {
    debugger
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/BterEmUserRequestHistory', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterEmJoiningLetter(request: JoiningLetterSearchModel) {
    debugger
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetJoiningLetter', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BterEmRelievingLetter(request: RelievingLetterSearchModel) {
    debugger
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetRelievingLetter', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async BterGovtEM_Govt_SanctionedPostInstitutePersonnelBudget_GetAllData(searchRequest: Bter_Govt_EM_SanctionedPostBasedInstituteSearchDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BterGovtEM_Govt_SanctionedPostInstitutePersonnelBudget_GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterGovtEM_Govt_EstablishUserRequestReportRelievingAndJoing(searchRequest: BterStaffUserRequestReportSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BterGovtEM_Govt_EstablishUserRequestReportRelievingAndJoing`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBter_GetStaffDetailsVRS(searchRequest: BTER_EM_UnlockProfileDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetBter_GetStaffDetailsVRS`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    public async GetITI_GetStaffDetailsVRS(searchRequest: ITI_EM_UnlockProfileDataModel) {
    var body = JSON.stringify(searchRequest);
      debugger  
    return await this.http.post(`${this.APIUrl}/GetITI_GetStaffDetailsVRS`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
