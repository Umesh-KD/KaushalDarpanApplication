import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiStudentCenteredActivitesSearchModel } from '../../../Models/ItiStudentCenterActivityDataModel';



@Injectable({
  providedIn: 'root'
})
export class ItiStudentCenterActivityService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ItiStudentCenterActivity";
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

  public async GetAllData(searchRequest: ItiStudentCenteredActivitesSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
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
}
