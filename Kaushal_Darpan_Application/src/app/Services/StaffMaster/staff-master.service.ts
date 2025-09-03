import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AddStaffBasicDetailDataModel, BranchHODApplyModel, BranchHODModel, StaffDetailsDataModel, StaffMasterSearchModel, StudentEnrCancelReqModel } from '../../Models/StaffMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class StaffMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "StaffMaster";
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

  public async GetAllData(searchRequest: StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  public async GetAllTotalExaminerData(searchRequest: StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllTotalExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllStudentPersentData(searchRequest: StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllStudentPersentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveStaffBasicDetails(request: AddStaffBasicDetailDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/StaffBasicDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveStaffDetails(request: StaffDetailsDataModel) {
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

  public async StaffLevelType(searchRequest: StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/StaffLevelType`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async StaffLevelChild(searchRequest: StaffMasterSearchModel) {
    
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/StaffLevelChild`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async LockandSubmit(request: StaffDetailsDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/LockandSubmit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApproveStaff(request: StaffDetailsDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ApproveStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UnlockStaff(request: StaffDetailsDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/UnlockStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async IsDownloadCertificate(request: StaffDetailsDataModel) {
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

  public async ChangeWorkingInstitute(request: StaffDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ChangeWorkingInstitute`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCurrentWorkingInstitute_ByID(searchRequest: StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCurrentWorkingInstitute_ByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async AllBranchHOD(searchRequest: BranchHODModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/AllBranchHOD`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveBranchSectionData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/SaveBranchSectionData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBranchSectionData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetBranchSectionData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBranchSectionEnrollmentData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetBranchSectionEnrollmentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStudentEnrCancelRequestData(searchRequest: StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetStudentEnrCancelRequestData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApporveOrRejectEnrCancelRequest(searchRequest: StudentEnrCancelReqModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/ApporveOrRejectStudentEnrCancelRequest`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllRosterDisplay(model: any) {
    return await this.http.post(this.APIUrl + '/GetAllRosterDisplay', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
  public async SaveRosterDisplay(model: any) {
    return await this.http.post(this.APIUrl + '/SaveRosterDisplay', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetStreamIDBySemester(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStreamIDBySemester`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveRosterDisplayMultiple(model: any) {
    return await this.http.post(this.APIUrl + '/SaveRosterDisplayMultiple', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async DeleteRosterDisplay(model: any) {
    return await this.http.post(this.APIUrl + '/DeleteRosterDisplay', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async getdublicateCheckSection(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/getdublicateCheckSection`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}


