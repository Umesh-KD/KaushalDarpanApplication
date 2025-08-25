import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DTESearchTradeEquipmentsMapping, DTETradeEquipmentsMappingData } from '../../../Models/DTEInventory/DTETradeEquipmentsMappingData';

@Injectable({
  providedIn: 'root'
})
export class DteTradeEquipmentsMappingService {
  readonly APIUrl = this.appsettingConfig.apiURL + "DTETradeEquipmentsMapping";
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
  public async GetAllData(searchRequest: DTESearchTradeEquipmentsMapping) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllRequestData(searchRequest: DTESearchTradeEquipmentsMapping) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllRequestData`, body, this.headersOptions)
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

  public async SaveData(request: DTETradeEquipmentsMappingData) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEquipmentsMappingRequestData(request: DTETradeEquipmentsMappingData) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveEquipmentsMappingRequestData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateStatusData(request: DTETradeEquipmentsMappingData) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/UpdateStatusData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveRequestData(request: DTETradeEquipmentsMappingData) {
    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveRequestData', request, this.headersOptions)
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

  public async HOD_EquipmentVerifications(PK_ID: number, ModifyBy: number, Status: number) {
    return await this.http.post(this.APIUrl + '/HOD_EquipmentVerifications/' + PK_ID + "/" + ModifyBy + "/" + Status, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
