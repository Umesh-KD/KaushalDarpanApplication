import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { SeatSearchModel } from '../../Models/SeatMatrixDataModel';
import { GrievanceDataModel, GrivienceReopenModelsDataModel, GrivienceResponseDataModel, GrivienceSearchModel } from '../../Models/GrievanceData/GrievanceDataModel';

@Injectable({
  providedIn: 'root'
})


export class GrievanceService {

  readonly APIUrl = this.appsettingConfig.apiURL + "Grivience";
  readonly headersOptions: any;
  readonly headersOptions1: any;
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

  //public async ShowSeatMetrix(searchRequest: SeatSearchModel) {
  //  var body = JSON.stringify(searchRequest);
  //  return await this.http.post(`${this.APIUrl}/GetShowSeatMetrix`, body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}


  public async SaveData(request: GrievanceDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveReopenData(request: GrivienceReopenModelsDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveReopenData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GrivienceResponseSaveData(Responserequest: GrivienceResponseDataModel) {
    const body = JSON.stringify(Responserequest);
    return await this.http.post(this.APIUrl + '/GrivienceResponseSaveData', Responserequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllData(searchRequest: GrivienceSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetResponseData(searchRequest: GrivienceSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetResponseData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteById(ID: number, userId: number) {
    var body = JSON.stringify({ "HRManagerID": ID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${ID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  


}
