import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { HostelSearchModel, CreateHostelDataModel, HostelRoomSeatSearchModel, CreateHostelRoomSeatDataModel, FacilitiesDataModel, FacilitiesSearchModel, StudentDataModel, CollegeHostelDetailsSearchModel, HostelStudentSearchModel } from '../../Models/Hostel-Management/HostelManagmentDataModel';
import { CreateGuestHouseDataModel, GuestHouseSearchModel } from '../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';

@Injectable({
  providedIn: 'root'
})


export class GuestHouseService {

  readonly APIUrl = this.appsettingConfig.apiURL + "GuestHouse";
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

  public async GetAllHostelList(searchRequest: GuestHouseSearchModel) {
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


  public async SaveData(request: CreateGuestHouseDataModel) {


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

}
