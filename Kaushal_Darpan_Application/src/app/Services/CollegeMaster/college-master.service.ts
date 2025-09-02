import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CollegeListSearchModel, CollegeMasterDataModels, CollegeMasterRequestModel, CollegeMasterSearchModel } from '../../Models/CollegeMasterDataModels';
import { AppsettingService } from '../../Common/appsetting.service';
//import { CollegeMasteDataModels } from '../../Models/CollegeMasterDataModels';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CollegeMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "CollegeMaster";
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
  //public async GetAllData(searchRequest: CollegeMasterSearchModel) {
  //  var body = JSON.stringify(searchRequest);
  //  return await this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}



  public async GetAllData(searchRequest: CollegeMasterSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await firstValueFrom(
      this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        )
    );
  }



  public async GetByID(collegeMasterRequestModel: CollegeMasterRequestModel) {
    return await this.http.post(this.APIUrl + "/GetByID", collegeMasterRequestModel, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StatusChangeByID(InstituteID: number, ActiveStatus: number, UserID: number) {
    return await this.http.get(`${this.APIUrl}/StatusChangeByID/${InstituteID}/${ActiveStatus}/${UserID} `, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: CollegeMasterDataModels) {
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
  public async ActiveStatusByID(PK_ID: number, ModifyBy: number) {
    return await this.http.delete(this.APIUrl + '/UpdateActiveStatusByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateData(PK_ID: number, request: CollegeMasterDataModels) {
    const body = JSON.stringify(request);
    return await this.http.put(this.APIUrl + '/UpdateData/' + PK_ID, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeDashBoardData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetCollegeNodalDashboardData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInstituteProfileStatus(InstituteId: number) {
    //var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + `/GetInstituteProfileStatus/` + InstituteId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegeList(searchRequest: CollegeListSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetCollegeList", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}






