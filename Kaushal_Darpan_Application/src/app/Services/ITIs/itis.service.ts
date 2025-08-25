import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { ITIsDataModels, ITIsSearchModel } from '../../Models/ITIsDataModels';
import { ITITradeSearchModel } from '../../Models/ITITradeDataModels';
import { ItiReportDataModel } from '../../Models/ITI/ItiReportDataModel';
import { ITI_PlanningCollegesModel, ItiVerificationModel } from '../../Models/ItiPlanningDataModel';
import { ITICollegeSearchModel } from '../../Models/ITI/ITIStudentMeritInfoDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITICollegeMaster";
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

  public async GetAllData(searchRequest: ITIsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveData(request: ITIsDataModels) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_ITIsData_ByID(Id: number) {

    return await this.http.get(this.APIUrl + "/Get_ITIsData_ByID/" + Id + "/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetItiTradeData_ByID(Id: number) {
    return await this.http.get(this.APIUrl + "/GetItiTradeData_ByID/" + Id + "/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ResetSSOID(id: number, UserId: number, remark: string, SSOID: string) {
    return await this.http.post(this.APIUrl + "/ResetSSOID/" + id + "/" + UserId + '/' + remark + '/' + SSOID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataById(id: number, UserId: number, remark: string = '') {
    return await this.http.delete(this.APIUrl + "/DeleteDataById/" + id + "/" + UserId + '/' + remark, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDataReport(request: ItiReportDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveDataReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveDataPlanning(request: ITI_PlanningCollegesModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveDataPlanning`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Get_ITIsReportData_ByID(Id: number) {

    return await this.http.get(this.APIUrl + "/Get_ITIsReportData_ByID/" + Id + "/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Get_ITIsPlanningData_ByID(Id: number) {

    return await this.http.get(this.APIUrl + "/Get_ITIsPlanningData_ByID/" + Id + "/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_ITIsPlanningData_ByIDReport(Id: number) {

    return await this.http.get(this.APIUrl + "/Get_ITIsPlanningData_ByIDReport/" + Id + "/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ActiveStatusByID(PK_ID: number, ModifyBy: number, remark: string = '') {
    return await this.http.post(this.APIUrl + '/UpdateActiveStatusByID/' + PK_ID + "/" + ModifyBy + '/' + remark, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async unlockfee(id: number, UserId: number, remark: string) {
    return await this.http.post(this.APIUrl + "/unlockfee/" + id + "/" + UserId + '/' + remark, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    
  public async GetPlanningList(CollegeID: number=0, Status: number = 0) {
    return await this.http.get(this.APIUrl + "/GetPlanningList/" + CollegeID + "/" + Status, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ViewWorkflow(CollegeID: number = 0) {
    return await this.http.get(this.APIUrl + "/ViewWorkflow/" + CollegeID , this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveItiworkflow(request: ItiVerificationModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveItiworkflow`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadITIPlanning(Id: number) {

    return await this.http.get(this.APIUrl + "/DownloadITIPlanning/" + Id + "/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ItiSearchCollege(request: ITICollegeSearchModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/ItiSearchCollege`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIAllInstituteList_NCVT(searchRequest: ITIsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ITIAllInstituteList_NCVT`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
