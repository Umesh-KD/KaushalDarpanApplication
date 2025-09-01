import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { BTER_EM_AddStaffBasicDetailDataModel, BTER_EM_AddStaffDataModel, BTER_EM_AddStaffDetailsDataModel, BTER_EM_ApproveStaffDataModel, BTER_EM_DeleteModel, BTER_EM_GetPersonalDetailByUserID, BTER_EM_StaffListSearchModel, BTER_EM_StaffMasterSearchModel, BTER_EM_UnlockProfileDataModel, BTERGovtEMStaffMasterDataModel, BTERGovtEMStaff_ServiceDetailsOfPersonalModel, Bter_RequestUpdateStatus, BTER_Govt_EM_PersonalDetailByUserIDSearchModel, BTER_Govt_EM_ServiceDeleteModel, BTER_Govt_EM_ZonalOFFICERSSearchDataModel, Bter_Govt_EM_UserRequestHistoryListSearchDataModel, StaffHostelSearchModel } from '../../../Models/BTER/BTER_EstablishManagementDataModel';
import { HODDashboardSearchModel, RequestUpdateStatus } from '../../../Models/ITIGovtEMStaffMasterDataModel';


@Injectable({
  providedIn: 'root'
})
export class BTEREstablishManagementService {
  readonly APIUrl = this.appsettingConfig.apiURL + "BTER_EstablishManagement";
  readonly headersOptions: any;
  readonly headersOptions1: any;
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

  public async BTER_EM_AddStaffInitialDetails(request: BTER_EM_AddStaffDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/BTER_EM_AddStaffInitialDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_GetStaffList(searchRequest: BTER_EM_StaffListSearchModel) {
    var body = JSON.stringify(searchRequest);
    
    return await this.http.post(`${this.APIUrl}/BTER_EM_GetStaffList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_AddStaffPrinciple(request: BTER_EM_AddStaffBasicDetailDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/BTER_EM_AddStaffPrinciple`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_GetPrincipleStaff(searchRequest: BTER_EM_StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTER_EM_GetPrincipleStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_GetPersonalDetailByUserID(searchRequest: BTER_EM_GetPersonalDetailByUserID) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTER_EM_GetPersonalDetailByUserID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_AddStaffDetails(searchRequest: BTER_EM_AddStaffDetailsDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTER_EM_AddStaffDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_DeleteStaff(request: BTER_EM_DeleteModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/BTER_EM_DeleteStaff', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_ApproveStaffProfile(searchRequest: BTER_EM_ApproveStaffDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTER_EM_ApproveStaffProfile`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_UnlockProfile(searchRequest: BTER_EM_UnlockProfileDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTER_EM_UnlockProfile`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTER_EM_InstituteDDL(DepartmentID: number = 0, InsType: number = 0, DistrictId: number = 0) {

    return await this.http.get(this.APIUrl + '/BTER_EM_InstituteDDL/' + DepartmentID + '/' + InsType + '/' + DistrictId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();  
  }

  //----------------- BTER ---------------//

  public async BTER_Govt_EM_ServiceDetailsOfPersonnelDeleteByID(searchRequest: BTER_Govt_EM_ServiceDeleteModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTER_Govt_EM_ServiceDetailsOfPersonnelDeleteByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBTER_Govt_EM_GetUserProfileStatus(StaffID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetBTER_Govt_EM_GetUserProfileStatus/" + StaffID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTERGovtEM_BTER_Govt_Em_PersonalDetailByUserID(searchRequest: BTER_Govt_EM_PersonalDetailByUserIDSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTERGovtEM_BTER_Govt_Em_PersonalDetailByUserID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BTERGovtEM_BTER_Govt_Em_PersonalDetailList(searchRequest: BTER_Govt_EM_PersonalDetailByUserIDSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/BTERGovtEM_BTER_Govt_Em_PersonalDetailList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BTERGovtEM_Govt_StaffProfileStaffPosting(request: BTERGovtEMStaff_ServiceDetailsOfPersonalModel[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/BTERGovtEM_Govt_StaffProfileStaffPosting`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async BTERFinalSubmitUpdateStaffProfileStatus(searchRequest: Bter_RequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/FinalSubmitUpdateStaffProfileStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UserProfileStatusHistoryList(request: Bter_Govt_EM_UserRequestHistoryListSearchDataModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetBter_Govt_EM_UserProfileStatusHt', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Bter_GOVT_EM_ApproveRejectStaff(searchRequest: RequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/Bter_GOVT_EM_ApproveRejectStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterStaffSubjectListModel(PK_ID: number, DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + "/BterStaffSubjectListModel/" + PK_ID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetHODDash(searchRequest: HODDashboardSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetHODDash`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStaff_HostelIDs(searchRequest: StaffHostelSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStaff_HostelIDs`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveStaff_HostelIDs(searchRequest: StaffHostelSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/SaveStaff_HostelIDs`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
