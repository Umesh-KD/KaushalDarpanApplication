import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel } from '../../Models/HrMasterDataModel';
import { IndustryInstitutePartnershipMasterDataModels, IndustryInstitutePartnershipMasterSearchModel, IndustryInstitutePartnershipMaster_Action, IndustryTrainingMaster, IndustryTrainingSearch } from '../../Models/IndustryInstitutePartnershipMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';


@Injectable({
  providedIn: 'root'
})
export class IndustryInstitutePartnershipMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "IndustryInstitutePartnershipMaster";
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
  public async GetAllData(searchRequest: IndustryInstitutePartnershipMasterSearchModel) {
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
  public async SaveData(request: IndustryInstitutePartnershipMasterDataModels) {
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

  public async Save_IndustryInstitutePartnershipValidation_NodalAction(request: IndustryInstitutePartnershipMaster_Action) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Save_IndustryInstitutePartnershipValidation_NodalAction", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //CompanyValidationList/{CollegeID}/{Status}
  //public async IndustryInstitutePartnershipValidationList(searchRequest: IndustryInstitutePartnershipMasterSearchModel) {
  //  return await this.http.get(this.APIUrl + "/CampusValidationList" + "/" + CompanyID + "/" + CollegeID + "/" + Status + "/" + DepartmentID, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async IndustryInstitutePartnershipValidationList(searchRequest: IndustryInstitutePartnershipMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/IndustryInstitutePartnershipValidationList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async SaveIndustryTrainingData(request: IndustryTrainingMaster) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveIndustryTrainingData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllIndustryTrainingData(searchRequest: IndustryTrainingSearch) {
    
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllIndustryTrainingData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
}
