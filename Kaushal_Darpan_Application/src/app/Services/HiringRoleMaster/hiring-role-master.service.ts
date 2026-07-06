import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { AnnouncementTypeMasterModel, HiringRoleMasterDataModel, SanctionOrderDataModel } from '../../Models/HiringRoleMasterDataModel';
import { ItiSanctionOrderList } from '../../Models/ITI/ItiReportDataModel';

@Injectable({
  providedIn: 'root'
})
//export class HiringRoleMasterService {

//  constructor() { }
//}

export class HiringRoleMasterService {
  readonly APIUrl = this.appsettingConfig.apiURL + "HiringRoleMaster";
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
  public async GetAllData() {
    return await this.http.get(this.APIUrl + "/GetAllData", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllSanction() {
    return await this.http.get(this.APIUrl + "/GetAllSanction", this.headersOptions)
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



  public async GetByIDSanction(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByIDSanction/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetByIDSanctionOrder(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByIDSanctionOrder/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: HiringRoleMasterDataModel) {

    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveDataSanction(request: SanctionOrderDataModel) {

    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveDataSanction', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveSanctionOrder(request: ItiSanctionOrderList) {

    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveSanctionOrder', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {

    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async DeleteDataBySanctionID(PK_ID: number, ModifyBy: number) {

    return await this.http.post(this.APIUrl + '/DeleteDataBySanctionID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
   
  //Get all data
  public async GetsanctionOrder(searchRequest: ItiSanctionOrderList) {
    var body = JSON.stringify(searchRequest);
    debugger;
    return await this.http.post(`${this.APIUrl}/GetsanctionOrder`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetOrderDetailsList_ByDate(searchRequest: ItiSanctionOrderList) {
    var body = JSON.stringify(searchRequest);
    debugger;
    return await this.http.post(`${this.APIUrl}/GetOrderDetailsList_ByDate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetsanctionOrderNotAssign(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    debugger;
    return await this.http.post(`${this.APIUrl}/GetsanctionOrderNotAssign`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeleteSanctionOrder(PK_ID: number, ModifyBy: number) {

    return await this.http.post(this.APIUrl + '/DeleteSanctionOrder/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
  async GetAllAnnouncementTypes(request: AnnouncementTypeMasterModel) {
    return await this.http.post(
      `${this.APIUrl}/GetAllAnnouncementTypes`,
      JSON.stringify(request),
      this.headersOptions
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  async GetAnnouncementTypeByID(id: number) {
    return await this.http.get(
      `${this.APIUrl}/GetAnnouncementTypeByID/${id}`,
      this.headersOptions
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  async SaveAnnouncementType(request: AnnouncementTypeMasterModel) {
    return await this.http.post(
      `${this.APIUrl}/SaveAnnouncementType`,
      request,
      this.headersOptions
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  async DeleteAnnouncementTypeByID(id: number, updatedBy: number) {
    return await this.http.post(
      `${this.APIUrl}/DeleteAnnouncementTypeByID/${id}/${updatedBy}`,
      {},
      this.headersOptions
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }



}
