import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CreateGuestRoomDataModel, GuestRoomSearchModel, GuestApplyForGuestRoomSearchModel, CreateGuestRoomSeatDataModel, GuestRoomSeatSearchModel, FacilitiesDataModel, FacilitiesSearchModel, GuestApplyForGuestRoomDataModel, GuestStaffProfileSearchModel, StatusChangeGuestModel } from '../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { RoomDetailsDataModel } from '../../Models/GuestRoom-Management/RoomDetailsDataModel';

@Injectable({
  providedIn: 'root'
})
export class GuestRoomManagmentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "GuestRoomManagement";
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

  public async GetAllGuestRoomList(searchRequest: GuestRoomSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllGuestRoomList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByGuestHouseId/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: CreateGuestRoomDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetGuestHouseNameList(searchRequest: GuestRoomSeatSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetGuestHouseNameList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllRoomSeatList(searchRequest: GuestRoomSeatSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllRoomSeatList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByGRSMasterID(PK_ID: number) { 
    return await this.http.get(this.APIUrl + "/GetByGRSMasterID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByGRSMasterID(request: StatusChangeGuestModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteDataByGRSMasterID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveFacilities(request: FacilitiesDataModel) {
    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveFacilities', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GuestRoomFacilityList(searchRequest: FacilitiesSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GuestRoomFacilityList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByGFID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByGFID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeleteDataByGFID(request: StatusChangeGuestModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteDataByGFID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  

  public async IsFacilitiesStatusByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/IsFacilitiesStatusByID/' + PK_ID + "/" + ModifyBy , this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GuestRoomSeatMasterSaveData(request: CreateGuestRoomSeatDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GuestRoomSeatMasterSaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GuestApplyForGuestRoomSaveData(request: GuestApplyForGuestRoomDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GuestApplyForGuestRoomSaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GuestRequestList(searchRequest: GuestApplyForGuestRoomSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GuestRequestList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllGuestApplyForGuestRoomList(searchRequest: GuestApplyForGuestRoomSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllGuestApplyForGuestRoomList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async updateReqStatus(request: GuestApplyForGuestRoomDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/updateReqStatusGuestRoom', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async updateReqStatusCheckInOut(request: GuestApplyForGuestRoomDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/updateReqStatusCheckInOut', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteGuestApplyForGuestRoomDataByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteGuestApplyForGuestRoomDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GuestRequestReportList(searchRequest: GuestApplyForGuestRoomSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GuestRequestReportList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GuestStaffProfile(searchRequest: GuestStaffProfileSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GuestStaffProfile`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveGuestRoomDetails(searchRequest: RoomDetailsDataModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/SaveGuestRoomDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllGuestRoomDetails(searchRequest: RoomDetailsDataModel) {
    return await this.http.post(`${this.APIUrl}/GetAllGuestRoomDetails`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByIDGuestRoomDetails(id: number) {
    return await this.http.get(`${this.APIUrl}/GetAllGuestRoomDetails?id=`+id, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteGuestRoomDetails(searchRequest: RoomDetailsDataModel) {
   
    return await this.http.post(`${this.APIUrl}/GetAllGuestRoomDetails`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

}
