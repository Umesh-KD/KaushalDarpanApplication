import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { DiplomaCertificateDownloadSearchModel, DownloadMarksheetSearchModel, StudentResultSearchModel } from '../../Models/DownloadMarksheetDataModel';
import { MarksheetLetterSearchModel } from '../../Models/MarksheetLetterDataModel';

@Injectable({
  providedIn: 'root'
})
export class MarksheetDownloadService {
  readonly APIUrl = this.appsettingConfig.apiURL + "MarksheetDownload";
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

  public async GetAllData(searchRequest: DownloadMarksheetSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetStudents", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadMarksheetLetter(searchRequest: MarksheetLetterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/MarksheetLetterDownload`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentResult_public(searchRequest: StudentResultSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentResult_public`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetResultEndTermDDLList() {
    return await this.http.post(`${this.APIUrl}/GetResultEndTermDDLList`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadStudentResult_Public(searchRequest: StudentResultSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/DownloadStudentResult_Public`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStudentsDiplomaCertificate(searchRequest: DiplomaCertificateDownloadSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetStudentsDiplomaCertificate", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
