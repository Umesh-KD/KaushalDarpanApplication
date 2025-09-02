import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels';
import { CenterMasterDataModels } from '../../Models/CenterMasterDataModels';
import { PaperMasterSearchModel, PapersMasterDataModels } from '../../Models/PaperMasterDataModels';
import { AppsettingService } from '../../Common/appsetting.service';
//import { CollegeMasteDataModels } from '../../Models/CollegeMasterDataModels';


@Injectable({
  providedIn: 'root'
})
export class PaperMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "PaperMaster";
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
  public async GetAllData(searchRequest: PaperMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
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

  public async SaveData(request: PapersMasterDataModels) {


    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
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
  public async GetSubjectListBranchWise(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetSubjectListBranchWise", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PaperSaveData(request: PapersMasterDataModels[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SavePaperData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllDataBranchwithSem(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}






