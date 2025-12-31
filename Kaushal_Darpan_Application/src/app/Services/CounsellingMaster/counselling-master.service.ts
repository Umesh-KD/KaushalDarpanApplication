import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel } from '../../Models/HrMasterDataModel';
import { CompanyMasterDataModels, CompanyMasterSearchModel, CompanyMaster_Action } from '../../Models/CompanyMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { AddCollegeWiseScholarshipModel } from '../../Models/CollegeWiseScholarshipModel';
import { CounsellingAllotmentListModel, CounsellingAllottedListSearchModel, EditInstituteDataModel_Counselling,CounsellingReportListSearchModel,CounsellingAppointmentOrder } from '../../Models/CounsellingMasterModel';
import { EditVacancyDataModel } from '../../Models/CounsellingApplicationFormDataModel';


@Injectable({
  providedIn: 'root'
})
export class CounsellingMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "CounsellingMaster";
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


    //Get studetn list eligible for placement all data
  public async GetCounsellingAllotmentList(searchRequest: CounsellingAllotmentListModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCounsellingAllotmentList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
   public async GetCounsellingAllotmentListExcel(searchRequest: CounsellingAllotmentListModel) {
    debugger;
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCounsellingAllotmentListExcel`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
    //Get studetn list eligible for placement all data
  public async GetCandidateList(searchRequest: CounsellingAllotmentListModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCandidateList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 
  public async SaveCandidateAllotment_Counselling(TradeID: number = 0, request: any[]) {
    var body = JSON.stringify(request);
    debugger
    return await this.http.post(`${this.APIUrl}/SaveCandidateAllotment_Counselling/${TradeID}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllottedCandidateList_Counselling(searchRequest: CounsellingAllottedListSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllottedCandidateList_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveFinalInstituteAllotment_Counselling(searchRequest: EditInstituteDataModel_Counselling) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/SaveFinalInstituteAllotment_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateAllotmentOrder_Counselling(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GenerateAllotmentOrder_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async UploadStatusCheckNew(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UploadStatusCheckNew`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSampleExcelFile_CounsellingVacant() {
    return await this.http.get(this.APIUrl + '/GetSampleExcelFile_CounsellingVacant', this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async ImportExcelFile_CounsellingVacant(file: any | null = null) {
    //formdata
    const formData = new FormData();
    formData.append("file", file);
    return await this.http.post(this.APIUrl + "/ImportExcelFile_CounsellingVacant", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveExcelData_CounsellingVacant(ImportExcelList: any) {
    const body = JSON.stringify(ImportExcelList);
    return await this.http.post(this.APIUrl + '/SaveExcelData_CounsellingVacant', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCounsellingVacancyData(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetCounsellingVacancyData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EditVacancyData_Counselling(request: EditVacancyDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/EditVacancyData_Counselling', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetVacancyDetailsById_Counselling(TradeInstituteID: number) {
    return await this.http.get(this.APIUrl + '/GetVacancyDetailsById_Counselling/'+ TradeInstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllottedCandidateList_CounsellingReport(searchRequest: CounsellingAllottedListSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllottedCandidateList_CounsellingReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
    public async GetCounselling_GetCandidateDetailsRPT(searchRequest: CounsellingReportListSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/Counselling_GetCandidateDetailsRPT`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GenerateCounsellingAppointmentOrder(request: CounsellingAppointmentOrder) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GenerateCounsellingAppointmentOrder`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
public async GenerateCounsellingAppointmentOrderExcel(request: CounsellingAppointmentOrder) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GenerateCounsellingAppointmentOrderExcel`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
