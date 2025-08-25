import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { CitizenSuggestionFilterModel, CitizenSuggestionModel, CitizenSuggestionQueryModel, SearchRequest, UserRatingDataModel } from '../../Models/CitizenSuggestionDataModel';

@Injectable({
  providedIn: 'root'
})
export class CitizenSuggestionService {

  readonly APIUrl = this.appsettingConfig.apiURL + "CitizenSuggestion";
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


  //save data
  public async SaveData(request: CitizenSuggestionModel) {
    var body = JSON.stringify(request);
   
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async SaveReplayData(request: CitizenSuggestionQueryModel) {
  //  var body = JSON.stringify(request);
  //  return await this.http.post(`${this.APIUrl}/SaveReplayData`, body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}


  public async SaveReplayData(request: CitizenSuggestionQueryModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveReplayData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get all Filter data

  public async GetAllData(searchRequest: SearchRequest) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(PK_ID: number, DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  


  public async GetSRNumberData(searchRequest: SearchRequest) {
    debugger;
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetSRNumberData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSRNDataList(searchRequest: SearchRequest) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetSRNDataList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRecordForOTP(Mobile: number) {
    return await this.http.get(this.APIUrl + "/GetByMobileNo/" + Mobile, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveUserRating(request: UserRatingDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveUserRating`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
