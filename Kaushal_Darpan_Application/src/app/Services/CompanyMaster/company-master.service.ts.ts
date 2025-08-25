import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel } from '../../Models/HrMasterDataModel';
import { CompanyMasterDataModels, CompanyMasterSearchModel, CompanyMaster_Action } from '../../Models/CompanyMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "CompanyMaster";
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
  public async GetAllData(searchRequest: CompanyMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get by id
  public async GetById(ID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${ID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //save data
  public async SaveData(request: CompanyMasterDataModels) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(ID: number, userId: number) {
    var body = JSON.stringify({ "HRManagerID": ID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${ID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Save_CompanyValidation_NodalAction(request: CompanyMaster_Action) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Save_CompanyValidation_NodalAction", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //CompanyValidationList/{CollegeID}/{Status}
  //public async CompanyValidationList(searchRequest: CompanyMasterSearchModel) {
  //  return await this.http.get(this.APIUrl + "/CampusValidationList" + "/" + CompanyID + "/" + CollegeID + "/" + Status + "/" + DepartmentID, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async CompanyValidationList(searchRequest: CompanyMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/CompanyValidationList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CompanyMasterReport(searchRequest: CompanyMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/CompanyMasterReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  

}
