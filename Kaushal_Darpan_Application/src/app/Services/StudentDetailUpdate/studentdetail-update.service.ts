import { Injectable } from '@angular/core';
import { StudentDetailUpdateModel } from '../../Models/StudentDetailUpdateModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentdetailUpdateService {
  readonly APIUrl = this.appsettingConfig.apiURL + "StudentDetailUpdate";
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

  public async GetStudentDetailUpdate(request: StudentDetailUpdateModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetStudentDetailUpdate", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetByID(PK_ID: number, DepartmentID: number = 0, Eng_NonEng: number = 0) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID + "/" + DepartmentID + "/" + Eng_NonEng, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateStudentData(request: StudentDetailUpdateModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/UpdateStudentData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
