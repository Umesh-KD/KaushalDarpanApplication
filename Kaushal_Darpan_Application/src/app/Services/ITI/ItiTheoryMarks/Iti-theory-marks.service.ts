import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';



import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CenterStudentSearchModel, ITITheoryMarksSearchModel } from '../../../Models/ITITheoryMarksDataModel';
import { TheoryMarksSearchModel } from '../../../Models/TheoryMarksDataModels';

@Injectable({
  providedIn: 'root'
})
export class ItiTheoryMarksService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ItiTheoryMarks";
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

  public async GetTheoryMarksDetailList(searchRequest: ITITheoryMarksSearchModel) {
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

  public async GetCenterStudents(searchRequest: CenterStudentSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCenterStudents`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetNcvtPracticalstudent(Request: CenterStudentSearchModel) {
    return await this.http.post(this.APIUrl + "/GetNcvtPracticalstudent", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
