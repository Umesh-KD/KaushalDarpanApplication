import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { StudentApplicationModel, StudentApplicationSaveModel } from '../../Models/StudentApplicationDataModel';

@Injectable({
  providedIn: 'root'
})
export class AllotedStudentVerifyService {
  readonly APIUrl = this.appsettingConfig.apiURL + "AllotedStudentVerify";
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

  public async GetAdmittedStudentToVerify(request: StudentApplicationModel) {
    return await this.http.post(this.APIUrl + "/GetAdmittedStudentToVerify", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAdmittedStudentForApproveByAcp(request: StudentApplicationSaveModel[]) {
    return this.http.post(`${this.APIUrl}/SaveAdmittedStudentForApproveByAcp`, request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAdmittedStudentForReturnByAcp(request: StudentApplicationSaveModel[]) {
    return this.http.post(`${this.APIUrl}/SaveAdmittedStudentForReturnByAcp`, request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
}
