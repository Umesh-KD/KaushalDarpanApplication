import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HrMasterSearchModel, HrMasterDataModel } from '../../Models/HrMasterDataModel';
import { MenuMasterDataModel, MenuMasterSerchModel } from '../../Models/MenuMasterModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class MenuMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "MenuMaster";
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
  public async GetAllData(searchRequest: MenuMasterSerchModel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetMenuMaster(MenuId: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/GetMenuMaster/' + MenuId, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //Get by id
  public async GetById(ParentMenuID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${ParentMenuID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EditMenuData(request: MenuMasterDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData_EditMenuDetails", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData_AddMenu(request: MenuMasterDataModel) {
    const body = JSON.stringify(request);
    
    return await this.http.post(this.APIUrl + "/SaveData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(MenuId: number, userId: number) {

    var body = JSON.stringify({ "MenuId": MenuId, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${MenuId}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ActiveStatusByID(PK_ID: number, ModifyBy: number) {
    return await this.http.delete(this.APIUrl + '/UpdateActiveStatusByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ParentMenu() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/ParentMenu")
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
