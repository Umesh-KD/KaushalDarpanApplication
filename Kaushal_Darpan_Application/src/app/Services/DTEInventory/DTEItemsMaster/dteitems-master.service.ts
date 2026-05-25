import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DTEItemsSaveModel, DTEItemsDataModels, ItemsDetailsModel, DTEItemsSearchModel, EquipmentCodeDuplicateSearch, CheckItemAuctionSearch, inventoryIssueHistorySearchModel, ItemsIssueReturnModels, DTELabMasterModel, ApproveIssuedItemsDataModel, DTEItemsSearchModel4Lab } from '../../../Models/DTEInventory/DTEItemsDataModels';
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

 
  public async GetAllDataHistory(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataHistory`, body, this.headersOptions)
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


  public async EquipmentCodeDuplicate(request: EquipmentCodeDuplicateSearch) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/EquipmentCodeDuplicate', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateStatusRevertData(request: any) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/UpdateStatusRevertData', request, this.headersOptions)
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

  public async GetConsumeItemList(searchRequest: DTEItemsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetConsumeItemList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveIssueItems(submitRequest: ItemsIssueReturnModels) {
    const body = JSON.stringify(submitRequest);
    return await this.http.post(this.APIUrl + '/SaveIssueItems', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllEquipmentsMaster(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetAllEquipmentsMaster", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetInventoryIssueItemList(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetInventoryIssueItemList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAll_INV_returnItem(submitRequest: ItemsIssueReturnModels) {
    var body = JSON.stringify(submitRequest);
    return await this.http.post(`${this.APIUrl}/GetAll_INV_returnItem`, body, this.headersOptions)
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


  public async GetAllinventoryIssueHistoryTrail(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllinventoryIssueHistoryTrail`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllInventoryIssueReturnItemList(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllInventoryIssueReturnItemList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetItemListType(searchRequest: DTEItemsSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetItemListType`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllItemList(searchRequest: DTEItemsSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllItemList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveIssueItemsList(itemsList: any[]) {
    const body = JSON.stringify(itemsList);
    return await this.http.post(this.APIUrl + '/SaveIssueItemsList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllinventoryIssueReport(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllinventoryIssueReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetIssueItemList(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetIssueItemList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAll_INV_returnItem1(submitRequest: ItemsIssueReturnModels) {
    var body = JSON.stringify(submitRequest);
    return await this.http.post(`${this.APIUrl}/GetAll_INV_returnItem`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInventoryIssueHistoryList(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetInventoryIssueHistoryList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDTEIssueItemListPermanent(EquipmentsId: number, ItemCategoryId: number, InstituteID:number=0) {
    return await this.http.get(this.APIUrl + "/GetDTEIssueItemListPermanent/" + EquipmentsId + "/" + ItemCategoryId + "/" + InstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDTEIssueSubmitPermanent(submitRequest: ItemsIssueReturnModels) {
    var body = JSON.stringify(submitRequest);
    return await this.http.post(`${this.APIUrl}/GetDTEIssueSubmitPermanent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetDTEGetSetLabMaster(labRequest: DTELabMasterModel) {
    return await this.http.post(this.APIUrl + "/GetDTEGetSetLabMaster", labRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DTE_INV_SaveLabItemReturn(submitRequest: ItemsIssueReturnModels) {
    var body = JSON.stringify(submitRequest);
    return await this.http.post(`${this.APIUrl}/DTE_INV_SaveLabItemReturn`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async MarkForAuctionSR6(itemsList: any[]) {
    const body = JSON.stringify(itemsList);
    return await this.http.post(this.APIUrl + '/MarkForAuctionSR6', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_SR5_ReportData(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/Get_SR5_ReportData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_SR6_ReportData(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/Get_SR6_ReportData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadSR6ReportData_pdf_BTER(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/DownloadSR6ReportData_pdf_BTER`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Download_SR5ReportData_pdf_BTER(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/Download_SR5ReportData_pdf_BTER`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIssueItemsForApprove(searchRequest: inventoryIssueHistorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetIssueItemsForApprove`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ApproveIssuedItems(searchRequest: any[]) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ApproveIssuedItems`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
   public async ApproveSR5Items(searchRequest: any[]) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ApproveSR5Items`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
    public async GetAllData4LabIncharge(searchRequest: DTEItemsSearchModel4Lab) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData4LabIncharge`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async MarkAuctionedItems_SR6(request: AuctionDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/MarkAuctionedItems_SR6`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
