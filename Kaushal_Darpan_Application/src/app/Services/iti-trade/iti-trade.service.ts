import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoleMasterDataModel, UserRoleRightsDataModel } from '../../Models/RoleMasterDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { GroupDataModels, GroupSearchModel } from '../../Models/GroupDataModels';
import { AppsettingService } from '../../Common/appsetting.service';
import { ITITradeDataModels, ITITradeSearchModel } from '../../Models/ITITradeDataModels';
@Injectable({
  providedIn: 'root'
})
export class ItiTradeService {
  

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIMaster";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }


  public async GetAllData(searchRequest: ITITradeSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: ITITradeDataModels) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(TradeId: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${TradeId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return await this.http.post(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllPaperUploadData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllPaperUploadData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SavePaperUploadData(request: any) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SavePaperUploadData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterDetailByPaperUploadID(PaperUploadID: number , Userid :number  , Roleid : number ) {
    //var body = JSON.stringify(searchRequest);
    return await this.http.get(`${this.APIUrl}/GetCenterDetailByPaperUploadID/${PaperUploadID}/${Userid}/${Roleid}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterWisePaperDetail(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetCenterWisePaperDetail`, body , this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PaperDownloadValidationCheck(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PaperDownloadValidationCheck`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterIDByLoginUser(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetCenterIDByLoginUser`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdatePaperDownloadFalg(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UpdatePaperDownloadFalg`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
