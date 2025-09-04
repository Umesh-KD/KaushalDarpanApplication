import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { InspectionDeploymentDataModel, ITI_InspectionDataModel, ITI_InspectionDropdownModel, ITI_InspectionSearchModel, InspectionMemberDetailsDataModel, SaveCheckSSODataModel } from '../../../Models/ITI/ITI_InspectionDataModel';
import { DTESearchTradeEquipmentsMapping, DTETradeEquipmentsMappingData } from '../../../Models/DTEInventory/DTETradeEquipmentsMappingData';
import { DTEItemCategoriesDataModels } from '../../../Models/DTEInventory/DTEItemCategoriesDataModels';
import { DTEEquipmentsDataModel } from '../../../Models/DTEInventory/DTEEquipmentsDataModel';
import { DTEItemUnitModel } from '../../../Models/DTEInventory/DTEItemUnitModel';
import { DTEInventoryDashboardDataModel } from '../../../Models/DTEInventory/DTEInventoryDashboardDataModel';
import { DTEIssuedSearchModel, DTEReturnItemSearchModel, DTEIssuedItemDataModel, DTEStoksSearchModel, ReturnDteItemDataModel } from '../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { DTEItemsSearchModel, DTEItemsDataModels, inventoryIssueHistorySearchModel, itemReturnModel } from '../../../Models/DTEInventory/DTEItemsDataModels';
import { DTEItemsSearchModel, DTEItemsDataModels, inventoryIssueHistorySearchModel, ItemsIssueReturnModels } from '../../../Models/DTEInventory/DTEItemsDataModels';
import { AuctionDetailsModel, ItemsDetailsInterface } from '../../../Models/ItemsDataModels';

@Injectable({
  providedIn: 'root'
})
export class ITIInventoryService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIInventory";
  readonly headersOptions: any;
  readonly headersOptions1: any;
  constructor(
    private http: HttpClient, 
    private appsettingConfig: AppsettingService
  ) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
     
    };
    this.headersOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'no-loader': 'true'
      })
    };
  }

  extractData(res: Response) {
    return res;
  }

  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }


  public async GetInventoryDashboard(searchRequest: DTEInventoryDashboardDataModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetInventoryDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //Get
  public async GetAllEquipmentsMapping(searchRequest: DTESearchTradeEquipmentsMapping) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllEquipmentsMapping`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllRequestData(searchRequest: DTESearchTradeEquipmentsMapping) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllRequestEquipmentsMapping`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEquipmentsMappingByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetEquipmentsMappingByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEquipmentsMapping(request: DTETradeEquipmentsMappingData) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveEquipmentsMapping', request, this.headersOptions)
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

  public async UpdateStatusEquipmentsMapping(request: DTETradeEquipmentsMappingData) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/UpdateStatusEquipmentsMapping', request, this.headersOptions)
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
  public async DeleteEquipmentsMappingByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteEquipmentsMappingByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
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


  public async GetEquipment_Branch_Wise_CategoryWise(Category: number = 0) {

    return await this.http.get(this.APIUrl + '/GetEquipment_Branch_Wise_CategoryWise/' + Category, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetAllCategoryMaster() {
    return await this.http.get(this.APIUrl + "/GetAllCategoryMaster", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCategoryMasterByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetCategoryMasterByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveCategoryMaster(request: DTEItemCategoriesDataModels) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveCategoryMaster', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeleteCategoryMasterByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteCategoryMasterByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //Get 
  public async GetAllEquipmentsMaster(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetAllEquipmentsMaster", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByIDEquipmentsMaster(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByIDEquipmentsMaster/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEquipmentsMasterData(request: DTEEquipmentsDataModel) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveEquipmentsMasterData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveRequestEquipmentsMapping(request: DTETradeEquipmentsMappingData) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveRequestEquipmentsMapping', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteEquipmentsMasterByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteEquipmentsMasterByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //Get 
  public async GetAllItemUnitMaster() {
    return await this.http.get(this.APIUrl + "/GetAllItemUnitMaster", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetItemUnitMasterByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetItemUnitMasterByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveItemUnitMaster(request: DTEItemUnitModel) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveItemUnitMaster', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteItemUnitMasterByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteItemUnitMasterByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  //Get 
  public async GetAllIssuedItems(searchRequest: DTEIssuedSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllIssuedItems`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllRetunItem(searchRequest: DTEReturnItemSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllRetunItem`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIssuedItemsByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetIssuedItemsByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveIssuedItems(request: DTEIssuedItemDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveIssuedItems', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DeleteIssuedItemsByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteIssuedItemsByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllStoks(searchRequest: DTEStoksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllStoks`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllStoksBalance(searchRequest: DTEStoksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllStoksBalance`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDataReturnItem(request: ReturnDteItemDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveDataReturnItem', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async SaveAuctionData(request: AuctionDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveAuctionData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get
  public async GetAllItemsMaster(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllItemsMaster`, body, this.headersOptions)
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

  public async GetItemsMasterByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetItemsMasterByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveItemsMaster(request: DTEItemsDataModels) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveItemsMaster', request, this.headersOptions)
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
  public async DeleteItemsMasterByID(PK_ID: number, ModifyBy: number) {
    return await this.http.post(this.APIUrl + '/DeleteItemsMasterByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetItemDetails(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetItemDetails/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllItemDetails(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetAllItemDetails/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateItemData(itemsList: ItemsDetailsInterface[]) {
    const body = JSON.stringify(itemsList);
    return await this.http.post(this.APIUrl + '/UpdateItemData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDeadStockReport(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDeadStockReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllAuctionReport(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllAuctionReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDDL(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDDL`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetConsumeItemList(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetConsumeItemList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllinventoryIssueHistory(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllinventoryIssueHistory`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAll_INV_GetCommonIssueDDL(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAll_INV_GetCommonIssueDDL`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
