import { Injectable } from '@angular/core';
import { DeallocateRoomDataModel, SearchRequestRoomAllotment, StudentRequestDataModal } from '../../Models/Hostel-Management/StudentRequestDataModal';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../Common/appsetting.service';
import {  RoomAllotmentDataModel } from '../../Models/Hostel-Management/RoomAllotmentDataModel';
import { DTEApplicationDashboardDataModel } from '../../Models/DTEApplicationDashboardDataModel';

@Injectable({
  providedIn: 'root'
})
export class StudentRequestService {
  readonly APIUrl = this.appsettingConfig.apiURL + "StudentRequests";
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
  //Get
  public async GetAllData(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  public async GetAllRoomAllotment(searchRequest: SearchRequestRoomAllotment) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllRoomAllotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async GetAllRoomAvailabilties(searchRequest: RoomAllotmentDataModel) {

    
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllRoomAvailabilties`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async ApprovedReq(ReqId: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/ApprovedReq/' + ReqId + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveData(Allotmentrequest: RoomAllotmentDataModel) {
    const body = JSON.stringify(Allotmentrequest);
    return await this.http.post(this.APIUrl + '/SaveData', Allotmentrequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async AllotmentCancelData(AllotmentCancelRequest: RoomAllotmentDataModel) {
    const body = JSON.stringify(AllotmentCancelRequest);
    return await this.http.post(this.APIUrl + '/AllotmentCancelData', AllotmentCancelRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetReportData(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetReportData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetHostelDashboard(searchRequest: DTEApplicationDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetHostelDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetGuestRoomDashboard(searchRequest: DTEApplicationDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetGuestRoomDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get Merit List
  public async GetAllHostelStudentMeritlist(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllHostelStudentMeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllGenerateHostelStudentMeritlist(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllGenerateHostelStudentMeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetAllGenerateHostelWardenStudentMeritlist(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllGenerateHostelWardenStudentMeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllPublishHostelStudentMeritlist(searchRequest: StudentRequestDataModal[]) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllPublishHostelStudentMeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllFinalPublishHostelStudentMeritlist(searchRequest: StudentRequestDataModal[]) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllFinalPublishHostelStudentMeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllFinalCorrectionPublishHostelStudentMeritlist(searchRequest: StudentRequestDataModal[]) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllFinalCorrectionPublishHostelStudentMeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllfinalHostelStudentMeritlist(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllfinalHostelStudentMeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllAffidavitApproved(searchRequest: StudentRequestDataModal[]) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllAffidavitApproved`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllAffidavitObjection(searchRequest: StudentRequestDataModal[]) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllAffidavitObjection`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllPrincipalstudentmeritlist(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllPrincipalstudentmeritlist`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDataStatus(searchRequest: StudentRequestDataModal) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeallocateRoom(Request: DeallocateRoomDataModel) {
    const body = JSON.stringify(Request);
    return await this.http.post(this.APIUrl + '/DeallocateRoom', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
