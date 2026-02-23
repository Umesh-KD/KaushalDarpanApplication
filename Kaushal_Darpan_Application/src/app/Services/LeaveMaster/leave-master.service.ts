import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel, HrMaster_Action } from '../../Models/HrMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { CreditLeaveModel, LeaveMaster, LeaveMasterSearchModel } from '../../Models/LeaveMasterDataModel';


@Injectable({
  providedIn: 'root'
})
export class LeaveMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "LeaveMaster";
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

  //Get all data
  public async GetAllData(searchRequest: LeaveMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get by id
  public async GetById(ID: number,RoleID:number=0,StaffID:number=0) {
    return await this.http.get(`${this.APIUrl}/GetByID/${ID}/${RoleID}/${StaffID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //save data
  public async SaveData(request: LeaveMaster) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(ID: number, userId: number, RoleID:number=0,StaffID:number=0) {
    debugger
    var body = JSON.stringify({ "ID": ID, "ModifyBy": userId });
    return await this.http.post(`${this.APIUrl}/DeleteByID/${ID}/${userId}/${RoleID}/${StaffID}`,body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStaffLeaveRequest(searchRequest: LeaveMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStaffLeaveRequest`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ByIDStaffLeaveList(searchRequest: LeaveMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ByIDStaffLeaveList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveStaffLeaveRequest(request: LeaveMaster) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveStaffLeaveRequest", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRemainingLeave(searchRequest: LeaveMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetRemainingLeave`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetLeaveCreditStaffData(searchRequest: LeaveMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetLeaveCreditStaffData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
  public async GetStaffWithLeaveBalance(searchRequest: LeaveMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStaffWithLeaveBalance`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


    //save data
    public async CreditStaffLeave(request: CreditLeaveModel[]) {
      var body = JSON.stringify(request);
  
      return await this.http.post(`${this.APIUrl}/Save_CreditStaffLeave`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }

    //save BTER_NONGAZETTED data
    public async CreditStaffLeave_NonGazetted(request: CreditLeaveModel[]) {
      var body = JSON.stringify(request);
  
      return await this.http.post(`${this.APIUrl}/Save_CreditStaffLeave_NonGazetted`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }

    //save BTER_NONGAZETTED data
    public async CreditStaffLeave_ADTE_NonGazetted(request: CreditLeaveModel[]) {
      var body = JSON.stringify(request);
  
      return await this.http.post(`${this.APIUrl}/Save_CreditStaffLeave_ADTE_NonGazetted`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
  
}
