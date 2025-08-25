import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, ITIGovtEMStaffHostelListModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITIGovtUserPrincipMasterSerchModel, ITIGovtEMStaffMasterDataModel, ITIGovtEMStaffMasterSearchModel, ITIGovtEMStaffSubjectList, ITIGovtEMStaff_EduQualificationDetailsModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITIGovtEM_OfficeSearchModel, ITIGovtEM_OfficeSaveDataModel, ITIGovtEM_PostSearchModel, ITIGovtEM_PostSaveDataModel, ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel, ITIGovtEMStaff_ServiceDetailsOfPersonalModel, ITIGovtEMStaff_PersonalDetailsModel, ITI_Govt_EM_SanctionedPostBasedInstituteModel, ITI_Govt_EM_SanctionedPostBasedInstituteSearchDataModel, RequestUpdateStatus, ITI_Govt_EM_RoleOfficeMapping_GetAllDataSearchDataModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel, JoiningLetterSearchModel, RelievingLetterSearchModel, ITI_Govt_EM_NodalSearchDataModel, ITI_Govt_EM_UserRequestHistoryListSearchDataModel, DeleteModel, ITI_Govt_EM_PersonalDetailByUserIDDeleteModel, ITI_Govt_EM_EducationDeleteModel, ITI_Govt_EM_ServiceDeleteModel } from '../../Models/ITIGovtEMStaffMasterDataModel';

import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class ITIGovtEMStaffMaster {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIGovtEMStaffMaster";
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

  public async GetAllData(searchRequest: ITIGovtEMStaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  public async GetAllTotalExaminerData(searchRequest: ITIGovtEMStaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllTotalExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllStudentPersentData(searchRequest: ITIGovtEMStaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllStudentPersentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveStaffBasicDetails(request: ITIGovtEMAddStaffBasicDetailDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/StaffBasicDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPrincipleList(searchRequest: ITIGovtUserPrincipMasterSerchModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetPrincipleList", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveStaffDetails(request: ITIGovtEMStaffMasterDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/StaffDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById(StaffID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${StaffID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteById(StaffID: number, userId: number) {
    var body = JSON.stringify({ "HRManagerID": StaffID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${StaffID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(PK_ID: number, DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetSSOIDDetails(SSOId: string, SSOUserName: string, SSOPassword: string) {
    
    return await this.http.get(this.APIUrl + "/getSsoDetaislBySSOId?SSOId=" + SSOId ).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();

    
  }

  // New Work Pawan 18-02-2025

  public async StaffLevelType(searchRequest: ITIGovtEMStaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/StaffLevelType`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async StaffLevelChild(searchRequest: ITIGovtEMStaffMasterSearchModel) {
    
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/StaffLevelChild`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async LockandSubmit(request: ITIGovtEMStaffMasterDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/LockandSubmit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApproveStaff(request: ITIGovtEMStaffMasterDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ApproveStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UnlockStaff(request: ITIGovtEMStaffMasterDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/UnlockStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async IsDownloadCertificate(request: ITIGovtEMStaffMasterDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/IsDownloadCertificate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async IsDeleteHostelWarden(SSOID: string) {
    return await this.http.delete(this.APIUrl + '/IsDeleteHostelWarden/' + SSOID , this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ChangeWorkingInstitute(request: ITIGovtEMStaffMasterDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ChangeWorkingInstitute`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCurrentWorkingInstitute_ByID(searchRequest: ITIGovtEMStaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCurrentWorkingInstitute_ByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateSSOIDByPriciple(request: UpdateSSOIDByPricipleModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/UpdateSSOIDByPriciple`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_OfficeGetAllData(searchRequest: ITIGovtEM_OfficeSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_OfficeGetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_OfficeSaveData(request: ITIGovtEM_OfficeSaveDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_OfficeSaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_OfficeGetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/ITIGovtEM_OfficeGetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_OfficeDeleteById(StaffID: number, userId: number) {
    var body = JSON.stringify({ "HRManagerID": StaffID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/ITIGovtEM_OfficeDeleteById/${StaffID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ITIGovtEM_PostGetAllData(searchRequest: ITIGovtEM_PostSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_PostGetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_PostSaveData(request: ITIGovtEM_PostSaveDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_PostSaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_PostGetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/ITIGovtEM_PostGetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_PostDeleteById(StaffID: number, userId: number) {
    var body = JSON.stringify({ "HRManagerID": StaffID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/ITIGovtEM_PostDeleteById/${StaffID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllITI_Govt_EM_OFFICERS(request: ITI_Govt_EM_OFFICERSSearchDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/GetAllITI_Govt_EM_OFFICERS`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ITIGovtEM_Govt_AdminT2Zonal_Save(request: ITI_Govt_EM_ZonalOFFICERSDataModel[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_AdminT2Zonal_Save`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_SSOIDCheck(SSOID: string) {
    return await this.http.get(this.APIUrl + "/ITIGovtEM_SSOIDCheck/" + SSOID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_Govt_AdminT2Zonal_GetAllData(searchRequest: ITI_Govt_EM_ZonalOFFICERSSearchDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_AdminT2Zonal_GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITI_GOVT_EM_ApproveRejectStaff(searchRequest: RequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITI_GOVT_EM_ApproveRejectStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_Govt_StaffProfileQualification(request: ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_StaffProfileQualification`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_Govt_StaffProfileStaffPosting(request: ITIGovtEMStaff_ServiceDetailsOfPersonalModel[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_StaffProfileStaffPosting`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_Govt_StaffProfileUpdate(request: ITIGovtEMStaff_PersonalDetailsModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_StaffProfileUpdate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_Govt_PersonnelDetailsInstitutionsAccordingBudget_Save(request: ITI_Govt_EM_SanctionedPostBasedInstituteModel[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_PersonnelDetailsInstitutionsAccordingBudget_Save`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_Govt_SanctionedPostInstitutePersonnelBudget_GetAllData(searchRequest: ITI_Govt_EM_SanctionedPostBasedInstituteSearchDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_SanctionedPostInstitutePersonnelBudget_GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_Govt_RoleOfficeMapping_GetAllData(searchRequest: ITI_Govt_EM_RoleOfficeMapping_GetAllDataSearchDataModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_Govt_RoleOfficeMapping_GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ITIGovtEM_ITI_Govt_EM_GetUserLevel(UserID: number=0) {
    return await this.http.get(this.APIUrl + "/ITIGovtEM_ITI_Govt_EM_GetUserLevel/" + UserID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ITIGovtEM_ITI_Govt_Em_PersonalDetailByUserID(searchRequest: ITI_Govt_EM_PersonalDetailByUserIDSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_ITI_Govt_Em_PersonalDetailByUserID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async ITIGovtEM_DeleteByIdStaffPromotionHistory(StaffID: number, userId: number) {
  // // var body = JSON.stringify({ "HRManagerID": StaffID, "ModifyBy": userId });
  //  return await this.http.delete(`${this.APIUrl}/ITIGovtEM_DeleteByIdStaffPromotionHistory/${StaffID}/${userId}`, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async ITIGovtEM_DeleteByIdStaffPromotionHistory(searchRequest: ITI_Govt_EM_PersonalDetailByUserIDDeleteModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITIGovtEM_DeleteByIdStaffPromotionHistory`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  //public async ITI_Govt_EM_EducationalQualificationDeleteByID(StaffID: number, userId: number) {
  //  // var body = JSON.stringify({ "HRManagerID": StaffID, "ModifyBy": userId });
  //  return await this.http.delete(`${this.APIUrl}/ITI_Govt_EM_EducationalQualificationDeleteByID/${StaffID}/${userId}`, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}


  public async ITI_Govt_EM_EducationalQualificationDeleteByID(searchRequest: ITI_Govt_EM_EducationDeleteModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITI_Govt_EM_EducationalQualificationDeleteByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  //public async ITI_Govt_EM_ServiceDetailsOfPersonnelDeleteByID(StaffID: number, userId: number) {
  //  // var body = JSON.stringify({ "HRManagerID": StaffID, "ModifyBy": userId });
  //  return await this.http.delete(`${this.APIUrl}/ITI_Govt_EM_ServiceDetailsOfPersonnelDeleteByID/${StaffID}/${userId}`, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async ITI_Govt_EM_ServiceDetailsOfPersonnelDeleteByID(searchRequest: ITI_Govt_EM_ServiceDeleteModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ITI_Govt_EM_ServiceDetailsOfPersonnelDeleteByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITI_Govt_EM_GetUserProfileStatus(StaffID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetITI_Govt_EM_GetUserProfileStatus/" + StaffID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async FinalSubmitUpdateStaffProfileStatus(searchRequest: RequestUpdateStatus) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/FinalSubmitUpdateStaffProfileStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ITIGovtEM_GetSSOID(StaffId: number = 0) {
   
    return await this.http.get(this.APIUrl + "/ITIGovtEM_GetSSOID/" + StaffId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async JoiningLetter(request: JoiningLetterSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetJoiningLetter', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async RelievingLetter(request: RelievingLetterSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetRelievingLetter', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITI_Govt_CheckDistrictNodalOffice(request: ITI_Govt_EM_NodalSearchDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/GetITI_Govt_CheckDistrictNodalOffice`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async ITIGovtEM_OfficeDelete(Id: number, ModifyBy: number) {
  //  /*var body = JSON.stringify({ "HRManagerID": StaffID, "ModifyBy": userId });*/
  //  return await this.http.delete(`${this.APIUrl}/ITIGovtEM_OfficeDelete/${Id}/${ModifyBy}`, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async UserProfileStatusHistoryList(request: ITI_Govt_EM_UserRequestHistoryListSearchDataModel) {
   
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITI_Govt_EM_UserProfileStatusHt', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIGovtEM_OfficeDelete(request: DeleteModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/ITIGovtEM_OfficeDelete', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }











  


}


