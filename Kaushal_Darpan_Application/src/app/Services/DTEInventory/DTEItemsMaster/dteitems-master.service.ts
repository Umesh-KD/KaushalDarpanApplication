import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DTEItemsDataModels, ItemsDetailsModel, DTEItemsSearchModel, EquipmentCodeDuplicateSearch } from '../../../Models/DTEInventory/DTEItemsDataModels';
import { AuctionDetailsModel, ItemsDataModels, ItemsDetailsInterface } from '../../../Models/ItemsDataModels';

@Injectable({
  providedIn: 'root'
})
export class DteItemsMasterService {
  readonly APIUrl = this.appsettingConfig.apiURL + "DTEItemsMaster";
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

  public async SaveAuctionData(request: AuctionDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveAuctionData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get
  public async GetAllData(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllAuctionList(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllAuctionList`, body, this.headersOptions)
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

  public async SaveData(request: DTEItemsDataModels) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateStatusItemsData(request: DTEItemsDataModels) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/UpdateStatusItemsData', request, this.headersOptions)
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

  public async GetDTEItemDetails(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetDTEItemDetails/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDTEItemDetails(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetAllDTEItemDetails/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateDTEItemData(itemsList: ItemsDetailsInterface[]) {
    const body = JSON.stringify(itemsList);
    return await this.http.post(this.APIUrl + '/UpdateDTEItemData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async EquipmentCodeDuplicate(request: EquipmentCodeDuplicateSearch)
  {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/EquipmentCodeDuplicate', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
