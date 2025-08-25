import { Injectable } from '@angular/core';
import { RoomsMasterDataModel } from '../../Models/RoomsMasterDataModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class RoomsMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "RoomsMaster";
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
  public async GetAllData(searchRequest: RoomsMasterDataModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: RoomsMasterDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_RoomsMasterData_ByID(RoomMasterID: number, DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + "/Get_RoomsMasterData_ByID/" + RoomMasterID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
