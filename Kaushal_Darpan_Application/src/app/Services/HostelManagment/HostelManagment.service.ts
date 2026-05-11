import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {
  CreateHostelDataModel, HostelSearchModel, StudentDataModel, HostelStudentSearchModel, EditHostelStudentSearchModel, CreateHostelRoomSeatDataModel,
  HostelRoomSeatSearchModel, FacilitiesDataModel, FacilitiesSearchModel, CollegeHostelDetailsDataModel, CollegeHostelDetailsSearchModel,
  StatusChangeModel, HostelInstituteMappingModel, HostelFeeListModel, HostelFeeModel
} from '../../Models/Hostel-Management/HostelManagmentDataModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class HostelManagmentService {

  readonly APIUrl = this.appsettingConfig.apiURL + "HostelManagement";
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

  public async GetAllHostelList(searchRequest: HostelSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllHostelList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByHostelId/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 

  public async SaveData(request: CreateHostelDataModel) {
    

    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async DeleteDataByID(request: StatusChangeModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DeleteDataByID', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetHostelNameList(searchRequest: HostelRoomSeatSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetHostelNameList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveRoomSeatData(request: CreateHostelRoomSeatDataModel) {
    const body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveDataRoomSeatMaster`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllRoomSeatList(searchRequest: HostelRoomSeatSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllRoomSeatList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByHRSMasterID(PK_ID: number) { 
    return await this.http.get(this.APIUrl + "/GetByHRSMasterID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentDetailsForApply(searchRequest: any) {
   
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentDetailsForHostelApply`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentDetailsForHostel_Principle(searchRequest: any) {
   
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentDetailsForHostel_Principle`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async DeleteDataByHRSMasterID(request: StatusChangeModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DeleteDataByHRSMasterID', request, this.headersOptions)
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

  public async HostelFacilityList(searchRequest: FacilitiesSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/HostelFacilityList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByHFID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByHFID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async DeleteDataByHFID(request: StatusChangeModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/DeleteDataByHFID', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async StudentApplyHostel(request: StudentDataModel) {
    const body = JSON.stringify(request);
    
    return await this.http.post(this.APIUrl + '/StudentApplyHostel', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async EditStudentApplyHostel(request: StudentDataModel) {
    const body = JSON.stringify(request);
    
    return await this.http.post(this.APIUrl + '/EditStudentApplyHostel', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async HostelWardenupdateData(request: StudentDataModel) {
    const body = JSON.stringify(request);
    
    return await this.http.post(this.APIUrl + '/HostelWardenupdateData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CollegeHostelDetailsList(searchRequest: CollegeHostelDetailsSearchModel) {
 
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/CollegeHostelDetailsList`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async IsFacilitiesStatusByID(request: StatusChangeModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/IsFacilitiesStatusByID', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetLastFYEndTerm(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetLastFYEndTerm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllotedHostelDetails(searchRequest: HostelStudentSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllotedHostelDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async EditAllotedHostelDetails(searchRequest: EditHostelStudentSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/EditAllotedHostelDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async HostelInstituteMappingSaveData(request: HostelInstituteMappingModel) {
    
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/HostelInstituteMappingSaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllddlHostelList(searchRequest: HostelSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllddlHostelList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllHostelInstituteMappingList(searchRequest: HostelInstituteMappingModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllHostelInstituteMappingList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async UnmapHostelInstitute(id: number) {
  //  const request: any = {}
  //  request.id = id
  //  return await this.http
  //    .post(`${this.APIUrl}/UnmapHostelInstitute`, request, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    )
  //    .toPromise();
  //}
  public async UnmapHostelInstitute(model: any) {
    return await this.http
      .post(`${this.APIUrl}/UnmapHostelInstitute`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      )
      .toPromise();
  }

  public async GetHostelInstituteMappingByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetHostelInstituteMappingByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async getHostelFeeList() {
    debugger
    return await this.http.get(this.APIUrl + "/getHostelFeeList", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async SaveHostelFee(searchRequest: HostelFeeModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/SaveHostelFee`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetHostelFeeByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetHostelFeeByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRoomAllotmentCancelHistory(reqId: number) {

    return await this.http
      .get(
        this.APIUrl + "/GetRoomAllotmentCancelHistory/" + reqId,
        this.headersOptions
      )
      .pipe(
        catchError(this.handleErrorObservable)
      )
      .toPromise();

  }

}
