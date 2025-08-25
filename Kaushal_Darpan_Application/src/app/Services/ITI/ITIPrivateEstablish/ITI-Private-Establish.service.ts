import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ITIPrivateEstablish_AddStaffBasicDetailDataModel, ITIPrivateEstablish_StaffDetailsDataModel, ITIPrivateEstablish_StaffMasterSearchModel } from '../../../Models/ITIPrivateEstablishDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class ITIPrivateEstablishService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIPrivateEstablish";
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

  public async GetAllData(searchRequest: ITIPrivateEstablish_StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  public async GetAllTotalExaminerData(searchRequest: ITIPrivateEstablish_StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllTotalExaminerData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllStudentPersentData(searchRequest: ITIPrivateEstablish_StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllStudentPersentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveStaffBasicDetails(request: ITIPrivateEstablish_AddStaffBasicDetailDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/StaffBasicDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveStaffDetails(request: ITIPrivateEstablish_StaffDetailsDataModel) {
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

  public async StaffLevelType(searchRequest: ITIPrivateEstablish_StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/StaffLevelType`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async StaffLevelChild(searchRequest: ITIPrivateEstablish_StaffMasterSearchModel) {
    
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/StaffLevelChild`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async LockandSubmit(request: ITIPrivateEstablish_StaffDetailsDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/LockandSubmit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApproveStaff(request: ITIPrivateEstablish_StaffDetailsDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ApproveStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UnlockStaff(request: ITIPrivateEstablish_StaffDetailsDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/UnlockStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async IsDownloadCertificate(request: ITIPrivateEstablish_StaffDetailsDataModel) {
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

  public async ChangeWorkingInstitute(request: ITIPrivateEstablish_StaffDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ChangeWorkingInstitute`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCurrentWorkingInstitute_ByID(searchRequest: ITIPrivateEstablish_StaffMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCurrentWorkingInstitute_ByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}


