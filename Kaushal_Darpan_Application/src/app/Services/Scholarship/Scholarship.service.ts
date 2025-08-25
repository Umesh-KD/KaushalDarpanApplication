import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel, HrMaster_Action } from '../../Models/HrMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { ScholarshipModel, ScholarshipSearchModel } from '../../Models/ScholarshipDataModel';


@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {

  readonly APIUrl = this.appsettingConfig.apiURL + "Scholarship";
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
  public async GetAllData(searchRequest: ScholarshipSearchModel) {
    var body = JSON.stringify(searchRequest);
    debugger;
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get by id
  public async GetById(ScholarshipID: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${ScholarshipID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  ////save data
  public async SaveData(request: ScholarshipModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(ScholarshipID: number, userId: number) {
    var body = JSON.stringify({ "ScholarshipID": ScholarshipID, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${ScholarshipID}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //public async HrValidationList(searchRequest: HrMasterSearchModel) {
  //  var body = JSON.stringify(searchRequest);
  //  return await this.http.post(`${this.APIUrl}/HrValidationList`, body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
  //public async Save_HrValidation_NodalAction(request: HrMaster_Action) {
  //  const body = JSON.stringify(request);
  //  return await this.http.post(this.APIUrl + "/Save_HrValidation_NodalAction", body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
}
