import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs';
import { RoomDetailsDataModel, RoomExcelDetailsModel } from '../../Models/Hostel-Management/RoomDetailsDataModel';
import { StatusChangeModel } from '../../Models/Hostel-Management/HostelManagmentDataModel';


@Injectable({
  providedIn: 'root'
})
export class HostelRoomDetailsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "HostelRoomDetails";
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
  public async GetAllData(HostelID: number = 0, RoomTypeID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetAllData/" + HostelID + "/" + RoomTypeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: RoomDetailsDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveExcelData(request: RoomExcelDetailsModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveExcelData', request, this.headersOptions)
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


  public async GetRoomDDLList(HostelID: number = 0, RoomTypeID: number = 0, EndTermID = 0) {
    
    return await this.http.get(this.APIUrl + "/GetRoomDDLList/" + HostelID + "/" + RoomTypeID + "/" + EndTermID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
