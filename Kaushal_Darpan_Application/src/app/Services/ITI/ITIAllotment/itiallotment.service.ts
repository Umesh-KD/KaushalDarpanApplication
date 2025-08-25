import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AllotmentdataModel, DirectAllocationDataModel, DirectAllocationSearchModel, SearchModel } from '../../../Models/ITIAllotmentDataModel';
import { AllotmentStatusSearchModel } from '../../../Models/BTER/BTERAllotmentStatusDataModel';
import { IMCAllocationSearchModel } from '../../../Models/ITIIMCAllocationDataModel';
import { StudentsJoiningStatusMarksSearchModel } from '../../../Models/StudentsJoiningStatusMarksDataMedels';

@Injectable({
  providedIn: 'root'
})

export class ITIAllotmentService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIAllotment";
  readonly headersOptions: any;
  readonly headersOptions1: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
     
    };
    this.headersOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'no-loader': 'true'
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
  public async GetGenerateAllotment(request: AllotmentdataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetGenerateAllotment`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AllotmentCounter(searchRequest: SearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/AllotmentCounter`, body, this.headersOptions1)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ShowSeatMetrix(searchRequest: SearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetShowSeatMetrix`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetOptionDetailsbyID(searchRequest: SearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetOptionDetailsbyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ShowStudentSeatAllotment(searchRequest: SearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentSeatAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ShowAllotmentDataList(searchRequest: SearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentStatusList(searchRequest: AllotmentStatusSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentStatusList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetPublishAllotment(request: AllotmentdataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetPublishAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ShowAlGetAllotmentReport(searchRequest: SearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotmentReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentLetter(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetAllotmentLetter/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentReportingReceipt(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetAllotmentReportingReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotmentFeeReceipt(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetAllotmentFeeReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  /******Direct Admission**********/

  public async GetDirectAdmissionReceipt(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetDirectAdmissionReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  public async GetAllData(searchRequest: DirectAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDataPhoneVerify(searchRequest: DirectAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataPhoneVerify`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async StudentDetailsList(searchRequest: DirectAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/StudentDetailsList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ShiftUnitList(searchRequest: DirectAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ShiftUnitList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateAllotments(request: DirectAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateAllotments`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateMobileNo(request: DirectAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdateMobileNo`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTradeListByCollege(searchRequest: DirectAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTradeListByCollege`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async RevertAllotments(request: DirectAllocationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/RevertAllotments`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentDetails(searchRequest: DirectAllocationSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllotmentReceipt(AllotmentId: any) {
    return await this.http.get(this.APIUrl + "/GetAllotmentReceipt/" + AllotmentId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadCollegeAllotmentData(searchRequest: StudentsJoiningStatusMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/DownloadCollegeAllotmentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
