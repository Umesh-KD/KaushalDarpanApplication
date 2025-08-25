import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { StudentsJanAadharSearchModel } from '../../Models/StudentsJanAadharSearchModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsJanaadharService {
  readonly APIUrl = this.appsettingConfig.apiURL + "StudentJanaadhar";
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
  public async GetAllData(searchRequest: StudentsJanAadharSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get all data
  public async GetStudentsJanAadharData(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentsJanAadharData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async postStudentJanaadharForm(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/postStudentJanaadharForm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
}
