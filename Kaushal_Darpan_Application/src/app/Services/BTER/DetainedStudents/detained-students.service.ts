import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { DetainedStudentsDataModel, DetainedStudentsSearchModel } from '../../../Models/BTER/DetainedStudentsDataModel';

@Injectable({
  providedIn: 'root'
})
export class DetainedStudentsService {
  readonly APIUrl = this.appsettingConfig.apiURL + "DetainedStudents";
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
  public async GetAllDetainedStudentsData(searchRequest: DetainedStudentsSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetAllData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async RevokeDetain(Request: DetainedStudentsDataModel) {
    var body = JSON.stringify(Request);
    return await this.http.post(this.APIUrl + "/RevokeDetain", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
