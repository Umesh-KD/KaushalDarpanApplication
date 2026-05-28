import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel } from '../../Models/HrMasterDataModel';
import { CompanyEventSearchModel, ConcernPersonDetailsDataModel, IIP_EventDataModel, IIP_SearchModel, IndustryInstitutePartnershipMasterDataModels, IndustryInstitutePartnershipMasterSearchModel, IndustryInstitutePartnershipMaster_Action, IndustryTrainingMaster, IndustryTrainingSearch } from '../../Models/IndustryInstitutePartnershipMasterDataModel';
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

    public async GetAllDataEvent(searchRequest: IndustryInstitutePartnershipMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataEvent`, body, this.headersOptions)
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

  public async SaveData_IIP_Company(request: IndustryInstitutePartnershipMasterDataModels) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData_IIP_Company`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetById_IIP_CompanyDetails(request: IIP_SearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetById_IIP_CompanyDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteCompanyById_IIP(request: IndustryInstitutePartnershipMasterDataModels) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteCompanyById_IIP`,body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Delete_Hr(request: ConcernPersonDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Delete_Hr`,body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData_IIP_Events(request: IIP_EventDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData_IIP_Events`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCompanyEvents(searchRequest: CompanyEventSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCompanyEvents`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCompanyEventsStaff(searchRequest: CompanyEventSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCompanyEventsStaff`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Savestaffconsent(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Savestaffconsent`,body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeleteEvent_ById(request: IIP_EventDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteEvent_ById`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetEvent_ById(request: CompanyEventSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetEvent_ById`,body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApproveCompanyEvents(request: IndustryInstitutePartnershipMasterDataModels[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ApproveCompanyEvents`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEventConsentData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetEventConsentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateConsentStatus(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateConsentStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIIPEventConsentReportData(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetIIPEventConsentReportData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
