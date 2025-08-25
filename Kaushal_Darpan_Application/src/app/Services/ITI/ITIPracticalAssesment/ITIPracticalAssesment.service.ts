import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';


import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../../Common/appsetting.service';
import { TheoryMarksSearchModel } from '../../../Models/TheoryMarksDataModels';
import { ITITheoryMarksSearchModel } from '../../../Models/ITITheoryMarksDataModel';

@Injectable({
  providedIn: 'root'
})
export class ITIPracticalAssesmentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIPracticalAssesment";
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

  public async GetAllData(searchRequest: ITITheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateSaveData(selectedList: any[], InternalPracticalID: number): Promise<any> {
    const body = JSON.stringify(selectedList);
    /* return await this.http.post(this.APIUrl + '/UpdateSaveData/${InternalPracticalID}', body, this.headersOptions)*/
    return this.http.post(`${this.APIUrl}/UpdateSaveData/${InternalPracticalID}`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
