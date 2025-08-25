import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { MarksheetIssueDataModels, MarksheetIssueSearchModel } from '../../Models/MarksheetIssueSearchModel';

@Injectable({
  providedIn: 'root'
})

export class MarksheetIssueDateService {

  readonly APIUrl = this.appsettingConfig.apiURL + "MarksheetIssueDate";
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
  public async GetAllData(searchRequest: MarksheetIssueSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get by id
  public async GetById(MarksheetIssueDataId: number) {
    return await this.http.get(`${this.APIUrl}/GetByID/${MarksheetIssueDataId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //delete
  public async DeleteById(MarksheetIssueDataId: number, userId: number) {
    var body = JSON.stringify({MarksheetIssueDataId, "ModifyBy": userId });
    return await this.http.delete(`${this.APIUrl}/DeleteByID/${MarksheetIssueDataId}/${userId}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //save data
  public async SaveData(request: MarksheetIssueDataModels) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
