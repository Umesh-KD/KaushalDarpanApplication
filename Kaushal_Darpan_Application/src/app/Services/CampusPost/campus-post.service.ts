import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CampusPostMasterModel, CampusPostMaster_Action, CampusPostMaster_EligibilityCriteriaModel } from '../../Models/CampusPostDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { SignedCopyOfResultSearchModel, SignedCopyOfResultModel } from '../../Models/CompanyMasterDataModel';
@Injectable({
  providedIn: 'root'
})
export class CampusPostService {
  readonly APIUrl = this.appsettingConfig.apiURL + "CampusPostMaster";
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
  public async GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetNameWiseData(PK_ID: number, DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetNameWiseData/" + PK_ID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: CampusPostMasterModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', body, this.headersOptions)
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
  public async Save_CampusValidation_NodalAction(request: CampusPostMaster_Action) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Save_CampusValidation_NodalAction", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CampusValidationList(CompanyID: number, CollegeID: number, Status: string, DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/CampusValidationList" + "/" + CompanyID + "/" + CollegeID + "/" + Status + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CampusHistoryList(CompanyID: number, CollegeID: number, Status: string, DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/CampusHistoryList" + "/" + CompanyID + "/" + CollegeID + "/" + Status + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllSignedCopyData(request: SignedCopyOfResultSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetAllSignedCopyData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveSignedCopyData(request: SignedCopyOfResultModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveSignedCopyData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteSignedCopyDataByID(PK_ID: number, ModifyBy: number) {

    return await this.http.delete(this.APIUrl + '/DeleteSignedCopyDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSignedCopyById(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetSignedCopyById/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
