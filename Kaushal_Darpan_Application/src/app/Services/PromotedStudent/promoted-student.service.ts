import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { PromotedStudentMarkedModel, PromotedStudentSearchModel } from '../../Models/PrometedStudentMasterModel';

@Injectable({
  providedIn: 'root'
})
export class PromotedStudentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "PromotedStudent";
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

  public async GetPromotedStudent(request: PromotedStudentSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetPromotedStudent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIPromotedStudent(request: PromotedStudentSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetITIPromotedStudent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SavePromotedStudent(request: PromotedStudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SavePromotedStudent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveITIPromotedStudent(request: PromotedStudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveITIPromotedStudent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
