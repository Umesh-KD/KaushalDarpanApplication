import { Injectable } from '@angular/core';
import { ExaminerFeedbackDataModel, TheoryMarksSearchModel } from '../../Models/TheoryMarksDataModels';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../Common/appsetting.service';
import { RoleMasterDataModel, UserRoleRightsDataModel } from '../../Models/RoleMasterDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TheoryMarksService {
  readonly APIUrl = this.appsettingConfig.apiURL + "TheoryMarks";
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

  public async GetTheoryMarksDetailList(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTheoryMarksDetailList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateSaveData(selectedList: any[]): Promise<any> {
    const body = JSON.stringify(selectedList);
    return await this.http.post(this.APIUrl + '/UpdateSaveData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTheoryMarksRptData(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTheoryMarksRptData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async FeedbackSubmit(request: ExaminerFeedbackDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/FeedbackSubmit', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async GetTheoryMarks_Admin(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTheoryMarks_Admin`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateTheoryMarks_Admin(selectedList: any[]): Promise<any> {
    const body = JSON.stringify(selectedList);
    return await this.http.post(this.APIUrl + '/UpdateTheoryMarks_Admin', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
